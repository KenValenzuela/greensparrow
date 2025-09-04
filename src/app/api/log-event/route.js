export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    // keep it lightweight, never throw
    console.log('log-event', body);
    return new Response(null, {status: 204});
  } catch {
    return new Response(null, {status: 204});
  }
}

export async function GET() {
  return new Response('ok', {status: 200});
}
