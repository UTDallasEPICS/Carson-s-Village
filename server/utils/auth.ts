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
      }
    }
  },
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        await transporter.sendMail({
          from: runtime.EMAIL_SOURCE_ADDRESS,
          to: email,
          subject: 'Your OTP Code',
          html: `<p>Your OTP code is: <strong>${otp}</strong></p>`,
        })
      },
    }),
  ],
})
