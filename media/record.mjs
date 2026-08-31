/*
 * record.mjs - record an abap2UI5 app as video, GIF and screenshot.
 *
 * Points a headless Chromium at any page that starts abap2UI5 apps via
 * ?app_start= (the published web build, a local `npm run serve:build`,
 * or a real system), optionally replays a scripted interaction, and
 * writes ready-to-post media files:
 *
 *   <out>/<app>/<app>.webm   the raw recording (always)
 *   <out>/<app>/<app>.png    full-page screenshot (always)
 *   <out>/<app>/<app>.mp4    needs an ffmpeg with libx264 (LinkedIn wants MP4)
 *   <out>/<app>/<app>.gif    needs ffmpeg (README/docs embeds)
 *
 * Usage:
 *   node media/record.mjs --app <class> [options]
 *
 * Options:
 *   --app <class>     app class to start (appended as ?app_start=)  [required]
 *   --url <base>      page that boots abap2UI5
 *                     default: https://abap2ui5.github.io/web-abap2UI5-build/
 *   --steps <file>    JSON array of interaction steps, see media/steps.example.json
 *   --size <preset>   desktop (1280x720) | phone (414x896) | tablet (834x1112) | <W>x<H>
 *   --out <dir>       output directory                     [default: media-out]
 *   --settle <ms>     wait after first render before recording starts [2500]
 *   --pace <ms>       pause between steps                   [800]
 *   --hold <ms>       hold the final frame before closing   [1500]
 *   --ui5-from <dir>  serve UI5 CDN requests from local OpenUI5 npm
 *                     packages (a directory containing @openui5/*, e.g. a
 *                     samples-controls checkout's node_modules) - for
 *                     recording on machines without internet egress
 *
 * ffmpeg is looked up on PATH, then in Playwright's browser cache
 * (its bundled build encodes GIF; MP4 needs a full ffmpeg install).
 * Override with A2UI5_MEDIA_FFMPEG; A2UI5_MEDIA_CHROMIUM points the
 * recorder at a preinstalled Chromium instead of Playwright's own.
 */
import { chromium } from '@playwright/test';
import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const SIZES = {
  desktop: { width: 1280, height: 720 },
  phone: { width: 414, height: 896 },
  tablet: { width: 834, height: 1112 },
};
const DEFAULT_URL = 'https://abap2ui5.github.io/web-abap2UI5-build/';

function parseArgs(argv) {
  const a = { url: DEFAULT_URL, size: 'desktop', out: 'media-out', settle: 2500, pace: 800, hold: 1500 };
  for (let i = 2; i < argv.length; i++) {
    const key = argv[i].replace(/^--/, '').replace('ui5-from', 'ui5From');
    if (!['app', 'url', 'steps', 'size', 'out', 'settle', 'pace', 'hold', 'ui5From'].includes(key)) {
      console.error(`unknown option --${key}`);
      process.exit(2);
    }
    a[key] = argv[++i];
  }
  if (!a.app) {
    console.error('required: --app <class> (see the header of this file for usage)');
    process.exit(2);
  }
  for (const n of ['settle', 'pace', 'hold']) a[n] = Number(a[n]);
  return a;
}

function viewportOf(size) {
  if (SIZES[size]) return SIZES[size];
  const m = /^(\d+)x(\d+)$/.exec(size);
  if (!m) {
    console.error(`--size must be ${Object.keys(SIZES).join(' | ')} or <W>x<H>`);
    process.exit(2);
  }
  return { width: Number(m[1]), height: Number(m[2]) };
}

function findFfmpeg() {
  if (process.env.A2UI5_MEDIA_FFMPEG) return process.env.A2UI5_MEDIA_FFMPEG;
  if (spawnSync('ffmpeg', ['-version'], { stdio: 'ignore' }).status === 0) return 'ffmpeg';
  // Playwright's bundled ffmpeg is no help: it muxes screencasts to webm
  // but ships without the GIF muxer and without libx264
  return null;
}

function convert(ffmpeg, webm, target, args) {
  const r = spawnSync(ffmpeg, ['-y', '-loglevel', 'error', '-i', webm, ...args, target], { stdio: ['ignore', 'ignore', 'pipe'] });
  if (r.status === 0) return true;
  fs.rmSync(target, { force: true });
  const err = (r.stderr || '').toString().trim().split('\n')[0];
  if (err) console.log(`${path.extname(target)} conversion failed: ${err}`);
  return false;
}

async function runStep(page, step, shots) {
  if (step.wait) return page.waitForTimeout(step.wait);
  if (step.click) return page.click(step.click);
  if (step.fill) return page.fill(step.fill[0], step.fill[1]);
  if (step.type) return page.type(step.type[0], step.type[1], { delay: 80 });
  if (step.press) return page.keyboard.press(step.press);
  if (step.hover) return page.hover(step.hover);
  if (step.screenshot) return shots.push(step.screenshot);
  throw new Error(`unknown step: ${JSON.stringify(step)}`);
}

const args = parseArgs(process.argv);
const viewport = viewportOf(args.size);
const steps = args.steps ? JSON.parse(fs.readFileSync(args.steps, 'utf8')) : [];
const outDir = path.join(args.out, args.app);
fs.mkdirSync(outDir, { recursive: true });

const url = args.url + (args.url.includes('?') ? '&' : '?') + 'app_start=' + args.app;
console.log(`recording ${url} at ${viewport.width}x${viewport.height}`);

const browser = await chromium.launch(
  process.env.A2UI5_MEDIA_CHROMIUM ? { executablePath: process.env.A2UI5_MEDIA_CHROMIUM } : {},
);
const context = await browser.newContext({
  viewport,
  recordVideo: { dir: outDir, size: viewport },
});
const page = await context.newPage();

if (args.ui5From) {
  // answer any .../resources/<path> request from the local OpenUI5 packages
  // (each holds its files under src/); unknown paths fall through to the net
  const pkgRoot = path.join(args.ui5From, '@openui5');
  const pkgs = fs.readdirSync(pkgRoot).map((p) => path.join(pkgRoot, p, 'src'));
  const mime = { '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.properties': 'text/plain' };
  await page.route('**/resources/**', (route) => {
    let res = route.request().url().split('/resources/')[1].split('?')[0];
    res = res.replace(/^sap-ui-cachebuster\//, '');
    for (const src of pkgs) {
      const file = path.join(src, res);
      if (fs.existsSync(file)) {
        return route.fulfill({
          body: fs.readFileSync(file),
          contentType: mime[path.extname(file)] || 'application/octet-stream',
        });
      }
    }
    return route.continue();
  });
}

const shots = [];
try {
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  // the web build boots a wasm database plus the transpiled backend first;
  // a rendered UI5 control (they all carry data-sap-ui) is the signal that
  // the app is actually on screen - body classes appear long before that
  await page.waitForSelector('body *[data-sap-ui]', { timeout: 90000 });
  await page.waitForTimeout(args.settle);
  for (const step of steps) {
    await runStep(page, step, shots);
    await page.waitForTimeout(args.pace);
  }
  for (const name of shots.length ? shots : []) {
    await page.screenshot({ path: path.join(outDir, `${args.app}.${name}.png`), fullPage: true });
  }
  await page.screenshot({ path: path.join(outDir, `${args.app}.png`), fullPage: true });
  await page.waitForTimeout(args.hold);
} finally {
  await context.close(); // flushes the video
  await browser.close();
}

const video = fs.readdirSync(outDir).find((f) => f.endsWith('.webm') && !f.startsWith(args.app));
const webm = path.join(outDir, `${args.app}.webm`);
if (video) fs.renameSync(path.join(outDir, video), webm);

const produced = [`${args.app}.png`, `${args.app}.webm`];
const ffmpeg = findFfmpeg();
if (!ffmpeg) {
  console.log('no ffmpeg found - skipping MP4/GIF (install ffmpeg, or set A2UI5_MEDIA_FFMPEG)');
} else {
  // GIF: 12 fps, max 720px wide, one-pass palette for clean UI5 flat colors
  const gifOk = convert(ffmpeg, webm, path.join(outDir, `${args.app}.gif`), [
    '-filter_complex',
    '[0:v]fps=12,scale=min(720\\,iw):-2:flags=lanczos,split[a][b];[a]palettegen=stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=4',
  ]) || convert(ffmpeg, webm, path.join(outDir, `${args.app}.gif`), [
    // minimal builds (e.g. Playwright's bundled ffmpeg) lack some filters -
    // fall back to a plain conversion before giving up on the GIF
    '-vf', 'fps=10', '-loop', '0',
  ]);
  if (gifOk) produced.push(`${args.app}.gif`);
  // MP4 (H.264 + faststart, what LinkedIn ingests best); Playwright's
  // bundled ffmpeg has no libx264, so this quietly needs a full install
  const mp4Ok = convert(ffmpeg, webm, path.join(outDir, `${args.app}.mp4`), [
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-movflags', '+faststart',
    '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2',
  ]);
  if (mp4Ok) produced.push(`${args.app}.mp4`);
  else console.log('MP4 skipped - this ffmpeg has no libx264 (a full ffmpeg install does)');
}
console.log(`done: ${outDir}/{${produced.join(', ')}}`);
