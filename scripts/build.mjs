import {access, constants, readdir, stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = path.join(root, 'dist');
const required = [
  'index.html',
  'privacy.html',
  'terms.html',
  'status.html',
  'styles.css',
  'atelier.css',
  'app.js',
  'story-catalog.js',
  'more-stories.js',
  'gender-stories.js',
  'personalization.js',
  'story-voice.js',
  'book.js',
  'book-paint.js',
  'book-cinema.js',
  'assets/hikaya-logo.svg',
  'assets/hikaya-symbol.svg',
  'assets/hikaya-logo.png',
  'assets/hero-family.png',
  'assets/worlds-family.png',
  'assets/characters-family.png',
  'assets/NotoSansArabic.ttf'
];

async function mustExist(relative) {
  const full = path.join(dist, relative);
  await access(full, constants.R_OK);
  return full;
}

const missing = [];
for (const file of required) {
  try {
    await mustExist(file);
  } catch {
    missing.push(file);
  }
}

if (missing.length) {
  console.error('Build failed. Missing required dist files:');
  for (const file of missing) console.error(` - ${file}`);
  process.exit(1);
}

const assets = await readdir(path.join(dist, 'assets', 'book'));
if (assets.length < 20) {
  console.error(`Build failed. Expected book artwork panels, found ${assets.length}.`);
  process.exit(1);
}

const size = (await stat(dist)).isDirectory();
if (!size) {
  console.error('Build failed. dist/ is not a directory.');
  process.exit(1);
}

console.log('Hikaya static build ready.');
console.log(`- Required files: ${required.length}/${required.length}`);
console.log(`- Book artwork files: ${assets.length}`);
console.log('- Output directory: dist/');
console.log('- No compile step required; Vercel will publish dist/.');
