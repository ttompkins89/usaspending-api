export function MethodBadge({ method, size = 'md' }: { method: string; size?: 'sm' | 'md' }) {
  return <span className={`method method-${method.toLowerCase()} method-${size}`}>{method}</span>;
}
