export const TEXT_LIMITS = {
  page: {
    visitation_description: 500,
    funeral_description: 500,
    obituary: 5000,
    donation_description: 500,
  },
  reply: {
    reply: 1000,
  },
  // Stripe rejects metadata values longer than 500 characters
  donation: {
    comments: 500,
  },
  family: {
    invite_note: 500,
  },
} as const
