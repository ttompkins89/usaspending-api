export function TallyMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" aria-hidden="true" focusable="false" className="tally-mark">
      <rect width="56" height="56" rx="10" fill="var(--color-action)" />
      {[14, 22, 30, 38].map((x) => (
        <line key={x} x1={x} y1="14" x2={x} y2="42" stroke="var(--color-on-band)" strokeWidth="4" strokeLinecap="round" />
      ))}
      <line x1="8" y1="38" x2="46" y2="18" stroke="var(--color-highlight)" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}
