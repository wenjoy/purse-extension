import {fileURLToPath} from 'url';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'path';


async function main () {
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fileName = `${__dirname}/../public/manifest.json`;
  const buffer = await readFile(fileName);

  const data = JSON.parse(buffer.toString());
  data.version = data.version.replace(/(\d)\.(\d)\.(\d)/, (match, p1, p2, p3) => {
    return `${p1}.${p2}.${Number(p3)+1}`;
  });
  await writeFile(fileName, JSON.stringify(data, null, 4));
}

main();