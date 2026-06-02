import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { emailOTP } from 'better-auth/plugins/email-otp'
import nodemailer from 'nodemailer'
import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2"
const runtime = useRuntimeConfig()

const sesClient = new SESv2Client({ region: "us-east-2" });
const transporter = nodemailer.createTransport({
  SES: { sesClient, SendEmailCommand },
});

async function assertUserCanSignIn(email: string) {
  const user = await prisma.user.findUnique({ where: { email } })
  if (user && !user.isActive) {
    throw new Error('This account has been deactivated. Contact an administrator.')
  }
}

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'sqlite',
  }),
  user: {
    additionalFields: {
      // Define role as an additional field (Don't want to migrate to admin plugin)
      role: {
        type: ['family', 'advocate', 'admin'],
        defaultValue: 'family',
        input: false,
      },

      // Attach familyId
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
          })
          if (user && !user.isActive) {
            throw new Error('This account has been deactivated. Contact an administrator.')
          }
          return { data: session }
        },
      },
    },
  },
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        await assertUserCanSignIn(email)
        await transporter.sendMail({
          from: runtime.EMAIL_SOURCE_ADDRESS,
          to: email,
          subject: 'Your OTP Code',
          html: `<p>Your OTP code is: <strong>${otp}</strong></p>`,
        })
      },
      disableSignUp: true,
    }),
  ],
})
