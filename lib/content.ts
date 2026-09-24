import fs from 'node:fs';
import path from 'node:path';

export function content(name: string) {
  return fs.readFileSync(path.join(process.cwd(), 'content', `${name}.md`), 'utf8');
}
