// NusaStat hand-in: copies the static site (app/) and its screenshots into the
// output directory and writes dossier.json with the kit's vendored library.
// Node 22, standard library only; nothing is fetched over the network.
// Run locally with: mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Fail loudly, before copying anything, if the site itself is missing: a
// half-copied /output would still look like a hand-in.
if (!existsSync(join(here, 'app', 'index.html'))) {
  throw new Error('app/index.html is missing; nothing was handed in');
}

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });

// Caps mirror the scorer's own limits: at most 4 screenshots of 256 KiB each,
// app/ at most 993 files and 16 MiB in all.
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 16777216 }),
);
