import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import { Code } from './Code';

type HastNode = { type: string; value?: string; tagName?: string; properties?: { className?: string[] }; children?: HastNode[] };
const text = (n?: HastNode): string => (!n ? '' : n.type === 'text' ? n.value || '' : (n.children || []).map(text).join(''));

// Renders contract prose and hand-written content. Fenced code gets the same highlighting as the rest of the site.
export function Markdown({ children, className }: { children?: string; className?: string }) {
  if (!children) return null;
  return (
    <div className={className ? `prose ${className}` : 'prose'}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug]}
        components={{
          pre({ node }) {
            const codeEl = (node as unknown as HastNode)?.children?.find((c) => c.tagName === 'code');
            const cls = codeEl?.properties?.className?.find((c) => c.startsWith('language-'));
            const lang = cls ? cls.replace('language-', '') : 'text';
            return <Code code={text(codeEl).replace(/\n$/, '')} lang={lang === 'sh' || lang === 'shell' ? 'bash' : lang === 'js' ? 'javascript' : lang} />;
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
