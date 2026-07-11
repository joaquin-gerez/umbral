import fs from "node:fs";
import zlib from "node:zlib";

const COLORS = {
  background: [11, 20, 16, 255],
  frame: [82, 100, 90, 255],
  accent: [155, 197, 168, 255],
  clear: [0, 0, 0, 0]
};

const crcTable = Array.from({ length: 256 }, (_, value) => {
  let current = value;
  for (let bit = 0; bit < 8; bit += 1) current = current & 1 ? 0xedb88320 ^ (current >>> 1) : current >>> 1;
  return current >>> 0;
});

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const name = Buffer.from(type);
  const length = Buffer.alloc(4);
  const checksum = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  checksum.writeUInt32BE(crc32(Buffer.concat([name, data])));
  return Buffer.concat([length, name, data, checksum]);
}

function distanceToSegment(x, y, x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const position = Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(x - (x1 + position * dx), y - (y1 + position * dy));
}

function sample(x, y) {
  const radius = 0.18;
  const edgeX = Math.max(radius, Math.min(1 - radius, x));
  const edgeY = Math.max(radius, Math.min(1 - radius, y));
  if (Math.hypot(x - edgeX, y - edgeY) > radius) return COLORS.clear;

  let color = COLORS.background;
  const frameWidth = 0.022;
  const onFrame = distanceToSegment(x, y, .305, .738, .305, .262) < frameWidth
    || distanceToSegment(x, y, .305, .262, .695, .262) < frameWidth
    || distanceToSegment(x, y, .695, .262, .695, .738) < frameWidth;
  if (onFrame) color = COLORS.frame;
  if (distanceToSegment(x, y, .22, .738, .78, .738) < .018) color = COLORS.accent;
  if (Math.hypot(x - .5, y - .66) < .133) color = COLORS.accent;
  return color;
}

function createPng(size) {
  const samples = 4;
  const rowLength = size * 4 + 1;
  const raw = Buffer.alloc(rowLength * size);
  for (let y = 0; y < size; y += 1) {
    raw[y * rowLength] = 0;
    for (let x = 0; x < size; x += 1) {
      const total = [0, 0, 0, 0];
      for (let sy = 0; sy < samples; sy += 1) {
        for (let sx = 0; sx < samples; sx += 1) {
          const color = sample((x + (sx + .5) / samples) / size, (y + (sy + .5) / samples) / size);
          color.forEach((channel, index) => { total[index] += channel; });
        }
      }
      const offset = y * rowLength + 1 + x * 4;
      total.forEach((channel, index) => { raw[offset + index] = Math.round(channel / (samples * samples)); });
    }
  }

  const header = Buffer.alloc(13);
  header.writeUInt32BE(size, 0);
  header.writeUInt32BE(size, 4);
  header[8] = 8;
  header[9] = 6;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", header),
    chunk("IDAT", zlib.deflateSync(raw)),
    chunk("IEND", Buffer.alloc(0))
  ]);
}

for (const size of [16, 48, 128]) {
  fs.writeFileSync(new URL(`../icons/icon-${size}.png`, import.meta.url), createPng(size));
}
