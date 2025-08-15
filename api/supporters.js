// /api/supporters.js
import { get, put } from '@vercel/blob';

async function readSupporters() {
  try {
    const blob = await get('supporters');
    if (!blob) return [];
    const text = await blob.text();
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    // If the blob doesn't exist or JSON is invalid, start fresh
    return [];
  }
}

export async function GET() {
  const supporters = await readSupporters();
  return new Response(JSON.stringify({ supporters }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store'
    }
  });
}

export async function POST(req) {
  try {
    const { username } = await req.json();
    const name = typeof username === 'string' ? username.trim() : '';

    if (!name || name.length > 50) {
      return new Response(JSON.stringify({ error: 'Invalid username' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const supporters = await readSupporters();
    supporters.push(name);

    await put('supporters', JSON.stringify(supporters), {
      access: 'public',
      contentType: 'application/json'
    });

    return new Response(JSON.stringify({ supporters }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('POST /api/supporters error:', err);
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
