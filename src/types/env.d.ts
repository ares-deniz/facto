declare namespace NodeJS {
  interface ProcessEnv {
    STRIPE_SK: string;
    CLIENT_URL: string; // e.g., http://localhost:5173
    PRICE_ID_MONTHLY: string;
    PRICE_ID_YEARLY: string;
    PORT?: string;
    WEBHOOK_SECRET?: string;
  }
}
