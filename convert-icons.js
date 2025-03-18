const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const sizes = [16, 48, 128];
const svgPath = path.join(__dirname, "icons", "icon.svg");

async function convertIcons() {
  for (const size of sizes) {
    await sharp(svgPath)
      .resize(size, size)
      .png()
      .toFile(path.join(__dirname, "icons", `icon${size}.png`));
  }
}

convertIcons().catch(console.error);
