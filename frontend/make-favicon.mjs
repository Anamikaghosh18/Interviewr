// Run with: node make-favicon.mjs
// Requires: npm install sharp
// Place this file in your project root, then run it once.
// It reads public/logo.png and writes public/favicon.png with rounded corners.

import sharp from "sharp";
import { readFileSync, writeFileSync } from "fs";

const SIZE = 64;           // output size in px
const RADIUS = 14;         // corner radius (increase for more rounding)
const INPUT  = "public/logo.png";
const OUTPUT = "public/favicon.png";

// 1. Build an SVG mask with rounded corners
const mask = Buffer.from(
  `<svg width="${SIZE}" height="${SIZE}">
    <rect x="0" y="0" width="${SIZE}" height="${SIZE}" rx="${RADIUS}" ry="${RADIUS}" fill="white"/>
  </svg>`
);

// 2. Resize the logo, apply the rounded mask, save
await sharp(INPUT)
  .resize(SIZE, SIZE, { fit: "cover" })
  .composite([{ input: mask, blend: "dest-in" }])
  .png()
  .toFile(OUTPUT);

console.log(`✅  Saved rounded favicon → ${OUTPUT}`);
