import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';

// Renders contract prose and hand-written content. Links to usaspending.gov and GitHub open normally;
// relative links were already rewritten by the generator.
export function Markdown({ children, className }: { children?: string; className?: string }) {
  if (!children) return null;
  return (
    <div className={className ? `prose ${className}` : 'prose'}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug]}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
