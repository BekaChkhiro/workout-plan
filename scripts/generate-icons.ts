import sharp from "sharp";
import path from "path";

const SVG = path.join(process.cwd(), "public/icon.svg");
const OUT = path.join(process.cwd(), "public/icons");

const icons: { name: string; size: number }[] = [
  { name: "pwa-icon-192.png", size: 192 },
  { name: "pwa-icon-256.png", size: 256 },
  { name: "pwa-icon-384.png", size: 384 },
  { name: "pwa-icon-512.png", size: 512 },
  { name: "apple-touch-icon-120.png", size: 120 },
  { name: "apple-touch-icon-152.png", size: 152 },
  { name: "apple-touch-icon-167.png", size: 167 },
  { name: "apple-touch-icon-180.png", size: 180 },
];

async function main() {
  for (const { name, size } of icons) {
    await sharp(SVG).resize(size, size).png().toFile(path.join(OUT, name));
    console.log(`✓ ${name} (${size}×${size})`);
  }
}

main();
