export const TEXT_LIMITS = {
  page: {
    visitation_description: 1000,
    funeral_description: 1000,
    obituary: 5000,
    donation_description: 1500,
  },
  reply: {
    reply: 1000,
  },
  // Stripe rejects metadata values longer than 500 characters
  donation: {
    comments: 500,
  },
} as const
