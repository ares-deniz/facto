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
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true; // stop here for preflight
  }
  return false;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (applyCors(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, plan = 'monthly', uid } = req.body;

    const priceId =
      plan === 'yearly'
        ? process.env.PRICE_ID_YEARLY
        : process.env.PRICE_ID_MONTHLY;

    if (!priceId) {
      return res.status(400).json({
        error: 'Missing Stripe price id for selected plan',
      });
    }

    // Use your public site as base (already set in Vercel)
    const base = process.env.CLIENT_URL || 'https://www.facto.cloud';
    const path = process.env.CLIENT_PATH || '/home';
    const redirectBase = `${base}${path}`;

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: true,
      metadata: {
        uid: uid || 'anonymous',
        plan: plan,
      },
      success_url: `${redirectBase}?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${redirectBase}?checkout=cancelled`,
    });

    return res.status(200).json({ url: session.url });
  } catch (e: any) {
    console.error('Stripe error:', e);
    return res.status(500).json({ error: e.message });
  }
}
