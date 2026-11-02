import {spawnSync} from 'node:child_process';
import {access, constants, readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = path.join(root, 'dist');

async function check(relative) {
  await access(path.join(dist, relative), constants.R_OK);
}

const html = await readFile(path.join(dist, 'index.html'), 'utf8');
const refs = [...html.matchAll(/(?:src|href)="([^"]+)"/g)]
  .map((match) => match[1])
  .filter((ref) => !ref.startsWith('http') && !ref.startsWith('#') && !ref.startsWith('data:'));

const missing = [];
for (const ref of refs) {
  try {
    await check(ref);
  } catch {
    missing.push(ref);
  }
}

if (missing.length) {
  console.error('Verify failed. Broken local references in index.html:');
  for (const ref of missing) console.error(` - ${ref}`);
  process.exit(1);
}

const build = spawnSync(process.execPath, [path.join(root, 'scripts', 'build.mjs')], {stdio: 'inherit'});
if (build.status !== 0) process.exit(build.status ?? 1);

const test = spawnSync(process.execPath, [path.join(root, 'tests', 'editorial.test.cjs')], {
  cwd: root,
  stdio: 'inherit'
});
if (test.status !== 0) process.exit(test.status ?? 1);

console.log(`Verify passed. Checked ${refs.length} local HTML references, build gate, and editorial tests.`);
