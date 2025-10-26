import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SK as string, {
  apiVersion: '2024-06-20',
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', process.env.CLIENT_URL || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

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

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Check if payment was successful
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
