import sharp from "sharp";

const icons = [
  ["favicon-32.png", 32, 23],
  ["apple-touch-icon.png", 180, 126],
  ["icon-192.png", 192, 134],
  ["icon-512.png", 512, 358],
  ["icon-maskable-512.png", 512, 306],
];

const backgroundSvg = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#c4b5fd"/>
  <circle cx="${size * 0.2}" cy="${size * 0.16}" r="${size * 0.34}" fill="#a78bfa" opacity="0.76"/>
  <circle cx="${size * 0.84}" cy="${size * 0.84}" r="${size * 0.42}" fill="#ddd6fe" opacity="0.9"/>
  <circle cx="${size * 0.52}" cy="${size * 0.52}" r="${size * 0.41}" fill="#f5f3ff" opacity="0.72"/>
</svg>
`;

for (const [name, size, mascotSize] of icons) {
  const mascot = await sharp("public/assets/chinchilla-mascot.png")
    .resize(mascotSize, mascotSize, { fit: "contain" })
    .png()
    .toBuffer();

  await sharp(Buffer.from(backgroundSvg(size)))
    .composite([
      {
        input: mascot,
        left: Math.round((size - mascotSize) / 2),
        top: Math.round((size - mascotSize) / 2),
      },
    ])
    .png()
    .toFile(`public/icons/${name}`);
}
