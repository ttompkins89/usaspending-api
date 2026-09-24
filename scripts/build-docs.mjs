// Generates lib/docs.json from USAspending's API Blueprint contracts.
// Contracts are the only source of endpoint content. Hand-written pages live in content/.
// Usage: node scripts/build-docs.mjs [--contracts <dir>]
// Without --contracts, it sparse-clones the public usaspending-api repo into .contracts/.
// If fetching or parsing fails, the committed lib/docs.json is kept so the build still succeeds.
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { SECTIONS, FEATURES, featureFor } from './feature-map.mjs';

const require = createRequire(import.meta.url);
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const OUT = path.join(ROOT, 'lib', 'docs.json');
const REPO = 'https://github.com/fedspendingtransparency/usaspending-api';
const CONTRACT_SUBDIR = 'usaspending_api/api_contracts';

function log(...a) { console.log('[build-docs]', ...a); }

function getContracts() {
  const i = process.argv.indexOf('--contracts');
  if (i > -1) return { dir: path.resolve(process.argv[i + 1]), sha: process.env.CONTRACTS_SHA || null };
  if (process.env.CONTRACTS_DIR) return { dir: path.resolve(process.env.CONTRACTS_DIR), sha: process.env.CONTRACTS_SHA || null };
  const dest = path.join(ROOT, '.contracts');
  fs.rmSync(dest, { recursive: true, force: true });
  execSync(`git clone --depth 1 --filter=blob:none --sparse ${REPO}.git "${dest}"`, { stdio: 'inherit' });
  execSync(`git -C "${dest}" sparse-checkout set --no-cone '/${CONTRACT_SUBDIR}/'`, { stdio: 'inherit' });
  const sha = execSync(`git -C "${dest}" rev-parse HEAD`).toString().trim();
  return { dir: path.join(dest, CONTRACT_SUBDIR), sha };
}

const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) =>
  e.isDirectory() ? walk(path.join(d, e.name)) : e.name.endsWith('.md') ? [path.join(d, e.name)] : []);

const tick = (v) => (typeof v === 'string' ? v.replace(/^`(.*)`$/s, '$1') : v);
const str = (x) => (x == null ? '' : typeof x === 'string' ? x : typeof x.content === 'string' ? x.content : '');
const metaStr = (e, k) => fixLinks(str(e?.meta?.[k]).trim());
// Contract prose links to the shared filter guide by relative path; point those at our filter page.
function fixLinks(t) { return t.replace(/\((?:\.\.\/)+search_filters\.md(#[^)]*)?\)/g, (_, h) => `(/start/filters${h || ''})`); }
const cls = (e) => (e?.meta?.classes?.content || []).map((c) => c.content);
const BASE = new Set(['string', 'number', 'boolean', 'object', 'array', 'enum', 'select', 'option', 'null', 'member', 'ref', 'extend']);

function valueOf(el) {
  if (el == null) return undefined;
  if (typeof el !== 'object') return el;
  if (['string', 'number', 'boolean'].includes(el.element)) return tick(el.content);
  if (el.element === 'array') return (el.content || []).map(valueOf);
  if (el.element === 'object') return Object.fromEntries((el.content || []).filter((m) => m.element === 'member').map((m) => [str(m.content.key), valueOf(m.content.value)]));
  if (el.element === 'enum') return valueOf(el.content);
  return el.content !== undefined ? valueOf(el.content) : undefined;
}

function collectStructures(parse) {
  const reg = new Map();
  const visit = (e) => {
    if (!e || typeof e !== 'object') return;
    if (Array.isArray(e)) return e.forEach(visit);
    if (e.element === 'dataStructure') {
      const inner = Array.isArray(e.content) ? e.content[0] : e.content;
      const id = metaStr(inner, 'id');
      if (id) reg.set(id, inner);
    }
    if (e.content && typeof e.content === 'object') visit(e.content);
  };
  visit(parse);
  return reg;
}

// Converts an API Elements (MSON) element into a small, render-friendly field tree.
function convert(el, ctx, stack = []) {
  if (!el || typeof el !== 'object') return { type: 'any' };
  const name = el.element;
  const out = {};
  const d = el.attributes?.default;
  if (d !== undefined) out.default = valueOf(Array.isArray(d.content) ? d.content[0] : d);
  if (name === 'enum') {
    out.type = 'enum';
    out.enum = (el.attributes?.enumerations?.content || []).map((x) => ({ value: valueOf(x), description: metaStr(x, 'description') || undefined })).filter((x) => x.value !== undefined && x.value !== null && x.value !== '');
    const t = el.attributes?.enumerations?.content?.[0]?.element;
    if (t) out.valueType = t;
    return out;
  }
  if (name === 'array') {
    out.type = 'array';
    const items = (el.content || []).filter((x) => x && x.element);
    if (items.length) {
      const first = items[0];
      const typed = ['string', 'number', 'boolean'].includes(first.element);
      out.items = typed ? { type: first.element } : convert(first, ctx, stack);
      if (typed) { let ex = items.map(valueOf).filter((v) => v !== undefined); if (ex.length === 1 && typeof ex[0] === 'string' && /^\[.*\]$/.test(ex[0])) ex = ex[0].slice(1, -1).split(',').map((v) => tick(v.trim())); if (ex.length) out.example = ex; }
    }
    return out;
  }
  if (name === 'object') {
    out.type = 'object';
    out.fields = membersOf(el, ctx, stack);
    return out;
  }
  if (name === 'select') {
    out.type = 'oneOf';
    out.options = (el.content || []).map((opt) => ({ fields: membersOf({ content: opt.content }, ctx, stack) }));
    return out;
  }
  if (['string', 'number', 'boolean', 'null'].includes(name)) {
    out.type = name;
    if (el.content !== undefined && el.content !== null && typeof el.content !== 'object') out.example = tick(el.content);
    return out;
  }
  // A named type: resolve it, guarding against cycles and very deep nesting.
  out.type = name;
  out.ref = name;
  if (stack.includes(name) || stack.length > 5) return out;
  const def = ctx.local.get(name) || ctx.global.get(name);
  if (!def) return out;
  const resolved = convert(def, ctx, [...stack, name]);
  const desc = metaStr(def, 'description');
  const base = BASE.has(def.element) ? def.element : resolved.type;
  return { ...resolved, type: base, ref: name, refDescription: desc || undefined, ...(out.default !== undefined ? { default: out.default } : {}) };
}

function membersOf(el, ctx, stack) {
  const fields = [];
  for (const m of el.content || []) {
    if (!m || typeof m !== 'object') continue;
    if (m.element === 'member') {
      const ta = (m.attributes?.typeAttributes?.content || []).map((x) => x.content);
      const f = { name: str(m.content.key), required: ta.includes('required'), nullable: ta.includes('nullable') || undefined, description: metaStr(m, 'description') || undefined, ...convert(m.content.value, ctx, stack) };
      fields.push(f);
    } else if (m.element === 'ref') {
      const def = ctx.local.get(str(m)) || ctx.global.get(str(m));
      if (def && !stack.includes(str(m))) fields.push(...membersOf(def, ctx, [...stack, str(m)]));
    } else if (m.element === 'select') {
      fields.push({ name: '(one of)', type: 'oneOf', options: (m.content || []).map((opt) => ({ fields: membersOf({ content: opt.content }, ctx, stack) })) });
    } else if (!BASE.has(m.element)) {
      const def = ctx.local.get(m.element) || ctx.global.get(m.element);
      if (def && !stack.includes(m.element)) fields.push(...membersOf(def, ctx, [...stack, m.element]));
    }
  }
  // Inheritance: `## Child (Parent)` puts the parent's name as the element.
  return fields;
}

function assets(msg) {
  const r = {};
  for (const c of msg?.content || []) {
    if (c.element !== 'asset') continue;
    const k = cls(c)[0];
    if (k === 'messageBody') r.body = c.content;
    if (k === 'messageBodySchema') r.schema = c.content;
  }
  return r;
}
const dsOf = (msg) => (msg?.content || []).find((c) => c.element === 'dataStructure');

function pretty(s) {
  if (!s) return undefined;
  try { return JSON.stringify(JSON.parse(s), null, 2); } catch { return s.replace(/\s+$/g, ''); }
}

const cleanPath = (href) => href.replace(/\{\?[^}]*\}/g, '').replace(/\{&[^}]*\}/g, '').replace(/\?[^{}]*$/, '');
const slugify = (s) => s.toLowerCase().replace(/\{([^}]+)\}/g, '$1').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function hrefParams(hv, ctx, pathStr) {
  if (!hv) return [];
  return (hv.content || []).filter((m) => m.element === 'member').map((m) => {
    const ta = (m.attributes?.typeAttributes?.content || []).map((x) => x.content);
    const name = str(m.content.key);
    const conv = convert(m.content.value, ctx, []);
    let example = conv.example;
    const v = m.content.value;
    if (example === undefined && v && v.content != null && typeof v.content !== 'object') example = tick(v.content);
    return { name, in: pathStr.includes(`{${name}}`) ? 'path' : 'query', required: ta.includes('required') || pathStr.includes(`{${name}}`), description: metaStr(m, 'description') || undefined, ...conv, example };
  });
}

function statusOf(title) {
  if (/under development|not available/i.test(title)) return 'in-development';
  if (/deprecated/i.test(title)) return 'deprecated';
  return 'stable';
}
const cleanTitle = (t) => t.replace(/\[(UNDER DEVELOPMENT|NOT AVAILABLE|DEPRECATED)[^\]]*\]/gi, '').replace(/\s+/g, ' ').trim();

function fallbackFromMarkdown(src, rel, inferredPath) {
  // For the rare contract drafter can't turn into a resource, read the heading and methods directly.
  let h = src.match(/^#\s+(.+?)\s*\[(\/api\/[^\]]+)\]\s*$/m);
  if (!h && inferredPath) { const t = src.match(/^#\s+(?!Data Structures)([^\n]+?)\s*$/m); if (t) h = [t[0], t[1], inferredPath]; }
  if (!h) return [];
  const methods = [...src.matchAll(/^##\s+(GET|POST|PUT|PATCH|DELETE)\s*$/gm)].map((m) => m[1]);
  const desc = src.split(h[0])[1]?.split(/^##\s/m)[0]?.trim();
  const body = src.match(/\+ Body\s*\n\s*\n([\s\S]*?)\n\s*\n\s*\+ /);
  return methods.map((method) => ({ method, rawTitle: h[1], href: h[2], description: desc, requestExample: body ? pretty(body[1].replace(/^ {12}/gm, '')) : undefined }));
}

function build() {
  const { dir, sha } = getContracts();
  const contractsDir = path.join(dir, 'contracts');
  const files = walk(contractsDir).filter((f) => !f.includes(`${path.sep}v1${path.sep}`));
  const drafter = require('drafter.js');
  const parsed = files.map((f) => {
    let src = fs.readFileSync(f, 'utf8');
    let parse = drafter.parseSync(src, { requireBlueprintName: false });
    let inferredPath = null;
    if (!JSON.stringify(parse).includes('"element":"resource"')) {
      // A few contracts omit their URL. Infer it from the file's location, which mirrors the URL by convention.
      const rel = path.relative(contractsDir, f).split(path.sep).join('/').replace(/\.md$/, '');
      inferredPath = `/api/${rel}/`;
      const patched = src.replace(/^#\s+(?!Data Structures)([^\[\n]+?)\s*$/m, `# $1 [${inferredPath}]`);
      parse = drafter.parseSync(patched, { requireBlueprintName: false });
    }
    let errors = parse.content.filter((e) => e.element === 'annotation' && cls(e)[0] === 'error').map((e) => e.content);
    const notes = [];
    // Tolerate two known kinds of upstream slips so one contract can't drop an endpoint:
    // a type name whose capitalization differs from its definition, and a type that is never defined.
    for (let pass = 0; pass < 6; pass++) {
      const err = errors.map((e) => e.match(/base type '([^']+)' is not defined/)).find(Boolean);
      if (!err) break;
      const name = err[1];
      const def = [...src.matchAll(/^#+\s+([A-Za-z0-9_]+)\s*\(/gm)].map((x) => x[1]).find((n) => n.toLowerCase() === name.toLowerCase() && n !== name);
      if (def) {
        src = src.replaceAll(name, def);
        notes.push(`The contract refers to \`${name}\` but defines it as \`${def}\`. The docs read them as the same type.`);
      } else {
        src = /^# Data Structures\s*$/m.test(src) ? src.replace(/^# Data Structures\s*$/m, `# Data Structures\n\n## ${name} (object)\n`) : `${src}\n\n# Data Structures\n\n## ${name} (object)\n`;
        notes.push(`The contract refers to \`${name}\` but never defines it, so its fields aren't listed here.`);
      }
      parse = drafter.parseSync(inferredPath ? src.replace(/^#\s+(?!Data Structures)([^\[\n]+?)\s*$/m, `# $1 [${inferredPath}]`) : src, { requireBlueprintName: false });
      errors = parse.content.filter((e) => e.element === 'annotation' && cls(e)[0] === 'error').map((e) => e.content);
    }
    return { f, rel: path.relative(dir, f), src, parse, errors, inferredPath, notes };
  });
  const global = new Map();
  for (const p of parsed) for (const [k, v] of collectStructures(p.parse)) if (!global.has(k)) global.set(k, v);

  const endpoints = [];
  const problems = [];
  for (const p of parsed) {
    if (p.errors.length) problems.push({ file: p.rel, errors: p.errors });
    const ctx = { local: collectStructures(p.parse), global };
    const resources = [];
    const findResources = (e) => { if (!e || typeof e !== 'object') return; if (Array.isArray(e)) return e.forEach(findResources); if (e.element === 'resource') resources.push(e); else if (e.content && typeof e.content === 'object') findResources(e.content); };
    findResources(p.parse);
    const sourceUrl = `${REPO}/blob/${sha || 'master'}/${CONTRACT_SUBDIR}/${p.rel.split(path.sep).join('/')}`;
    let count = 0;
    for (const r of resources) {
      const href = str(r.attributes?.href);
      const rTitle = metaStr(r, 'title');
      const rCopy = (r.content || []).filter((c) => c.element === 'copy').map(str).join('\n\n');
      for (const t of (r.content || []).filter((c) => c.element === 'transition')) {
        const tx = (t.content || []).find((c) => c.element === 'httpTransaction');
        if (!tx) continue;
        const req = tx.content.find((c) => c.element === 'httpRequest');
        const res = tx.content.find((c) => c.element === 'httpResponse');
        const method = str(req?.attributes?.method) || 'GET';
        const tHref = str(t.attributes?.href) || href;
        const p0 = cleanPath(tHref);
        const reqDs = dsOf(req);
        const resDs = dsOf(res);
        const reqA = assets(req);
        const resA = assets(res);
        const title = cleanTitle(metaStr(t, 'title') || rTitle);
        const params = [...hrefParams(r.attributes?.hrefVariables, ctx, tHref), ...hrefParams(t.attributes?.hrefVariables, ctx, tHref)];
        const e = {
          id: slugify(`${method}-${p0.replace(/^\/api\//, '')}`),
          method,
          path: p0,
          title: title || p0,
          status: statusOf(`${rTitle} ${metaStr(t, 'title')}`),
          summary: fixLinks(((t.content || []).filter((c) => c.element === 'copy').map(str).join('\n\n') || '').trim()) || undefined,
          description: fixLinks(rCopy.trim()) || undefined,
          feature: featureFor(p0),
          params: params.length ? params : undefined,
          request: reqDs ? convert(Array.isArray(reqDs.content) ? reqDs.content[0] : reqDs.content, ctx) : undefined,
          requestExample: pretty(reqA.body),
          response: resDs ? convert(Array.isArray(resDs.content) ? resDs.content[0] : resDs.content, ctx) : undefined,
          responseExample: pretty(resA.body),
          statusCode: str(res?.attributes?.statusCode) || undefined,
          source: { file: p.rel.split(path.sep).join('/'), url: sourceUrl },
          pathInferred: p.inferredPath ? true : undefined,
          contractNotes: p.notes.length ? p.notes : undefined,
        };
        endpoints.push(e);
        count++;
      }
    }
    if (!count) {
      for (const fb of fallbackFromMarkdown(p.src, p.rel, p.inferredPath)) {
        const p0 = cleanPath(fb.href);
        endpoints.push({ id: slugify(`${fb.method}-${p0.replace(/^\/api\//, '')}`), method: fb.method, path: p0, title: cleanTitle(fb.rawTitle), status: statusOf(fb.rawTitle), description: fixLinks(fb.description || ''), pathInferred: p.inferredPath ? true : undefined, contractErrors: p.errors.length ? p.errors : undefined, feature: featureFor(p0), requestExample: fb.requestExample, source: { file: p.rel.split(path.sep).join('/'), url: sourceUrl }, partial: true });
        count++;
      }
      if (!count) problems.push({ file: p.rel, errors: ['No endpoints found in this contract'] });
    }
  }

  // De-duplicate ids (same method + path in two files) by suffixing.
  const seen = new Map();
  for (const e of endpoints) { const n = seen.get(e.id) || 0; seen.set(e.id, n + 1); if (n) e.id = `${e.id}-${n + 1}`; }
  endpoints.sort((a, b) => a.path.localeCompare(b.path) || a.method.localeCompare(b.method));

  const filterGuidePath = path.join(dir, 'search_filters.md');
  const filterGuide = fs.existsSync(filterGuidePath) ? fs.readFileSync(filterGuidePath, 'utf8') : null;

  const features = FEATURES.map((f) => ({ ...f, endpointIds: endpoints.filter((e) => e.feature === f.id).map((e) => e.id) })).filter((f) => f.endpointIds.length);
  const doc = {
    generatedAt: new Date().toISOString(),
    source: { repo: REPO, sha, contracts: files.length },
    sections: SECTIONS,
    features,
    endpoints,
    filterGuide,
    problems,
  };
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(doc));
  log(`${endpoints.length} operations from ${files.length} contracts, ${problems.length} problem files -> lib/docs.json (${(fs.statSync(OUT).size / 1024).toFixed(0)} KB)`);
}

try {
  build();
} catch (err) {
  if (fs.existsSync(OUT)) {
    log('Could not refresh from contracts, keeping the committed lib/docs.json:', err.message);
  } else {
    throw err;
  }
}
