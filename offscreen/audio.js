let context;
let currentSound;
let master;
let activeNodes = [];
let timers = [];

function remember(node) {
  activeNodes.push(node);
  return node;
}

function clearAudio() {
  timers.forEach(clearInterval);
  timers = [];
  activeNodes.forEach((node) => {
    try { node.stop?.(); } catch {}
    try { node.disconnect(); } catch {}
  });
  activeNodes = [];
  master?.disconnect();
  master = null;
  currentSound = null;
}

function createNoise(type = "white") {
  const length = context.sampleRate * 4;
  const buffer = context.createBuffer(1, length, context.sampleRate);
  const data = buffer.getChannelData(0);
  let previous = 0;
  for (let index = 0; index < length; index += 1) {
    const white = Math.random() * 2 - 1;
    if (type === "brown") {
      previous = (previous + 0.02 * white) / 1.02;
      data[index] = previous * 3.2;
    } else {
      data[index] = white;
    }
  }
  const source = remember(context.createBufferSource());
  source.buffer = buffer;
  source.loop = true;
  source.start();
  return source;
}

function playTone(frequency, start, duration, volume, waveform = "sine", pan = 0) {
  const oscillator = remember(context.createOscillator());
  const gain = remember(context.createGain());
  const panner = remember(context.createStereoPanner());
  oscillator.type = waveform;
  oscillator.frequency.value = frequency;
  panner.pan.value = pan;
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.08);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  oscillator.connect(gain).connect(panner).connect(master);
  oscillator.addEventListener("ended", () => {
    [oscillator, gain, panner].forEach((node) => {
      try { node.disconnect(); } catch {}
      activeNodes = activeNodes.filter((activeNode) => activeNode !== node);
    });
  });
  oscillator.start(start);
  oscillator.stop(start + duration + 0.05);
}

function startNoise(sound) {
  const source = createNoise(sound === "brown" ? "brown" : "white");
  const filter = remember(context.createBiquadFilter());
  const gain = remember(context.createGain());
  filter.type = "lowpass";
  filter.frequency.value = sound === "rain" ? 1350 : 480;
  gain.gain.value = sound === "rain" ? 0.055 : 0.1;
  source.connect(filter).connect(gain).connect(master);
}

function startBinaural() {
  startNoise("brown");
  const left = remember(context.createOscillator());
  const right = remember(context.createOscillator());
  const leftPan = remember(context.createStereoPanner());
  const rightPan = remember(context.createStereoPanner());
  const gain = remember(context.createGain());
  left.frequency.value = 180;
  right.frequency.value = 194;
  leftPan.pan.value = -1;
  rightPan.pan.value = 1;
  gain.gain.value = 0.028;
  left.connect(leftPan).connect(gain).connect(master);
  right.connect(rightPan).connect(gain).connect(master);
  left.start();
  right.start();
}

const PATTERNS = {
  lofi: {
    length: 12,
    step: 3,
    waveform: "triangle",
    volume: 0.025,
    chords: [[130.81, 164.81, 196, 246.94], [110, 130.81, 164.81, 220], [98, 123.47, 146.83, 196], [116.54, 146.83, 174.61, 220]]
  },
  jazz: {
    length: 12.8,
    step: 3.2,
    waveform: "sine",
    volume: 0.021,
    chords: [[130.81, 164.81, 196, 233.08], [146.83, 174.61, 220, 261.63], [123.47, 155.56, 185, 220], [110, 138.59, 164.81, 196]]
  }
};

function startChordPattern(style) {
  const pattern = PATTERNS[style];
  const schedule = () => {
    const base = context.currentTime + 0.08;
    pattern.chords.forEach((chord, chordIndex) => {
      chord.forEach((frequency, noteIndex) => {
        playTone(frequency, base + chordIndex * pattern.step, pattern.step + 0.7, pattern.volume, pattern.waveform, (noteIndex - 1.5) * 0.18);
      });
    });
  };
  schedule();
  timers.push(setInterval(schedule, pattern.length * 1000));
}

function startClassical() {
  const notes = [261.63, 329.63, 392, 523.25, 246.94, 329.63, 392, 493.88, 220, 261.63, 329.63, 440];
  const schedule = () => {
    const base = context.currentTime + 0.08;
    notes.forEach((frequency, index) => playTone(frequency, base + index * 0.72, 1.6, 0.022, "sine", index % 2 ? 0.12 : -0.12));
  };
  schedule();
  timers.push(setInterval(schedule, 8_640));
}

function startMeditation() {
  [110, 164.81, 220].forEach((frequency, index) => {
    const oscillator = remember(context.createOscillator());
    const gain = remember(context.createGain());
    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    gain.gain.value = 0.018 / (index + 1);
    oscillator.connect(gain).connect(master);
    oscillator.start();
  });
  const chime = () => playTone(659.25, context.currentTime + 0.05, 4.5, 0.018, "sine", 0.25);
  chime();
  timers.push(setInterval(chime, 7_500));
}

async function startAudio(sound) {
  if (currentSound === sound && context?.state === "running") return;
  clearAudio();
  context = context || new AudioContext();
  await context.resume();
  master = context.createGain();
  master.gain.value = 0.42;
  master.connect(context.destination);
  currentSound = sound;

  if (sound === "rain" || sound === "brown") startNoise(sound);
  if (sound === "binaural") startBinaural();
  if (sound === "lofi" || sound === "jazz") startChordPattern(sound);
  if (sound === "classical") startClassical();
  if (sound === "meditation") startMeditation();
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "ZEN_AUDIO_SET") startAudio(message.sound);
  if (message.type === "ZEN_AUDIO_STOP") clearAudio();
});
