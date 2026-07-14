const REFLECTIONS = [
  { text: "La atención es la forma más rara y más pura de la generosidad.", source: "Simone Weil · Carta a Joë Bousquet" },
  { text: "Toda la desdicha de los hombres proviene de no saber permanecer en reposo en una habitación.", source: "Blaise Pascal · Pensamientos" },
  { text: "Quien tiene un porqué para vivir puede soportar casi cualquier cómo.", source: "Friedrich Nietzsche · Crepúsculo de los ídolos" },
  { text: "El alma queda teñida por sus pensamientos.", source: "Marco Aurelio · Meditaciones, V.16" },
  { text: "En ninguna parte encuentra el hombre un retiro más tranquilo que en su propia alma.", source: "Marco Aurelio · Meditaciones, IV.3" },
  { text: "No son las cosas las que perturban a los hombres, sino los juicios que forman sobre ellas.", source: "Epicteto · Manual, V" },
  { text: "No es que tengamos poco tiempo, sino que perdemos mucho.", source: "Séneca · De la brevedad de la vida" },
  { text: "Estar en todas partes es no estar en ninguna.", source: "Séneca · Cartas a Lucilio, II" },
  { text: "Fui a los bosques porque quería vivir deliberadamente.", source: "Henry David Thoreau · Walden" },
  { text: "Nada puede darte paz salvo vos mismo.", source: "Ralph Waldo Emerson · Confianza en uno mismo" },
  { text: "Mi experiencia es aquello a lo que decido prestar atención.", source: "William James · Principios de psicología" },
  { text: "Lo que propongo es muy simple: pensar en lo que estamos haciendo.", source: "Hannah Arendt · La condición humana" },
  { text: "Distraídos de la distracción por la distracción.", source: "T. S. Eliot · Burnt Norton" },
  { text: "Viví ahora las preguntas.", source: "Rainer Maria Rilke · Cartas a un joven poeta" },
  { text: "Existo como soy; eso es suficiente.", source: "Walt Whitman · Canto de mí mismo" },
  { text: "No es necesario que salgas de casa. Quedate a tu mesa y escuchá.", source: "Franz Kafka · Aforismos de Zürau, 109" },
  { text: "Despacito y buena letra: hacer las cosas bien importa más que hacerlas.", source: "Antonio Machado · Nuevas canciones" },
  { text: "Mi oficio y mi arte es vivir.", source: "Michel de Montaigne · Ensayos, II.6" },
  { text: "No hay barrera, cerradura ni cerrojo que puedas imponer a la libertad de mi mente.", source: "Virginia Woolf · Una habitación propia" },
  { text: "La verdadera generosidad con el porvenir consiste en entregarlo todo al presente.", source: "Albert Camus · El hombre rebelde" },
  { text: "La vida sólo puede comprenderse hacia atrás, pero debe vivirse hacia adelante.", source: "Søren Kierkegaard · Diarios, 1843" },
  { text: "Yo soy yo y mi circunstancia; si no la salvo a ella, no me salvo yo.", source: "José Ortega y Gasset · Meditaciones del Quijote" },
  { text: "Hace falta un alma sana para sentir los encantos del retiro.", source: "Jean-Jacques Rousseau · Pensamientos" },
  { text: "Un hombre sólo puede ser él mismo mientras está solo.", source: "Arthur Schopenhauer · Parerga y paralipómena" },
  { text: "El secreto de la existencia no es sólo vivir, sino tener un motivo para vivir.", source: "Fiódor Dostoyevski · Los hermanos Karamázov" },
  { text: "Nos hemos convertido en una herramienta del smartphone: nos usa a nosotros, y no al revés.", source: "Byung-Chul Han · Discurso del Premio Princesa de Asturias" }
];

const breathMark = document.querySelector("#breath-mark");
const breathLabel = document.querySelector("#breath-label");
const breathTimer = document.querySelector("#breath-timer");
let breathingTimeout;
let breathingTimer;

function showReflection() {
  const random = crypto.getRandomValues(new Uint32Array(1))[0];
  const storedIndex = sessionStorage.getItem("reflectionIndex");
  const previousIndex = storedIndex === null ? -1 : Number(storedIndex);
  let index = random % REFLECTIONS.length;
  if (index === previousIndex) index = (index + 1) % REFLECTIONS.length;
  sessionStorage.setItem("reflectionIndex", String(index));
  const reflection = REFLECTIONS[index];
  document.querySelector("#reflection").textContent = reflection.text;
  document.querySelector("#reflection-source").textContent = reflection.source;
}

function startBreathing() {
  const startedAt = Date.now();
  const duration = 30_000;

  function nextPhase() {
    const elapsed = Date.now() - startedAt;
    if (elapsed >= duration) {
      breathMark.className = "breath-mark is-complete";
      breathLabel.textContent = "Listo";
      breathTimer.textContent = "";
      return;
    }

    const cyclePosition = elapsed % 10_000;
    const inhale = cyclePosition < 4_000;
    breathMark.className = `breath-mark ${inhale ? "is-inhaling" : "is-exhaling"}`;
    breathLabel.textContent = inhale ? "Inhalá" : "Exhalá";
    breathingTimeout = setTimeout(nextPhase, inhale ? 4_000 - cyclePosition : 10_000 - cyclePosition);
  }

  nextPhase();
  breathingTimer = setInterval(() => {
    const remaining = Math.max(0, duration - (Date.now() - startedAt));
    breathTimer.textContent = remaining ? `${Math.ceil(remaining / 1000)} segundos` : "";
    if (!remaining) clearInterval(breathingTimer);
  }, 1_000);
}

function initialize() {
  try {
    showReflection();
    startBreathing();
  } finally {
    document.body.classList.remove("is-loading");
  }
}

window.addEventListener("pagehide", () => {
  clearTimeout(breathingTimeout);
  clearInterval(breathingTimer);
});
initialize();
