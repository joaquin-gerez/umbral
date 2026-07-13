import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const root = path.resolve(import.meta.dirname, "..");
const manifest = JSON.parse(fs.readFileSync(path.join(root, "manifest.json"), "utf8"));
const included = ["manifest.json", "background.js", "popup", "blocked", "offscreen", "icons"];

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

function collect(entry) {
  const absolute = path.join(root, entry);
  if (fs.statSync(absolute).isFile()) return [entry];
  return fs.readdirSync(absolute, { withFileTypes: true }).flatMap((item) => {
    const child = path.join(entry, item.name);
    return item.isDirectory() ? collect(child) : [child];
  });
}

function dosTimestamp(date) {
  const year = Math.max(1980, date.getFullYear());
  return {
    time: (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2),
    date: ((year - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate()
  };
}

let offset = 0;
const localParts = [];
const centralParts = [];

for (const relativePath of included.flatMap(collect).sort()) {
  const fileName = Buffer.from(relativePath.split(path.sep).join("/"));
  const source = fs.readFileSync(path.join(root, relativePath));
  const compressed = zlib.deflateRawSync(source, { level: 9 });
  const checksum = crc32(source);
  const { time, date } = dosTimestamp(fs.statSync(path.join(root, relativePath)).mtime);

  const localHeader = Buffer.alloc(30);
  localHeader.writeUInt32LE(0x04034b50, 0);
  localHeader.writeUInt16LE(20, 4);
  localHeader.writeUInt16LE(0, 6);
  localHeader.writeUInt16LE(8, 8);
  localHeader.writeUInt16LE(time, 10);
  localHeader.writeUInt16LE(date, 12);
  localHeader.writeUInt32LE(checksum, 14);
  localHeader.writeUInt32LE(compressed.length, 18);
  localHeader.writeUInt32LE(source.length, 22);
  localHeader.writeUInt16LE(fileName.length, 26);
  localParts.push(localHeader, fileName, compressed);

  const centralHeader = Buffer.alloc(46);
  centralHeader.writeUInt32LE(0x02014b50, 0);
  centralHeader.writeUInt16LE(20, 4);
  centralHeader.writeUInt16LE(20, 6);
  centralHeader.writeUInt16LE(0, 8);
  centralHeader.writeUInt16LE(8, 10);
  centralHeader.writeUInt16LE(time, 12);
  centralHeader.writeUInt16LE(date, 14);
  centralHeader.writeUInt32LE(checksum, 16);
  centralHeader.writeUInt32LE(compressed.length, 20);
  centralHeader.writeUInt32LE(source.length, 24);
  centralHeader.writeUInt16LE(fileName.length, 28);
  centralHeader.writeUInt32LE(offset, 42);
  centralParts.push(centralHeader, fileName);

  offset += localHeader.length + fileName.length + compressed.length;
}

const centralDirectory = Buffer.concat(centralParts);
const end = Buffer.alloc(22);
const fileCount = centralParts.length / 2;
end.writeUInt32LE(0x06054b50, 0);
end.writeUInt16LE(fileCount, 8);
end.writeUInt16LE(fileCount, 10);
end.writeUInt32LE(centralDirectory.length, 12);
end.writeUInt32LE(offset, 16);

const outputDirectory = path.join(root, "dist");
const outputPath = path.join(outputDirectory, `umbral-${manifest.version}.zip`);
fs.mkdirSync(outputDirectory, { recursive: true });
fs.writeFileSync(outputPath, Buffer.concat([...localParts, centralDirectory, end]));
console.log(path.relative(root, outputPath));
