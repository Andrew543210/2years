import fs from "fs";
import path from "path";

const rootDir = "./img";
let output = "";

// Зчитує всі папки в /img
const folders = fs.readdirSync(rootDir);

folders.forEach(folder => {
  const folderPath = path.join(rootDir, folder);
  const files = fs.readdirSync(folderPath)
    .filter(file => !file.startsWith(".")) // пропускає системні файли
    .map(file => `"${folderPath}/${file}"`);

  output += `export const ${folder} = [\n  ${files.join(",\n  ")}\n];\n\n`;
});

fs.writeFileSync("data.js", output);
console.log("✅ data.js створено успішно!");
