const SITES_KEY = "sites";
const SETTINGS_KEY = "settings";
const DEFAULT_SETTINGS = { enabled: true, zenMode: true, sound: "rain" };

const SOUND_NAMES = {
  rain: "Lluvia suave",
  brown: "Ruido marrón",
  binaural: "Binaural 14 Hz",
  lofi: "Lo-fi lento",
  jazz: "Jazz nocturno",
  classical: "Clásica minimal",
  meditation: "Meditación",
  none: "Sin sonido"
};

const form = document.querySelector("#site-form");
const domainInput = document.querySelector("#domain");
const minutesInput = document.querySelector("#minutes");
const list = document.querySelector("#site-list");
const error = document.querySelector("#form-error");
const masterToggle = document.querySelector("#master-toggle");
const masterStatus = document.querySelector("#master-status");
const zenToggle = document.querySelector("#zen-toggle");
const zenStatus = document.querySelector("#zen-status");
const soundSelect = document.querySelector("#sound-select");
const siteSummary = document.querySelector("#site-summary");
const addPanel = document.querySelector("#add-panel");

const domainsFor = (site) => site.domains || [site.domain];
const siteName = (site) => site.name || site.domain;
const isLocked = (site) =>
  Boolean(site.lastVisit && Date.now() < site.lastVisit + site.minutes * 60_000);

function normalizeDomain(value) {
  const candidate = value.trim().toLowerCase();
  if (!candidate) return null;
  try {
    const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
    return url.hostname.replace(/^www\./, "") || null;
  } catch {
    return null;
  }
}

function remainingText(site) {
  if (!isLocked(site)) return "Disponible ahora";
  const remaining = site.lastVisit + site.minutes * 60_000 - Date.now();
  return `En pausa · ${Math.ceil(remaining / 60_000)} min`;
}

async function getState() {
  const stored = await chrome.storage.local.get([SITES_KEY, SETTINGS_KEY]);
  return {
    sites: stored[SITES_KEY] || [],
    settings: { ...DEFAULT_SETTINGS, ...stored[SETTINGS_KEY] }
  };
}

async function saveSettings(patch) {
  const { settings } = await getState();
  await chrome.storage.local.set({ [SETTINGS_KEY]: { ...settings, ...patch } });
}

function renderStatus(sites, settings) {
  const activeCount = sites.filter((site) => site.enabled !== false).length;
  masterToggle.checked = settings.enabled;
  zenToggle.checked = settings.zenMode;
  soundSelect.value = settings.sound;
  soundSelect.disabled = !settings.zenMode;
  masterStatus.textContent = settings.enabled ? "Activo" : "En pausa";
  document.body.classList.toggle("protection-off", !settings.enabled);
  document.body.classList.toggle("zen-playing", settings.enabled && settings.zenMode && settings.sound !== "none");
  zenStatus.textContent = settings.zenMode
    ? settings.sound === "none"
      ? "Pausa y respiración, sin audio"
      : `${SOUND_NAMES[settings.sound]} en segundo plano`
    : "Desactivado";
  siteSummary.textContent = `${activeCount} ${activeCount === 1 ? "protección activa" : "protecciones activas"}`;
}

function renderSites(sites) {
  list.textContent = "";
  sites.forEach((site) => {
    const item = document.createElement("li");
    const active = site.enabled !== false;
    item.className = `site-row${active ? "" : " is-disabled"}`;
    item.innerHTML = `
      <div class="site-copy">
        <strong>${siteName(site)}</strong>
        <span>${site.description || domainsFor(site).join(" · ")}</span>
        <small>${active ? remainingText(site) : "Desactivada"} · cada ${site.minutes === 60 ? "1 hora" : `${site.minutes} min`}</small>
      </div>
      <div class="site-actions">
        <label class="switch row-switch">
          <span class="sr-only">Activar ${siteName(site)}</span>
          <input class="site-toggle" type="checkbox" data-id="${site.id}" ${active ? "checked" : ""}>
          <span class="switch-track" aria-hidden="true"></span>
        </label>
        ${site.kind === "preset" ? "" : `<button class="remove" type="button" aria-label="Quitar ${siteName(site)}" data-id="${site.id}">Quitar</button>`}
      </div>
    `;
    list.append(item);
  });
}

async function update() {
  const { sites, settings } = await getState();
  renderStatus(sites, settings);
  renderSites(sites);
}

function setAddPanel(open) {
  addPanel.hidden = !open;
  if (open) setTimeout(() => domainInput.focus(), 0);
  else {
    error.textContent = "";
    form.reset();
  }
}

masterToggle.addEventListener("change", () => saveSettings({ enabled: masterToggle.checked }));
zenToggle.addEventListener("change", () => saveSettings({ zenMode: zenToggle.checked }));
soundSelect.addEventListener("change", () => saveSettings({ sound: soundSelect.value }));
document.querySelector("#open-add").addEventListener("click", () => setAddPanel(true));
document.querySelector("#close-add").addEventListener("click", () => setAddPanel(false));
document.querySelector("#close-add-icon").addEventListener("click", () => setAddPanel(false));

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  error.textContent = "";
  const domain = normalizeDomain(domainInput.value);
  if (!domain || domain.includes(" ")) {
    error.textContent = "Escribí un dominio válido, por ejemplo youtube.com.";
    return;
  }
  const { sites } = await getState();
  if (sites.some((site) => domainsFor(site).includes(domain))) {
    error.textContent = "Ese sitio ya está dentro de una protección.";
    return;
  }
  sites.push({
    id: crypto.randomUUID(),
    kind: "custom",
    domain,
    domains: [domain],
    minutes: Number(minutesInput.value),
    lastVisit: null,
    enabled: true
  });
  await chrome.storage.local.set({ [SITES_KEY]: sites });
  setAddPanel(false);
});

list.addEventListener("change", async (event) => {
  const toggle = event.target.closest(".site-toggle");
  if (!toggle) return;
  const { sites } = await getState();
  const site = sites.find((item) => item.id === toggle.dataset.id);
  if (site) site.enabled = toggle.checked;
  await chrome.storage.local.set({ [SITES_KEY]: sites });
});

list.addEventListener("click", async (event) => {
  const button = event.target.closest(".remove");
  if (!button) return;
  const { sites } = await getState();
  await chrome.storage.local.set({
    [SITES_KEY]: sites.filter((site) => site.id !== button.dataset.id)
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !addPanel.hidden) setAddPanel(false);
});
chrome.storage.onChanged.addListener(update);
update();
setInterval(update, 30_000);
