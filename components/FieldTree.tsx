import type { Field } from '@/lib/docs';
import { Markdown } from './Markdown';

function typeLabel(f: Field): string {
  if (f.type === 'array') return f.items ? `array of ${f.items.ref || typeLabel(f.items)}` : 'array';
  if (f.type === 'enum') return `enum${f.valueType ? ` (${f.valueType})` : ''}`;
  if (f.type === 'oneOf') return 'one of';
  return f.ref && !['object', 'array', 'enum'].includes(f.type) ? f.ref : f.ref ? `${f.type} · ${f.ref}` : f.type;
}

function childrenOf(f: Field): Field[] | undefined {
  if (f.fields?.length) return f.fields;
  if (f.type === 'array' && f.items?.fields?.length) return f.items.fields;
  return undefined;
}

function show(v: unknown) {
  return typeof v === 'string' ? v : JSON.stringify(v);
}

function Row({ f, depth }: { f: Field; depth: number }) {
  const kids = childrenOf(f);
  const enumVals = f.enum || (f.type === 'array' ? f.items?.enum : undefined);
  const refDesc = f.refDescription || (f.type === 'array' ? f.items?.refDescription : undefined);
  const body = (
    <>
      {f.description ? <Markdown className="field-desc">{f.description}</Markdown> : null}
      {!f.description && refDesc ? <Markdown className="field-desc">{refDesc}</Markdown> : null}
      {enumVals?.length ? (
        <div className="field-enum">
          <span className="field-meta-label">Allowed values</span>
          <ul>
            {enumVals.slice(0, 60).map((v, i) => (
              <li key={i}><code>{show(v.value)}</code>{v.description ? <span> {v.description}</span> : null}</li>
            ))}
            {enumVals.length > 60 ? <li>and {enumVals.length - 60} more in the source contract</li> : null}
          </ul>
        </div>
      ) : null}
      {f.default !== undefined ? <p className="field-meta"><span className="field-meta-label">Default</span> <code>{show(f.default)}</code></p> : null}
      {f.example !== undefined && f.type !== 'object' ? <p className="field-meta"><span className="field-meta-label">Example</span> <code>{show(f.example)}</code></p> : null}
      {f.options?.length ? (
        <div className="field-oneof">
          {f.options.map((o, i) => (
            <div key={i} className="field-option">
              <span className="field-meta-label">Option {i + 1}</span>
              <FieldList fields={o.fields} depth={depth + 1} />
            </div>
          ))}
        </div>
      ) : null}
    </>
  );
  const head = (
    <span className="field-head">
      <code className="field-name">{f.name}</code>
      <span className="field-type">{typeLabel(f)}</span>
      {f.required ? <span className="field-req">Required</span> : null}
      {f.nullable ? <span className="field-null">Nullable</span> : null}
    </span>
  );
  if (kids) {
    return (
      <li className="field">
        <details open={depth === 0 && kids.length <= 12}>
          <summary>{head}<span className="field-count">{kids.length} {kids.length === 1 ? 'field' : 'fields'}</span></summary>
          {body}
          <FieldList fields={kids} depth={depth + 1} />
        </details>
      </li>
    );
  }
  return (
    <li className="field">
      {head}
      {body}
    </li>
  );
}

export function FieldList({ fields, depth = 0 }: { fields: Field[]; depth?: number }) {
  if (!fields.length) return <p className="muted">No fields are documented for this object.</p>;
  return (
    <ul className={`fields depth-${Math.min(depth, 4)}`}>
      {fields.map((f, i) => <Row key={`${f.name}-${i}`} f={f} depth={depth} />)}
    </ul>
  );
}

export function Schema({ field }: { field?: Field }) {
  if (!field) return <p className="muted">The contract doesn&apos;t describe this body.</p>;
  const kids = childrenOf(field);
  if (kids) return <FieldList fields={kids} />;
  return <FieldList fields={[{ ...field, name: '(body)' }]} />;
}
