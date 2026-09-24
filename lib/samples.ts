import type { Endpoint } from './docs';
import { API_HOST } from './docs';

// Builds ready-to-run request samples from the contract: example path parameters filled in,
// the contract's example body for POST requests.
function filledPath(e: Endpoint) {
  let p = e.path;
  const query: string[] = [];
  for (const prm of e.params || []) {
    const ex = prm.example ?? prm.default;
    if (prm.in === 'path') p = p.replace(`{${prm.name}}`, ex !== undefined && ex !== '' ? String(ex) : `{${prm.name}}`);
    else if (prm.required && ex !== undefined) query.push(`${prm.name}=${encodeURIComponent(String(ex))}`);
  }
  return `${p}${query.length ? `?${query.join('&')}` : ''}`;
}
function body(e: Endpoint) {
  if (!e.requestExample) return '{}';
  try { return JSON.stringify(JSON.parse(e.requestExample), null, 2); } catch { return e.requestExample; }
}
export function samples(e: Endpoint) {
  const url = `${API_HOST}${filledPath(e)}`;
  const isPost = e.method === 'POST';
  const b = body(e);
  const indent = (s: string, n: number) => s.split('\n').map((l, i) => (i ? ' '.repeat(n) + l : l)).join('\n');
  return [
    { lang: 'bash', label: 'cURL', code: isPost ? `curl -X POST '${url}' \\\n  -H 'Content-Type: application/json' \\\n  -d '${b.replace(/'/g, "'\\''")}'` : `curl '${url}'` },
    { lang: 'python', label: 'Python', code: isPost ? `import requests\n\nbody = ${indent(b.replace(/\btrue\b/g, 'True').replace(/\bfalse\b/g, 'False').replace(/\bnull\b/g, 'None'), 7)}\n\nresponse = requests.post("${url}", json=body)\nresponse.raise_for_status()\nprint(response.json())` : `import requests\n\nresponse = requests.get("${url}")\nresponse.raise_for_status()\nprint(response.json())` },
    { lang: 'javascript', label: 'JavaScript', code: isPost ? `const response = await fetch("${url}", {\n  method: "POST",\n  headers: { "Content-Type": "application/json" },\n  body: JSON.stringify(${indent(b, 2)}),\n});\nconst data = await response.json();\nconsole.log(data);` : `const response = await fetch("${url}");\nconst data = await response.json();\nconsole.log(data);` },
  ];
}
