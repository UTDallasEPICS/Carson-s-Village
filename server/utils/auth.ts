import { betterAuth } from 'better-auth';
import { APIError, createAuthMiddleware } from 'better-auth/api';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { emailOTP } from 'better-auth/plugins/email-otp';
import { sendLogin } from '#server/utils/emails/sendLogin';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'sqlite',
  }),

  // Add hooks.before middleware to intercept endpoint requests
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      // Intercept OTP request endpoint
      if (ctx.path === '/email-otp/send-verification-otp') {
        const email = ctx.body?.email;
        if (email) {
          const user = await prisma.user.findUnique({
            where: { email },
            select: { isActive: true },
          });

          if (user && !user.isActive) {
            throw new APIError("FORBIDDEN", {
              message: 'This account has been deactivated. Contact an administrator.',
            });
          }
        }
      }
    }),
  },

  user: {
    additionalFields: {
      role: {
        type: ['family', 'advocate', 'admin'],
        defaultValue: 'family',
        input: false,
      },
      familyId: {
        type: 'string',
      },

      // Attach phone number
      phone: {
        type: 'string',
      },

      isActive: {
        type: 'boolean',
        defaultValue: true,
        input: false,
      },
    },
  },

  databaseHooks: {
    session: {
      create: {
        before: async (session) => {
          const user = await prisma.user.findUnique({
            where: { id: session.userId },
          });
          if (user && !user.isActive) {
            throw new APIError("FORBIDDEN", {
              message: 'This account has been deactivated. Contact an administrator.',
            });
          }
          return { data: session };
        },
      },
    },
  },

  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        // Clean send function - error check is handled by middleware above
        sendLogin(email, otp);
      },
      disableSignUp: true,
    }),
  ],
});
