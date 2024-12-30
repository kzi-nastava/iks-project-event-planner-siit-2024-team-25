// Copies marker icon assets into angular assets folder, run after install in production build.

const fs = require("fs");
const path = require("path");

const leafletPath = path.join(__dirname, "node_modules/leaflet/dist/images");
const assetsPath = path.join(__dirname, "public/leaflet");

if (!fs.existsSync(assetsPath)) {
  fs.mkdirSync(assetsPath, { recursive: true });
}

const imagesToCopy = [
  "marker-icon.png",
  "marker-icon-2x.png",
  "marker-shadow.png",
];

imagesToCopy.forEach((image) => {
  fs.copyFileSync(path.join(leafletPath, image), path.join(assetsPath, image));
});

console.log("Leaflet marker images copied to assets folder");
