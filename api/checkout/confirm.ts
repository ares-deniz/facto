import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SK as string, {
  apiVersion: '2024-06-20',
});

// --- CORS helper (allow www + apex) ---
function applyCors(req: VercelRequest, res: VercelResponse) {
  const allowedOrigins = [
    'https://www.facto.cloud',
    'https://facto.cloud',
  ];
  const origin = req.headers.origin as string | undefined;

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true; // stop here for preflight
  }
  return false;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (applyCors(req, res)) return;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const sessionId = req.query.session_id as string;

    if (!sessionId) {
      return res.status(400).json({
        ok: false,
        error: 'Missing session_id',
      });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      return res.status(200).json({
        ok: true,
        uid: session.metadata?.uid || undefined,
        plan: session.metadata?.plan as 'monthly' | 'yearly' | undefined,
      });
    }

    return res.status(400).json({
      ok: false,
      error: 'Payment not completed',
    });
  } catch (e: any) {
    console.error('Confirm error:', e);
    return res.status(500).json({
      ok: false,
      error: e.message,
    });
  }
}
