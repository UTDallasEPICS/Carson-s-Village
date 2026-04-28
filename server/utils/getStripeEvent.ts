const runtime = useRuntimeConfig()
const endpointSecret = runtime.STRIPE_WEBHOOK_SECRET

export default async function getStripeEvent(
  rawBody: String,
  signature: String,
  stripe: Stripe
): Stripe.Event | null {
  try {
    return stripe.webhooks.constructEvent(rawBody, signature, endpointSecret);
  } catch (err: any) {
    console.error('Error occured while constructing stripe event:\n', err);
    return null
  }
}
