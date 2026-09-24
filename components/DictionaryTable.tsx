'use client';
import { useMemo, useState } from 'react';

type Props = { headers: { raw: string; display: string }[]; sections: { section: string; colspan: number }[]; rows: (string | null)[][] };

// Searchable data dictionary. Each element opens to show where it appears in downloads,
// the database, and legacy files, grouped by the dictionary's own column sections.
export function DictionaryTable({ headers, sections, rows }: Props) {
  const [q, setQ] = useState('');
  const [group, setGroup] = useState('');
  const [limit, setLimit] = useState(60);
  // The live API prefixes column names with their spreadsheet letter ("B:definition").
  const col = (raw: string) => headers.findIndex((h) => h.raw.replace(/^[A-Z]+:/, '') === raw);
  const iEl = Math.max(0, col('element'));
  const iDef = col('definition');
  const iGroup = col('grouping');
  const sectionOf = useMemo(() => {
    const out: string[] = [];
    for (const s of sections) for (let i = 0; i < s.colspan; i++) out.push(s.section);
    return out;
  }, [sections]);
  const groups = useMemo(() => (iGroup < 0 ? [] : [...new Set(rows.map((r) => r[iGroup]).filter(Boolean) as string[])].sort()), [rows, iGroup]);
  const filtered = useMemo(() => {
    const w = q.toLowerCase().trim();
    return rows.filter((r) => (!group || r[iGroup] === group) && (!w || r.some((c) => c && c.toLowerCase().includes(w))));
  }, [rows, q, group, iGroup]);

  return (
    <div>
      <div className="filter-bar">
        <label className="sr-only" htmlFor="dd-q">Search the data dictionary</label>
        <input id="dd-q" type="search" placeholder="Search elements, definitions, file columns" value={q} onChange={(e) => { setQ(e.target.value); setLimit(60); }} />
        {groups.length ? (
          <>
            <label className="sr-only" htmlFor="dd-g">Grouping</label>
            <select id="dd-g" value={group} onChange={(e) => { setGroup(e.target.value); setLimit(60); }}>
              <option value="">All groupings</option>
              {groups.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </>
        ) : null}
        <span className="muted" aria-live="polite">{filtered.length} of {rows.length} elements</span>
      </div>
      <div className="ep-list">
        {filtered.slice(0, limit).map((r, n) => (
          <details key={`${r[iEl]}-${n}`} className="ep">
            <summary style={{ gridTemplateColumns: 'minmax(0, 1fr) auto' }}>
              <span className="ep-title"><strong>{r[iEl]}</strong>{iDef >= 0 && r[iDef] ? <span className="muted" style={{ fontSize: 'var(--font-size-14)' }}>{(r[iDef] || '').slice(0, 140)}{(r[iDef] || '').length > 140 ? '…' : ''}</span> : null}</span>
              <span className="ep-side">{iGroup >= 0 && r[iGroup] ? <span className="pill">{r[iGroup]}</span> : null}</span>
            </summary>
            <div className="ep-body">
              {iDef >= 0 && r[iDef] ? <p style={{ whiteSpace: 'pre-line' }}>{r[iDef]}</p> : null}
              <div className="table-wrap">
                <table className="table">
                  <tbody>
                    {headers.map((h, i) => (i === iEl || i === iDef || !r[i] ? null : (
                      <tr key={h.raw}>
                        <th scope="row" style={{ width: '38%' }}><span className="muted" style={{ fontWeight: 400 }}>{sectionOf[i] ? `${sectionOf[i]} · ` : ''}</span>{h.display}</th>
                        <td style={{ whiteSpace: 'pre-line', overflowWrap: 'anywhere' }}>{r[i]}</td>
                      </tr>
                    )))}
                  </tbody>
                </table>
              </div>
            </div>
          </details>
        ))}
      </div>
      {filtered.length > limit ? <button type="button" className="button button-ghost" onClick={() => setLimit(limit + 100)}>Show {Math.min(100, filtered.length - limit)} more</button> : null}
    </div>
  );
}
