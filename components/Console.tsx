'use client';
import { useEffect, useMemo, useState } from 'react';

type Param = { name?: string; in?: 'path' | 'query'; required?: boolean; example?: unknown; default?: unknown; enum?: { value: unknown }[]; type: string };

const API = 'https://api.usaspending.gov';

function initial(p: Param) {
  const v = p.example ?? (p.in === 'path' ? '' : undefined);
  return v === undefined || v === null ? '' : typeof v === 'string' ? v : JSON.stringify(v);
}

export function Console({ method, path, params = [], requestExample, compact: small }: { method: string; path: string; params?: Param[]; requestExample?: string; compact?: boolean }) {
  const [values, setValues] = useState<Record<string, string>>(() => Object.fromEntries(params.map((p) => [p.name || '', initial(p)])));
  const [body, setBody] = useState(requestExample || '{}');
  const [state, setState] = useState<{ status?: number; ms?: number; text?: string; note?: string; error?: string; loading?: boolean; truncated?: boolean }>({});
  const [elapsed, setElapsed] = useState(0);

  // Some endpoints take 20 to 50 seconds, so show time passing while a request is open.
  useEffect(() => {
    if (!state.loading) return;
    setElapsed(0);
    const started = Date.now();
    const t = setInterval(() => setElapsed(Math.floor((Date.now() - started) / 1000)), 1000);
    return () => clearInterval(t);
  }, [state.loading]);

  const built = useMemo(() => {
    let p = path;
    const q = new URLSearchParams();
    for (const prm of params) {
      const v = values[prm.name || '']?.trim();
      if (prm.in === 'path') p = p.replace(`{${prm.name}}`, v ? encodeURIComponent(v) : `{${prm.name}}`);
      else if (v) q.set(prm.name || '', v);
    }
    const qs = q.toString();
    return { path: p, url: `${p}${qs ? `?${qs}` : ''}`, missing: /\{[^}]+\}/.test(p) };
  }, [path, params, values]);

  let bodyError: string | null = null;
  if (method === 'POST') {
    try { JSON.parse(body); } catch { bodyError = 'The request body isn’t valid JSON yet.'; }
  }


  async function send() {
    setState({ loading: true });
    const started = performance.now();
    try {
      const res = await fetch(`/api/proxy${built.url.replace(/^\/api/, '')}`, {
        method,
        headers: { 'content-type': 'application/json' },
        body: method === 'POST' ? body : undefined,
      });
      const text = await res.text();
      const ms = Math.round(performance.now() - started);
      let pretty = text;
      let isJson = true;
      try { pretty = JSON.stringify(JSON.parse(text), null, 2); } catch { isJson = false; }
      // The API answers unknown routes with an HTML "Not Found" page. Explain it instead of printing markup.
      if (!isJson && /<html|<!doctype/i.test(text)) {
        const note = res.status === 404
          ? 'api.usaspending.gov has no route at this URL. The contract documents it, but the live API returns its HTML "Not Found" page, so the endpoint may be retired or renamed.'
          : `The API returned an HTML page instead of JSON (status ${res.status}).`;
        setState({ status: res.status, ms, note });
        return;
      }
      const cap = 200_000;
      setState({ status: res.status, ms, text: pretty.length > cap ? `${pretty.slice(0, cap)}\n…` : pretty, truncated: pretty.length > cap || res.headers.get('x-truncated') === 'true' });
    } catch {
      setState({ error: 'The request didn’t complete. Check your connection and try again.' });
    }
  }

  return (
    <section className="console" aria-labelledby="try-it" data-toc-skip={small ? true : undefined}>
      <div className="console-head">
        <h2 id="try-it">Try it</h2>
        <p>Runs against the live API. Responses are real data.</p>
      </div>
      <div className="console-inner">
      <div className="console-url"><span className={`method method-${method.toLowerCase()} method-sm`}>{method}</span><code>{built.url}</code></div>
      {params.length ? (
        <div className="console-params">
          {params.map((p) => {
            const id = `param-${p.name}`;
            return (
              <div key={p.name} className="console-field">
                <label htmlFor={id}>
                  <code>{p.name}</code> <span className="muted">{p.in}{p.required ? ', required' : ''}</span>
                </label>
                {p.enum?.length ? (
                  <select id={id} value={values[p.name || ''] ?? ''} onChange={(e) => setValues({ ...values, [p.name || '']: e.target.value })}>
                    <option value="">{p.required ? 'Choose a value' : 'Not set'}</option>
                    {p.enum.map((o) => <option key={String(o.value)} value={String(o.value)}>{String(o.value)}</option>)}
                  </select>
                ) : (
                  <input id={id} type="text" value={values[p.name || ''] ?? ''} onChange={(e) => setValues({ ...values, [p.name || '']: e.target.value })} placeholder={p.default !== undefined ? `Default: ${String(p.default)}` : undefined} />
                )}
              </div>
            );
          })}
        </div>
      ) : null}
      {method === 'POST' ? (
        <div className="console-field">
          <label htmlFor="console-body">Request body</label>
          <textarea id="console-body" spellCheck={false} value={body} onChange={(e) => setBody(e.target.value)} rows={Math.min(18, Math.max(6, body.split('\n').length + 1))} aria-describedby={bodyError ? 'console-body-error' : undefined} />
          {bodyError ? <p id="console-body-error" className="console-error">{bodyError}</p> : null}
        </div>
      ) : null}
      <div className="console-actions">
        <button type="button" className="button button-lg" onClick={send} disabled={state.loading || !!bodyError || built.missing}>
          {state.loading ? `Waiting… ${elapsed}s` : 'Send request'}
        </button>
        {state.loading && elapsed >= 5 ? <span className="muted">Some endpoints take up to a minute to answer.</span> : null}
        {built.missing ? <span className="muted">Fill in the path parameters first.</span> : null}
      </div>
      <div aria-live="polite">
        {state.error ? <p className="console-error">{state.error}</p> : null}
        {state.status !== undefined ? (
          <div className="console-result">
            <p className="console-status">
              <span className={state.status < 400 ? 'ok' : 'bad'}>{state.status}</span> in {state.ms} ms
              {state.truncated ? <span className="muted"> · showing the first part of a large response</span> : null}
            </p>
            {state.note ? <p className="console-note">{state.note}</p> : <pre tabIndex={0} className="console-response" aria-label="Response body"><code>{state.text}</code></pre>}
          </div>
        ) : null}
      </div>
      </div>
    </section>
  );
}
