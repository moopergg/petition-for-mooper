// /api/reset.js
import { put } from '@vercel/blob';

export async function GET() {
  try {
    await put('supporters', JSON.stringify([]), {
      access: 'public',
      contentType: 'application/json'
    });
    return new Response('Reset complete', { status: 200 });
  } catch (err) {
    console.error('Reset error:', err);
    return new Response('Server error', { status: 500 });
  }
}
