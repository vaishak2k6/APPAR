// Renders react-icons to PNG files: node icons.js icons.json outdir
const fs = require("fs");
const path = require("path");
const req = require("module").createRequire(path.join(__dirname, "..", "build", "package.json"));
const React = req("react");
const ReactDOMServer = req("react-dom/server");
const sharp = req("sharp");
const fa6 = req("react-icons/fa6");

const [, , listFile, outDir] = process.argv;
const list = JSON.parse(fs.readFileSync(listFile, "utf8"));
fs.mkdirSync(outDir, { recursive: true });

(async () => {
  for (const { key, name, color } of list) {
    const Icon = fa6[name];
    if (!Icon) { console.error("missing icon", name); process.exit(1); }
    const svg = ReactDOMServer.renderToStaticMarkup(
      React.createElement(Icon, { size: 256, color: "#" + color })
    );
    await sharp(Buffer.from(svg)).resize(256, 256, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png().toFile(path.join(outDir, key + ".png"));
  }
  console.log("rendered", list.length, "icons");
})();
