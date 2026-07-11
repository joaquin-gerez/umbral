const SETTINGS_KEY = "settings";

const REFLECTIONS = [
  {
    text: "El secreto de la existencia humana no consiste sólo en poseer la vida, sino también en tener un motivo para vivir.",
    source: "Fiódor Dostoyevski · Los hermanos Karamázov"
  },
  {
    text: "La televisión posee una especie de monopolio de hecho sobre la formación de las mentes de una gran parte de la población.",
    source: "Pierre Bourdieu · Sobre la televisión"
  },
  {
    text: "La atención es la forma más rara y más pura de la generosidad.",
    source: "Simone Weil · Carta a Joë Bousquet"
  },
  {
    text: "Todos los problemas de la humanidad provienen de la incapacidad del hombre para sentarse solo y tranquilo en una habitación.",
    source: "Blaise Pascal · Pensamientos"
  },
  {
    text: "Quien tiene un porqué para vivir puede soportar casi cualquier cómo.",
    source: "Friedrich Nietzsche · Crepúsculo de los ídolos"
  },
  {
    text: "Un hombre puede ser él mismo sólo mientras está solo.",
    source: "Arthur Schopenhauer · Parerga y paralipómena"
  },
  {
    text: "El alma queda teñida por las representaciones.",
    source: "Marco Aurelio · Meditaciones, V.16"
  },
  {
    text: "Nos hemos convertido en una herramienta del smartphone: nos usa a nosotros, y no al revés.",
    source: "Byung-Chul Han · Discurso, 2025"
  }
];

const breathOrb = document.querySelector("#breath-orb");
const breathLabel = document.querySelector("#breath-label");
const breathTimer = document.querySelector("#breath-timer");
let breathingTimeout;

function showReflection() {
  const random = crypto.getRandomValues(new Uint32Array(1))[0];
  const reflection = REFLECTIONS[random % REFLECTIONS.length];
  document.querySelector("#reflection").textContent = reflection.text;
  document.querySelector("#reflection-source").textContent = reflection.source;
}

function startBreathing() {
  const startedAt = Date.now();
  const duration = 30_000;

  function nextPhase() {
    const elapsed = Date.now() - startedAt;
    if (elapsed >= duration) {
      breathOrb.className = "breath-orb is-complete";
      breathLabel.textContent = "Listo";
      breathTimer.textContent = "";
      return;
    }

    const cyclePosition = elapsed % 10_000;
    const inhale = cyclePosition < 4_000;
    breathOrb.className = `breath-orb ${inhale ? "is-inhaling" : "is-exhaling"}`;
    breathLabel.textContent = inhale ? "Inhalá" : "Exhalá";
    breathingTimeout = setTimeout(nextPhase, inhale ? 4_000 - cyclePosition : 10_000 - cyclePosition);
  }

  nextPhase();
  const timer = setInterval(() => {
    const remaining = Math.max(0, duration - (Date.now() - startedAt));
    breathTimer.textContent = remaining ? `${Math.ceil(remaining / 1000)} segundos` : "";
    if (!remaining) clearInterval(timer);
  }, 1_000);
}

async function initialize() {
  const stored = await chrome.storage.local.get(SETTINGS_KEY);
  const settings = { zenMode: true, ...stored[SETTINGS_KEY] };
  document.body.classList.toggle("without-breathing", !settings.zenMode);
  showReflection();
  if (settings.zenMode) startBreathing();
}

window.addEventListener("pagehide", () => clearTimeout(breathingTimeout));
initialize();
