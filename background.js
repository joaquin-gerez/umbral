const SITES_KEY = "sites";
const SETTINGS_KEY = "settings";
const ALARM_NAME = "refresh-cooldowns";
const SESSION_ALARM_NAME = "end-focus-session";

const DEFAULT_SETTINGS = {
  enabled: true,
  zenMode: true,
  sound: "rain",
  sessionEndsAt: null
};

let refreshQueue = Promise.resolve();
let creatingOffscreenDocument;

const DEFAULT_PACKS = [
  {
    id: "social-networks",
    kind: "preset",
    name: "Redes sociales",
    description: "Facebook, Instagram, Reddit y Twitter/X",
    domains: ["facebook.com", "instagram.com", "reddit.com", "twitter.com", "x.com"],
    minutes: 30,
    lastVisit: null,
    enabled: true
  },
  {
    id: "popular-distractions",
    kind: "preset",
    name: "Distracciones populares",
    description: "10 sitios de video, redes, streaming y compras",
    domains: [
      "youtube.com",
      "tiktok.com",
      "twitch.tv",
      "netflix.com",
      "pinterest.com",
      "facebook.com",
      "instagram.com",
      "reddit.com",
      "x.com",
      "amazon.com"
    ],
    minutes: 30,
    lastVisit: null,
    enabled: false
  }
];

const domainsFor = (site) => site.domains || [site.domain];
const isLocked = (site, now = Date.now()) =>
  Boolean(site.lastVisit && now < site.lastVisit + site.minutes * 60_000);

async function getState() {
  const stored = await chrome.storage.local.get([SITES_KEY, SETTINGS_KEY]);
  return {
    sites: stored[SITES_KEY] || [],
    settings: { ...DEFAULT_SETTINGS, ...stored[SETTINGS_KEY] }
  };
}

async function ensureDefaults() {
  const { sites, settings } = await getState();
  const migratedSites = sites.map((site) => {
    const preset = DEFAULT_PACKS.find((pack) => pack.id === site.id);
    return preset ? { ...preset, ...site, kind: "preset", description: preset.description } : site;
  });
  const missingPacks = DEFAULT_PACKS.filter(
    (pack) => !migratedSites.some((site) => site.id === pack.id)
  );
  const nextSites = [...migratedSites, ...missingPacks];
  const sitesChanged = JSON.stringify(nextSites) !== JSON.stringify(sites);

  if (sitesChanged || !settings._initialized) {
    const nextSettings = { ...settings, _initialized: true };
    await chrome.storage.local.set({
      [SITES_KEY]: nextSites,
      [SETTINGS_KEY]: nextSettings
    });
    return { sites: nextSites, settings: nextSettings };
  }

  return { sites, settings };
}

function rulesFor(sites, enabled) {
  if (!enabled) return [];
  return sites
    .filter((site) => site.enabled !== false && isLocked(site))
    .flatMap((site) => domainsFor(site))
    .map((domain, index) => ({
      id: index + 1,
      priority: 1,
      action: { type: "redirect", redirect: { extensionPath: "/blocked/blocked.html" } },
      condition: {
        urlFilter: `||${domain}^`,
        resourceTypes: ["main_frame"]
      }
    }));
}

async function updateBadge(enabled) {
  await chrome.action.setBadgeBackgroundColor({ color: enabled ? "#9fd8b5" : "#64736b" });
  await chrome.action.setBadgeText({ text: enabled ? "ON" : "OFF" });
  await chrome.action.setBadgeTextColor({ color: enabled ? "#12352a" : "#ffffff" });
}

async function hasOffscreenDocument() {
  const contexts = await chrome.runtime.getContexts({
    contextTypes: ["OFFSCREEN_DOCUMENT"],
    documentUrls: [chrome.runtime.getURL("offscreen/audio.html")]
  });
  return contexts.length > 0;
}

async function ensureOffscreenDocument() {
  if (await hasOffscreenDocument()) return;
  if (!creatingOffscreenDocument) {
    creatingOffscreenDocument = chrome.offscreen.createDocument({
      url: "offscreen/audio.html",
      reasons: ["AUDIO_PLAYBACK"],
      justification: "Reproducir el ambiente elegido mientras Modo Zen está activo"
    }).finally(() => {
      creatingOffscreenDocument = null;
    });
  }
  await creatingOffscreenDocument;
}

async function syncZenAudio(settings) {
  const shouldPlay = settings.enabled && settings.zenMode && settings.sound !== "none";
  if (shouldPlay) {
    await ensureOffscreenDocument();
    const response = await chrome.runtime.sendMessage({
      type: "ZEN_AUDIO_SET",
      target: "offscreen",
      sound: settings.sound
    });
    if (!response?.ok) throw new Error(response?.error || "El audio no pudo iniciarse");
    return;
  }
  if (await hasOffscreenDocument()) {
    await chrome.runtime.sendMessage({ type: "ZEN_AUDIO_STOP", target: "offscreen" });
    await chrome.offscreen.closeDocument();
  }
}

async function expireSession(settings) {
  const sessionEndsAt = Number(settings.sessionEndsAt);
  if (!sessionEndsAt || Date.now() < sessionEndsAt) return settings;

  const nextSettings = { ...settings, enabled: false, sessionEndsAt: null };
  await chrome.storage.local.set({ [SETTINGS_KEY]: nextSettings });
  return nextSettings;
}

async function syncSessionAlarm(settings) {
  const sessionEndsAt = Number(settings.sessionEndsAt);
  if (settings.enabled && sessionEndsAt > Date.now()) {
    await chrome.alarms.create(SESSION_ALARM_NAME, { when: sessionEndsAt });
    return;
  }
  await chrome.alarms.clear(SESSION_ALARM_NAME);
}

async function refreshRules() {
  const state = await ensureDefaults();
  const sites = state.sites;
  const settings = await expireSession(state.settings);
  const existing = await chrome.declarativeNetRequest.getDynamicRules();
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: existing.map((rule) => rule.id),
    addRules: rulesFor(sites, settings.enabled)
  });
  await syncSessionAlarm(settings);
  await updateBadge(settings.enabled);
  try {
    await syncZenAudio(settings);
  } catch (error) {
    console.error("Umbral no pudo sincronizar el audio de Modo Zen", error);
  }
}

function scheduleRefresh() {
  refreshQueue = refreshQueue.then(refreshRules, refreshRules);
  return refreshQueue;
}

async function recordAllowedVisit(url) {
  let hostname;
  try {
    hostname = new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return;
  }

  const { sites, settings } = await getState();
  if (!settings.enabled) return;

  const now = Date.now();
  let changed = false;
  sites.forEach((site) => {
    const matches = site.enabled !== false && domainsFor(site).some(
      (domain) => hostname === domain || hostname.endsWith(`.${domain}`)
    );
    if (matches && !isLocked(site, now)) {
      site.lastVisit = now;
      changed = true;
    }
  });

  if (!changed) return;
  await chrome.storage.local.set({ [SITES_KEY]: sites });
}

chrome.webNavigation.onCommitted.addListener(({ frameId, url }) => {
  if (frameId === 0) recordAllowedVisit(url);
});

chrome.runtime.onInstalled.addListener(async () => {
  await chrome.alarms.create(ALARM_NAME, { periodInMinutes: 1 });
  await scheduleRefresh();
});

chrome.runtime.onStartup.addListener(scheduleRefresh);
chrome.alarms.onAlarm.addListener(({ name }) => {
  if (name === ALARM_NAME || name === SESSION_ALARM_NAME) scheduleRefresh();
});
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && (changes[SITES_KEY] || changes[SETTINGS_KEY])) scheduleRefresh();
});

scheduleRefresh();
