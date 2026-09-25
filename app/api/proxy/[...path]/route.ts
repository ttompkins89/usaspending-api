import { NextRequest, NextResponse } from 'next/server';

// Forwards live-console requests to the USAspending API. Only /api/v2/ paths on
// api.usaspending.gov are allowed, so this can never be used to reach any other host.
export const dynamic = 'force-dynamic';
// Some USAspending endpoints (COVID-19 spending, large searches) take 30 seconds or more.
export const maxDuration = 60;

const UPSTREAM = 'https://api.usaspending.gov/api/';
const SEGMENT = /^[A-Za-z0-9_\-.~%]+$/;
const MAX_BODY = 100_000;
const MAX_RESPONSE = 5_000_000;
const TIMEOUT_MS = 55_000;

function target(req: NextRequest, segments: string[]) {
  if (segments[0] !== 'v2' || segments.some((s) => !SEGMENT.test(s) || s === '..' || s === '.')) return null;
  const trailing = req.nextUrl.pathname.endsWith('/') ? '/' : '';
  return `${UPSTREAM}${segments.join('/')}${trailing}${req.nextUrl.search}`;
}

async function forward(req: NextRequest, segments: string[], method: 'GET' | 'POST') {
  const url = target(req, segments);
  if (!url) return NextResponse.json({ error: 'The console only calls /api/v2/ endpoints on api.usaspending.gov.' }, { status: 400 });
  let body: string | undefined;
  if (method === 'POST') {
    body = await req.text();
    if (body.length > MAX_BODY) return NextResponse.json({ error: 'Request body is too large for the console (100 KB max).' }, { status: 413 });
  }
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const started = Date.now();
    const res = await fetch(url, {
      method,
      body,
      headers: { 'content-type': 'application/json', accept: 'application/json', 'user-agent': 'USAspending API Reference live console (usaspending-api.vercel.app)' },
      signal: ctrl.signal,
      cache: 'no-store',
    });
    const buf = await res.arrayBuffer();
    const truncated = buf.byteLength > MAX_RESPONSE;
    const text = new TextDecoder().decode(truncated ? buf.slice(0, MAX_RESPONSE) : buf);
    const headers: Record<string, string> = {
      'content-type': res.headers.get('content-type') || 'application/json',
      'x-upstream-ms': String(Date.now() - started),
      'x-upstream-url': url,
    };
    if (truncated) headers['x-truncated'] = 'true';
    if (method === 'GET' && res.ok) headers['cache-control'] = 'public, s-maxage=3600, stale-while-revalidate=86400';
    return new NextResponse(text, { status: res.status, headers });
  } catch (err) {
    const aborted = err instanceof Error && err.name === 'AbortError';
    return NextResponse.json({ error: aborted ? 'The USAspending API took longer than 55 seconds to answer. Try again, or narrow the request (a shorter time period or fewer filters).' : 'The USAspending API closed the connection without answering. Try again in a moment.' }, { status: 504 });
  } finally {
    clearTimeout(timer);
  }
}

type Ctx = { params: Promise<{ path: string[] }> };
export async function GET(req: NextRequest, { params }: Ctx) {
  return forward(req, (await params).path, 'GET');
}
export async function POST(req: NextRequest, { params }: Ctx) {
  return forward(req, (await params).path, 'POST');
}
