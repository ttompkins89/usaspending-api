import { highlight } from '@/lib/highlight';
import { CodeFrame, CodeTabsClient } from './CodeClient';

export async function Code({ code, lang = 'json', label }: { code: string; lang?: string; label?: string }) {
  const html = await highlight(code, lang);
  return <CodeFrame code={code} html={html} label={label || lang} />;
}

export async function CodeTabs({ tabs, group = 'lang' }: { tabs: { label: string; lang: string; code: string }[]; group?: string }) {
  const rendered = await Promise.all(tabs.map(async (t) => ({ ...t, html: await highlight(t.code, t.lang) })));
  return <CodeTabsClient tabs={rendered} group={group} />;
}
