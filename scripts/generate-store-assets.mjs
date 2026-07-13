import fs from "node:fs";
import zlib from "node:zlib";

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

function mix(from, to, amount) {
  return from.map((channel, index) => Math.round(channel + (to[index] - channel) * amount));
}

function distanceToSegment(x, y, x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const position = Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(x - (x1 + position * dx), y - (y1 + position * dy));
}

function sample(x, y, width, height) {
  const aspect = width / height;
  const background = mix([11, 20, 16, 255], [24, 43, 34, 255], Math.min(1, x * .72 + y * .28));
  const glow = Math.max(0, 1 - Math.hypot((x - .74) * aspect, y - .27) / .72);
  let color = mix(background, [48, 82, 64, 255], glow * .42);

  const grain = (Math.sin(x * width * .23) * Math.sin(y * height * .19) + 1) / 2;
  color = mix(color, [255, 255, 255, 255], grain * .018);

  const centerX = width > 600 ? .72 : .67;
  const centerY = .52;
  const scaleX = 1 / aspect;
  const ringDistance = Math.abs(Math.hypot((x - centerX) / scaleX, y - centerY) - .255);
  if (ringDistance < .008) color = [91, 119, 102, 255];
  if (Math.hypot((x - centerX) / scaleX, y - (centerY + .09)) < .105) color = [167, 216, 184, 255];

  const frameWidth = .006;
  const left = centerX - .16 * scaleX;
  const right = centerX + .16 * scaleX;
  const top = centerY - .19;
  const bottom = centerY + .19;
  if (
    distanceToSegment(x, y, left, bottom, left, top) < frameWidth
    || distanceToSegment(x, y, left, top, right, top) < frameWidth
    || distanceToSegment(x, y, right, top, right, bottom) < frameWidth
  ) color = [107, 137, 119, 255];

  const horizon = .78 + Math.sin(x * 9) * .008;
  if (Math.abs(y - horizon) < .004) color = [167, 216, 184, 255];
  return color;
}

function createPng(width, height) {
  const rowLength = width * 4 + 1;
  const raw = Buffer.alloc(rowLength * height);
  for (let y = 0; y < height; y += 1) {
    raw[y * rowLength] = 0;
    for (let x = 0; x < width; x += 1) {
      const color = sample((x + .5) / width, (y + .5) / height, width, height);
      const offset = y * rowLength + 1 + x * 4;
      color.forEach((channel, index) => { raw[offset + index] = channel; });
    }
  }

  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header[8] = 8;
  header[9] = 6;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", header),
    chunk("IDAT", zlib.deflateSync(raw)),
    chunk("IEND", Buffer.alloc(0))
  ]);
}

const outputDirectory = new URL("../store-assets/", import.meta.url);
fs.mkdirSync(outputDirectory, { recursive: true });
fs.writeFileSync(new URL("small-promo-440x280.png", outputDirectory), createPng(440, 280));
fs.writeFileSync(new URL("marquee-1400x560.png", outputDirectory), createPng(1400, 560));
