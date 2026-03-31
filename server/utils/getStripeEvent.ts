const runtime = useRuntimeConfig()
const endpointSecret = runtime.STRIPE_WEBHOOK_SECRET

export default async function getStripeEvent(
  event: H3Event,
  stripe: Stripe
): Stripe.Event | null {
  const sig = getHeader(event, 'stripe-signature');

  try {
    return stripe.webhooks.constructEvent(event.context.rawBody, sig, endpointSecret);
  } catch (err: any) {
    console.error('Error occured while constructing stripe event:', err);
    return null
  }
}
