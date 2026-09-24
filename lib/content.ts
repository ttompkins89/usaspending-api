import 'server-only';
import fs from 'node:fs';
import path from 'node:path';

export function content(name: string) {
  const p = path.join(process.cwd(), 'content', `${name}.md`);
  return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '';
}
