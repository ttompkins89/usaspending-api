// Builds the Resources data: release notes, API changelog, glossary, and data dictionary.
// Every source is public and read fresh on each build; each has a committed fallback so a build never fails on it.
//   Release notes: the Release Log in the usaspending-website wiki (Home.md).
//   API changelog: commit history of the API contract files (from the .contracts clone made by build-docs).
//   Glossary and data dictionary: the API's own references/glossary and references/data_dictionary endpoints.
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const LIB = path.join(ROOT, 'lib');
const WIKI = 'https://github.com/fedspendingtransparency/usaspending-website.wiki.git';
const API = 'https://api.usaspending.gov/api/v2';
const log = (...a) => console.log('[build-resources]', ...a);
const docs = JSON.parse(fs.readFileSync(path.join(LIB, 'docs.json'), 'utf8'));

// Map an API path mentioned in prose to one of our endpoints, longest match first.
const byPath = [...docs.endpoints].sort((a, b) => b.path.length - a.path.length);
function endpointFor(text) {
  const norm = (p) => p.replace(/\{[^}]+\}/g, '*').replace(/\/+$/, '').toLowerCase();
  const t = text.toLowerCase().replace(/https?:\/\/api\.usaspending\.gov/, '').replace(/\/+$/, '');
  for (const e of byPath) {
    const re = new RegExp('^' + norm(e.path).replace(/[.+?^$()|[\]\\]/g, '\\$&').replace(/\*/g, '[^/]+') + '$');
    if (re.test(t)) return e.id;
  }
  const bare = t.replace(/^.*\/api\/v2\//, '/api/v2/');
  for (const e of byPath) if (norm(e.path) === bare) return e.id;
  return null;
}
function mentions(markdown) {
  const ids = new Set();
  for (const m of markdown.matchAll(/(?:https?:\/\/api\.usaspending\.gov)?\/api\/v2\/[A-Za-z0-9_{}/<>-]+/g)) {
    const id = endpointFor(m[0].replace(/<[^>]+>/g, '{x}'));
    if (id) ids.add(id);
  }
  return [...ids];
}
const write = (name, data) => fs.writeFileSync(path.join(LIB, name), JSON.stringify(data));
const keep = (name, err) => {
  if (fs.existsSync(path.join(LIB, name))) { log(`Kept the committed ${name}:`, err.message); return true; }
  return false;
};

// Release notes ------------------------------------------------------------
function releaseNotes() {
  const dest = path.join(ROOT, '.wiki');
  fs.rmSync(dest, { recursive: true, force: true });
  execSync(`git clone --depth 1 ${WIKI} "${dest}"`, { stdio: 'ignore' });
  const md = fs.readFileSync(path.join(dest, 'Home.md'), 'utf8');
  const releases = [];
  for (const chunk of md.split(/^## /m).slice(1)) {
    const [dateLine, ...rest] = chunk.split('\n');
    const date = new Date(dateLine.trim());
    if (Number.isNaN(date.getTime())) continue;
    const body = rest.join('\n').trim();
    const sections = body.split(/^### /m).filter((s) => s.trim()).map((s) => {
      const [title, ...lines] = s.split('\n');
      return { title: lines.length ? title.trim() : 'Changes', markdown: (lines.length ? lines.join('\n') : s).trim() };
    });
    const apiItems = [...new Set(body.split('\n').filter((l) => /^\s*[*-]\s/.test(l) && /\bAPI\b|\/api\/v2|endpoint/i.test(l)).map((l) => l.replace(/^\s*[*-]\s*/, '').trim()).filter((l) => !/^API Improvements:?$/i.test(l)))];
    releases.push({ id: date.toISOString().slice(0, 10), date: date.toISOString().slice(0, 10), title: dateLine.trim(), sections, apiItems, endpoints: mentions(body) });
  }
  write('releases.json', { source: 'https://github.com/fedspendingtransparency/usaspending-website/wiki', fetchedAt: new Date().toISOString(), releases });
  log(`${releases.length} releases, newest ${releases[0]?.date}`);
}

// API changelog --------------------------------------------------------------
function changelog() {
  const repo = process.env.CONTRACTS_GIT || path.join(ROOT, '.contracts');
  const since = process.env.CHANGELOG_SINCE || '2024-10-01';
  const out = execSync(`git -C "${repo}" log --since=${since} --no-merges --name-status --date=short --format="@@%h|%ad|%s" -- usaspending_api/api_contracts`, { maxBuffer: 64 * 1024 * 1024 }).toString();
  const byFile = new Map(docs.endpoints.map((e) => [`usaspending_api/api_contracts/${e.source.file}`, e.id]));
  const entries = [];
  for (const block of out.split('@@').filter(Boolean)) {
    const [head, ...files] = block.trim().split('\n');
    const [sha, date, ...s] = head.split('|');
    const subject = s.join('|');
    if (/^(ruff|dredd|debug|missed code review|code review)/i.test(subject.replace(/\[?DEV-\d+\]?\s*[-:]?\s*/i, ''))) continue;
    const changed = files.map((l) => l.split('\t')).filter((p) => p.length >= 2).map(([status, file, file2]) => ({ status: status[0], file: file2 || file }));
    const endpoints = [...new Set(changed.map((c) => byFile.get(c.file)).filter(Boolean))];
    const added = changed.filter((c) => c.status === 'A').map((c) => byFile.get(c.file)).filter(Boolean);
    const removed = changed.filter((c) => c.status === 'D').map((c) => c.file.split('/contracts/')[1] || c.file);
    const ticket = (subject.match(/DEV-\d+/i) || [])[0]?.toUpperCase() || null;
    const summary = subject.replace(/^\[?DEV-\d+\]?\s*[-:]?\s*/i, '').replace(/^\s*-\s*/, '').trim();
    entries.push({ sha, date, ticket, summary: summary.charAt(0).toUpperCase() + summary.slice(1), endpoints, added, removed, touchesGuide: changed.some((c) => /search_filters\.md$/.test(c.file)) });
  }
  write('changelog.json', { source: 'https://github.com/fedspendingtransparency/usaspending-api/commits/master/usaspending_api/api_contracts', since, entries });
  log(`${entries.length} contract changes since ${since}`);
}

// Glossary and data dictionary ------------------------------------------------
async function getJson(url) {
  const res = await fetch(url, { headers: { accept: 'application/json', 'user-agent': 'USAspending API Reference docs build (usaspending-api.vercel.app)' }, signal: AbortSignal.timeout(30000) });
  if (!res.ok) throw new Error(`${url} returned ${res.status}`);
  return res.json();
}
async function glossary() {
  const terms = [];
  for (let page = 1; page < 20; page++) {
    const j = await getJson(`${API}/references/glossary/?page=${page}&limit=100`);
    terms.push(...(j.results || []));
    if (!j.page_metadata?.hasNext) break;
  }
  terms.sort((a, b) => a.term.localeCompare(b.term));
  write('glossary.json', { source: `${API}/references/glossary/`, fetchedAt: new Date().toISOString(), terms });
  log(`${terms.length} glossary terms`);
}
async function dictionary() {
  const j = await getJson(`${API}/references/data_dictionary/`);
  const d = j.document || {};
  write('dictionary.json', { source: `${API}/references/data_dictionary/`, fetchedAt: new Date().toISOString(), headers: d.headers || [], sections: d.sections || [], rows: d.rows || [], metadata: d.metadata || null });
  log(`${(d.rows || []).length} data dictionary elements`);
}

async function main() {
  for (const [name, fn] of [['releases.json', releaseNotes], ['changelog.json', changelog], ['glossary.json', glossary], ['dictionary.json', dictionary]]) {
    try { await fn(); } catch (err) {
      if (!keep(name, err)) { write(name, name === 'glossary.json' ? { terms: [], unavailable: true } : name === 'dictionary.json' ? { headers: [], sections: [], rows: [], unavailable: true } : name === 'releases.json' ? { releases: [], unavailable: true } : { entries: [], unavailable: true }); log(`${name} unavailable in this build:`, err.message); }
    }
  }
}
main();
