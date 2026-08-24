/**
 * Structural + behavioral checks for interview_prep.html (shipped entry point).
 * Drives the real file: no re-implemented cheatsheet logic.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import http from 'node:http';
import { spawn } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const HTML_PATH = path.join(__dirname, 'interview_prep.html');
const REQUIRED_TOPICS = [
  'tcpip', 'subnetting', 'vlan', 'stp', 'nat', 'ospf', 'bgp', 'vrf', 'mpls',
  'acl', 'dhcpdns', 'vpn', 'troubleshoot', 'monitoring', 'voip', 'automation',
  'cisco', 'interview',
];
const REQUIRED_NEW = ['subnetting', 'stp', 'acl', 'dhcpdns', 'vpn', 'troubleshoot'];
const MUST_HAVE_VISUAL = ['bgp', 'vrf', 'voip', 'troubleshoot'];

function fail(msg) {
  console.error('FAIL:', msg);
  process.exitCode = 1;
}

function ok(msg) {
  console.log('OK:', msg);
}

function readHtml() {
  if (!fs.existsSync(HTML_PATH)) fail(`missing ${HTML_PATH}`);
  return fs.readFileSync(HTML_PATH, 'utf8');
}

function sectionIds(html) {
  return [...html.matchAll(/class="topic"\s+id="([^"]+)"/g)].map((m) => m[1]);
}

function navHrefs(html) {
  return [...html.matchAll(/href="#([^"]+)"/g)].map((m) => m[1]);
}

function topicsArrayIds(html) {
  const m = html.match(/const topics\s*=\s*\[([\s\S]*?)\];/);
  if (!m) return [];
  return [...m[1].matchAll(/id\s*:\s*'([^']+)'/g)].map((x) => x[1]);
}

function sectionChunk(html, id) {
  const re = new RegExp(
    `class="topic"\\s+id="${id}"([\\s\\S]*?)(?=class="topic"\\s+id=|</main>)`,
  );
  const m = html.match(re);
  return m ? m[0] : '';
}

function hasVisual(chunk) {
  return (
    /diagram-wrap/.test(chunk) ||
    /cmp-table/.test(chunk) ||
    /anchor-grid/.test(chunk) ||
    /flow-steps/.test(chunk)
  );
}

function staticChecks() {
  const html = readHtml();
  ok(`loaded ${HTML_PATH} (${html.length} bytes)`);

  if (!html.includes('<!DOCTYPE html>') && !html.includes('<!doctype html>')) {
    fail('not HTML document');
  }
  if (!/lang="ru"/.test(html)) fail('lang=ru missing');
  if (!/<nav[\s>]/.test(html)) fail('nav missing');
  if (!/class="hero"/.test(html)) fail('hero missing');
  if (!/function toggle\s*\(/.test(html)) fail('toggle() missing');
  if (!/function setActive\s*\(/.test(html)) fail('setActive() missing');
  if (!/const topics\s*=/.test(html)) fail('topics progress list missing');
  if (!/class="qa-q"/.test(html)) fail('Q&A missing');

  const ids = sectionIds(html);
  if (ids.length < 12) fail(`expected ≥12 topics, got ${ids.length}`);
  ok(`topics: ${ids.length} → ${ids.join(', ')}`);

  for (const id of REQUIRED_TOPICS) {
    if (!ids.includes(id)) fail(`missing topic #${id}`);
  }
  ok('all required topic ids present');

  for (const id of REQUIRED_NEW) {
    if (!ids.includes(id)) fail(`new practical topic missing: ${id}`);
    const chunk = sectionChunk(html, id);
    if (!/class="oneliner"/.test(chunk)) fail(`#${id} missing oneliner`);
    if (!/class="qa-q"/.test(chunk)) fail(`#${id} missing Q&A`);
  }
  ok('new practical blocks have oneliner + Q&A');

  const hrefs = new Set(navHrefs(html));
  for (const id of ids) {
    if (!hrefs.has(id)) fail(`nav missing link to #${id}`);
  }
  ok('nav links cover every topic');

  const tIds = topicsArrayIds(html);
  for (const id of ids) {
    if (!tIds.includes(id)) fail(`progress topics[] missing ${id}`);
  }
  ok('progress topics[] matches sections');

  let visualCount = 0;
  const map = [];
  for (const id of ids) {
    const chunk = sectionChunk(html, id);
    const v = hasVisual(chunk);
    if (v) visualCount++;
    map.push(`${id}:${v ? 'yes' : 'no'}`);
    if (!/class="oneliner"/.test(chunk)) fail(`#${id} missing oneliner`);
  }
  const pct = (100 * visualCount) / ids.length;
  ok(`visual coverage ${visualCount}/${ids.length} (${pct.toFixed(1)}%)`);
  if (pct < 70) fail(`visual coverage ${pct}% < 70%`);
  for (const id of MUST_HAVE_VISUAL) {
    if (!hasVisual(sectionChunk(html, id))) fail(`#${id} must have visual`);
  }
  ok(`must-have visuals ok: ${MUST_HAVE_VISUAL.join(', ')}`);
  console.log('visual_map', map.join(' '));

  // Practical phrasing samples (not textbook-only)
  const practicalRe = /команд|на собесе|ловушк|прод|show |ping |traceroute|Cisco|Mikrotik|VSAT/i;
  let practicalHits = 0;
  for (const id of [...REQUIRED_NEW, 'bgp', 'tcpip', 'ospf']) {
    if (practicalRe.test(sectionChunk(html, id))) practicalHits++;
  }
  if (practicalHits < 5) fail(`practical anchors only in ${practicalHits} topics`);
  ok(`practical phrasing in ${practicalHits} checked topics`);

  return { html, ids };
}

async function browserLaunch(runLabel) {
  let chromium;
  try {
    const pw = await import('playwright');
    chromium = pw.chromium;
  } catch {
    console.log('SKIP browser: playwright module not installed; static path only');
    return { skipped: true };
  }

  const html = readHtml();
  const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const { port } = server.address();
  const url = `http://127.0.0.1:${port}/`;

  const errors = [];
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  const title = await page.title();
  const heroVisible = await page.locator('.hero').isVisible();
  const topicCount = await page.locator('.topic').count();
  const qaCount = await page.locator('.qa-q').count();

  // Toggle first Q&A
  const firstQ = page.locator('.qa-q').first();
  await firstQ.click();
  const ansOpen = await page.locator('.qa-a.open').count();
  if (ansOpen < 1) fail(`${runLabel}: Q&A did not open on click`);

  // Nav click
  await page.locator('nav a[href="#troubleshoot"]').click();
  await page.waitForTimeout(200);
  const activeNav = await page.locator('nav a.active').getAttribute('href');

  const shot = path.join(
    process.env.GROK_SCRATCH || path.join(__dirname, '.scratch'),
    `page-${runLabel}.png`,
  );
  try {
    fs.mkdirSync(path.dirname(shot), { recursive: true });
    await page.screenshot({ path: shot, fullPage: false });
  } catch {
    /* optional */
  }

  await browser.close();
  server.close();

  if (errors.length) fail(`${runLabel}: page errors: ${errors.join('; ')}`);
  if (!title) fail(`${runLabel}: empty title`);
  if (!heroVisible) fail(`${runLabel}: hero not visible`);
  if (topicCount < 12) fail(`${runLabel}: topicCount ${topicCount}`);
  if (qaCount < 1) fail(`${runLabel}: no qa-q`);

  ok(`${runLabel}: title="${title}" topics=${topicCount} qa=${qaCount} ansOpen=${ansOpen} nav=${activeNav}`);
  return { title, topicCount, qaCount, ansOpen, errors, shot };
}

async function main() {
  console.log('=== static ===');
  staticChecks();
  if (process.exitCode) process.exit(process.exitCode);

  console.log('=== browser run1 ===');
  const r1 = await browserLaunch('run1');
  console.log('=== browser run2 ===');
  const r2 = await browserLaunch('run2');

  if (!r1.skipped && !r2.skipped) {
    if (r1.topicCount !== r2.topicCount) fail('unstable topicCount across runs');
    ok('browser launch stable across 2 runs');
  }

  if (process.exitCode) {
    console.error('TEST SUITE FAILED');
    process.exit(1);
  }
  console.log('TEST SUITE PASSED');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
