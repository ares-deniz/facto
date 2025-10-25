import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import Stripe from 'stripe';

const app = express();
const stripe = new Stripe(process.env.STRIPE_SK as string, {
  apiVersion: '2024-06-20',
});

// Middlewares (webhooks would need express.raw() BEFORE json() — skipped here)
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());

interface CreateSessionBody {
  email?: string;
  plan?: 'monthly' | 'yearly';
}

app.post(
  '/api/create-checkout-session',
  async (req: Request<unknown, unknown, CreateSessionBody>, res: Response) => {
    try {
      const { email, plan = 'monthly' } = req.body ?? {};
      const priceId =
        plan === 'yearly'
          ? process.env.PRICE_ID_YEARLY
          : process.env.PRICE_ID_MONTHLY;

      if (!priceId) {
        return res
          .status(400)
          .json({ error: 'Missing Stripe price id for selected plan' });
      }

      // Build redirect base (supports e.g. CLIENT_URL=http://localhost:8080 and CLIENT_PATH=/home)
      const base = process.env.CLIENT_URL ?? 'http://localhost:8080';
      const path = process.env.CLIENT_PATH ?? '';
      const redirectBase = `${base}${path}`;

      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: ['card'],
        customer_email: email,
        line_items: [{ price: priceId, quantity: 1 }],
        // If you didn’t add trial on the Price in Stripe, enable it here:
        // subscription_data: { trial_period_days: 3 },
        allow_promotion_codes: true,
        success_url: `${redirectBase}?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${redirectBase}?checkout=cancelled`,
      });

      return res.json({ url: session.url });
    } catch (e: any) {
      console.error(e);
      return res.status(500).json({ error: e.message });
    }
  }
);

app.get('/api/health', (_: Request, res: Response) => res.json({ ok: true }));

const PORT = Number(process.env.PORT ?? 8787);
app.listen(PORT, () => {
  console.log(`Stripe server running at http://localhost:${PORT}`);
});
