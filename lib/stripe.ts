import Stripe from 'stripe';
import { requiredEnv } from './env';

let stripe: Stripe | null = null;

export function getStripe() {
  if (stripe) return stripe;
  stripe = new Stripe(requiredEnv('STRIPE_SECRET_KEY'));
  return stripe;
}
