// /api/supporters.js
import { list, put } from '@vercel/blob';

async function readSupporters() {
  try {
    const { blobs } = await list();
    const existing = blobs.find(b => b.pathname === 'supporters');
    if (!existing) return [];
    const res = await fetch(existing.url);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error('readSupporters error:', err);
    return [];
  }
}

export async function GET() {
  const supporters = await readSupporters();
  return new Response(JSON.stringify({ supporters }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
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
    console.error('POST error:', err);
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
