// Builds transparent logo.png + logo-mark.png from the original logo, whose
// background is a baked-in grey/white checkerboard. Pure Node (zlib only).
import { readFileSync, writeFileSync } from "fs";
import zlib from "zlib";

function decode(buf) {
  let p = 8, w, h, ct, idat = [];
  while (p < buf.length) {
    const len = buf.readUInt32BE(p), type = buf.toString("ascii", p + 4, p + 8), d = buf.subarray(p + 8, p + 8 + len);
    if (type === "IHDR") { w = d.readUInt32BE(0); h = d.readUInt32BE(4); ct = d[9]; }
    if (type === "IDAT") idat.push(d);
    p += 12 + len;
  }
  const bpp = ct === 6 ? 4 : 3, raw = zlib.inflateSync(Buffer.concat(idat)), stride = w * bpp;
  const out = Buffer.alloc(w * h * 4);
  let prev = Buffer.alloc(stride);
  for (let y = 0; y < h; y++) {
    const f = raw[y * (stride + 1)], line = Buffer.from(raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1)));
    for (let x = 0; x < stride; x++) {
      const a = x >= bpp ? line[x - bpp] : 0, b = prev[x], c = x >= bpp ? prev[x - bpp] : 0;
      let v = line[x];
      if (f === 1) v += a; else if (f === 2) v += b; else if (f === 3) v += (a + b) >> 1;
      else if (f === 4) { const pp = a + b - c, pa = Math.abs(pp - a), pb = Math.abs(pp - b), pc = Math.abs(pp - c); v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c; }
      line[x] = v & 255;
    }
    for (let x = 0; x < w; x++) {
      const o = (y * w + x) * 4;
      out[o] = line[x * bpp]; out[o + 1] = line[x * bpp + 1]; out[o + 2] = line[x * bpp + 2]; out[o + 3] = bpp === 4 ? line[x * bpp + 3] : 255;
    }
    prev = line;
  }
  return { w, h, px: out };
}

function crc32(b) { let c, crc = ~0; for (let n = 0; n < b.length; n++) { c = (crc ^ b[n]) & 255; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; crc = (crc >>> 8) ^ c; } return ~crc >>> 0; }
function chunk(t, d) { const l = Buffer.alloc(4); l.writeUInt32BE(d.length); const td = Buffer.concat([Buffer.from(t), d]); const c = Buffer.alloc(4); c.writeUInt32BE(crc32(td)); return Buffer.concat([l, td, c]); }
function encode(w, h, px) {
  const ih = Buffer.alloc(13); ih.writeUInt32BE(w, 0); ih.writeUInt32BE(h, 4); ih[8] = 8; ih[9] = 6;
  const raw = Buffer.alloc(h * (w * 4 + 1));
  for (let y = 0; y < h; y++) px.copy(raw, y * (w * 4 + 1) + 1, y * w * 4, (y + 1) * w * 4);
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk("IHDR", ih), chunk("IDAT", zlib.deflateSync(raw, { level: 9 })), chunk("IEND", Buffer.alloc(0))]);
}
function crop({ w, px }, x0, y0, x1, y1) {
  const cw = x1 - x0, ch = y1 - y0, o = Buffer.alloc(cw * ch * 4);
  for (let y = 0; y < ch; y++) px.copy(o, y * cw * 4, ((y0 + y) * w + x0) * 4, ((y0 + y) * w + x1) * 4);
  return { w: cw, h: ch, px: o };
}
function bbox({ w, h, px }) {
  let x0 = w, y0 = h, x1 = 0, y1 = 0;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (px[(y * w + x) * 4 + 3] > 0) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x + 1); y1 = Math.max(y1, y + 1); }
  return [x0, y0, x1, y1];
}

export function makeLogos(src, outFull, outMark) {
  const img = decode(readFileSync(src));
  const { px } = img;
  for (let i = 0; i < px.length; i += 4) {
    const r = px[i], g = px[i + 1], b = px[i + 2], mx = Math.max(r, g, b), mn = Math.min(r, g, b);
    if (mx - mn < 28 && mn > 175) px[i + 3] = 0;
    else if (mx - mn < 28 && mn > 140) px[i + 3] = Math.round((255 * (175 - mn)) / 35);
  }
  const full = crop(img, ...bbox(img));
  writeFileSync(outFull, encode(full.w, full.h, full.px));
  // emblem = everything above the lowest point of the blue ring
  let ringBottom = 0;
  const cx = full.w >> 1;
  for (let y = 0; y < full.h; y++) for (let x = cx - 6; x < cx + 6; x++) {
    const o = (y * full.w + x) * 4;
    if (full.px[o + 2] > 150 && full.px[o] < 100 && full.px[o + 3] > 100) ringBottom = Math.max(ringBottom, y);
  }
  const top = crop(full, 0, 0, full.w, Math.min(full.h, ringBottom + 4));
  const m = crop(top, ...bbox(top));
  const s = Math.max(m.w, m.h) + 8, sq = Buffer.alloc(s * s * 4), ox = (s - m.w) >> 1, oy = (s - m.h) >> 1;
  for (let y = 0; y < m.h; y++) m.px.copy(sq, ((oy + y) * s + ox) * 4, y * m.w * 4, (y + 1) * m.w * 4);
  writeFileSync(outMark, encode(s, s, sq));
}

if (process.argv[2]) makeLogos(process.argv[2], process.argv[3], process.argv[4]);
