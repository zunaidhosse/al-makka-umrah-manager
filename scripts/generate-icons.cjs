const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// CRC32 calculation for PNG chunks
const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if (c & 1) c = 0xedb88320 ^ (c >>> 1);
    else c = c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function writeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  const crc = crc32(Buffer.concat([typeBuf, data]));
  crcBuf.writeUInt32BE(crc, 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function createPNG(width, height, drawFn) {
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type: RGBA
  ihdr[10] = 0; // compression method
  ihdr[11] = 0; // filter method
  ihdr[12] = 0; // interlace method
  const ihdrChunk = writeChunk('IHDR', ihdr);

  // Raw image data: height rows, each row starts with 0x00 (filter type None), then width * 4 bytes
  const rowSize = 1 + width * 4;
  const rawData = Buffer.alloc(height * rowSize);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter type None
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = drawFn(x, y, width, height);
      const pixelOffset = rowOffset + 1 + x * 4;
      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  const compressedData = zlib.deflateSync(rawData);
  const idatChunk = writeChunk('IDAT', compressedData);
  const iendChunk = writeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Drawing logic for Dark Green (#064e3b) + Gold (#f59e0b / #fbbf24) Islamic Badge Icon
function drawIslamicIcon(x, y, w, h) {
  const cx = w / 2;
  const cy = h / 2;
  const r = w / 2;

  const dx = x - cx;
  const dy = y - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);

  // Outer circle mask with antialiasing
  if (dist > r - 1) {
    if (dist > r) return [0, 0, 0, 0]; // transparent
    const alpha = Math.floor((1 - (dist - (r - 1))) * 255);
    return [6, 78, 59, alpha];
  }

  // Gold Ring Border (Width ~ 5% of radius)
  const ringWidth = Math.max(2, w * 0.04);
  if (dist >= r - ringWidth - 2 && dist <= r - 2) {
    return [251, 191, 36, 255]; // Gold (#fbbf24)
  }

  // Inner Gold Ring Accent
  if (dist >= r - ringWidth - 8 && dist <= r - ringWidth - 6) {
    return [245, 158, 11, 220]; // #f59e0b
  }

  // Center Islamic Crescent ☪ and Star or Kaaba Icon Symbol
  const cresR = w * 0.22;
  const cresCx = cx - w * 0.03;
  const cresCy = cy;
  const cDist = Math.sqrt((x - cresCx) ** 2 + (y - cresCy) ** 2);

  const cutR = w * 0.18;
  const cutCx = cx + w * 0.04;
  const cutCy = cy - w * 0.02;
  const cutDist = Math.sqrt((x - cutCx) ** 2 + (y - cutCy) ** 2);

  const isCrescent = (cDist <= cresR) && (cutDist >= cutR);

  // Star parameters
  const starCx = cx + w * 0.14;
  const starCy = cy - w * 0.08;
  const starDist = Math.sqrt((x - starCx) ** 2 + (y - starCy) ** 2);
  const isStar = starDist <= w * 0.05;

  if (isCrescent || isStar) {
    return [251, 191, 36, 255]; // Bright Gold
  }

  // Kaaba Base Silhouette in Center Bottom
  const kWidth = w * 0.20;
  const kHeight = h * 0.18;
  const kLeft = cx - kWidth / 2;
  const kRight = cx + kWidth / 2;
  const kTop = cy + h * 0.06;
  const kBottom = kTop + kHeight;

  if (x >= kLeft && x <= kRight && y >= kTop && y <= kBottom) {
    if (y >= kTop + kHeight * 0.15 && y <= kTop + kHeight * 0.35) {
      return [251, 191, 36, 255]; // Gold Kiswah Band
    }
    return [15, 23, 42, 240]; // Deep Slate / Kiswah Black
  }

  // Default Background: Rich Emerald Green gradient
  const normDist = dist / r;
  const gR = Math.floor(6 + normDist * 8);
  const gG = Math.floor(78 - normDist * 20);
  const gB = Math.floor(59 - normDist * 15);
  return [gR, gG, gB, 255];
}

const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

console.log('Generating PWA Icons...');

const pwa192 = createPNG(192, 192, drawIslamicIcon);
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), pwa192);
console.log('Created pwa-192x192.png');

const pwa512 = createPNG(512, 512, drawIslamicIcon);
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), pwa512);
console.log('Created pwa-512x512.png');

const appleTouch = createPNG(180, 180, drawIslamicIcon);
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), appleTouch);
console.log('Created apple-touch-icon.png');

const faviconPng = createPNG(64, 64, drawIslamicIcon);
fs.writeFileSync(path.join(publicDir, 'favicon.png'), faviconPng);
console.log('Created favicon.png');

// Vector SVG icon
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <radialGradient id="bgGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#065f46"/>
      <stop offset="100%" stop-color="#022c22"/>
    </radialGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="50%" stop-color="#fbbf24"/>
      <stop offset="100%" stop-color="#d97706"/>
    </linearGradient>
  </defs>
  <circle cx="256" cy="256" r="248" fill="url(#bgGrad)" stroke="url(#goldGrad)" stroke-width="16"/>
  <circle cx="256" cy="256" r="224" fill="none" stroke="url(#goldGrad)" stroke-width="4" stroke-dasharray="12 8" opacity="0.6"/>
  
  <!-- Crescent Moon -->
  <path d="M 230 140 A 90 90 0 1 0 320 280 A 75 75 0 1 1 230 140 Z" fill="url(#goldGrad)"/>
  
  <!-- Star -->
  <polygon points="340,170 346,188 365,188 350,199 355,217 340,206 325,217 330,199 315,188 334,188" fill="url(#goldGrad)"/>
  
  <!-- Kaaba Base -->
  <rect x="206" y="310" width="100" height="90" rx="8" fill="#0f172a" stroke="url(#goldGrad)" stroke-width="3"/>
  <rect x="206" y="330" width="100" height="16" fill="url(#goldGrad)"/>
</svg>`;

fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svgContent);
console.log('Created favicon.svg');

console.log('All icons generated successfully!');
