<script setup lang="ts">
import { 
  Html, 
  Head, 
  Preview,
  Style, 
  Body, 
  Container, 
  Section, 
  Img, 
  Heading, 
  Text, 
  Button 
} from '@vue-email/components'

const props = defineProps({
  url: String,
  otp: String,
})

const logoUrl = `${props.url}/CVLogo.png`
const loginUrl = `${props.url}/login`

// This text will show in the inbox preview, preventing the OTP code from bleeding into the snippet
const previewText = "Your secure login code for Carson's Village is inside."
</script>

<template>
  <Html lang="en">
    <Head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Login Code</title>
        <Style>
            /* Mobile Responsive Overrides */
            @media screen and (max-width: 600px) {
                .email-container {
                    width: 100% !important;
                    max-width: 100% !important;
                    border-radius: 0 !important;
                }
                .content-padding {
                    padding: 20px 15px !important;
                }
                .mobile-text {
                    font-size: 16px !important;
                    line-height: 1.5 !important;
                }
                .mobile-title {
                    font-size: 22px !important;
                }
                .otp-box {
                    padding: 15px !important;
                    font-size: 28px !important;
                    letter-spacing: 6px !important;
                }
                .button {
                    display: block !important;
                    width: 100% !important;
                    text-align: center !important;
                    box-sizing: border-box !important;
                }
            }
        </Style>
    </Head>

    <!-- The Preview component injects hidden text and spacing hacks to control the inbox preview -->
    <Preview>{{ previewText }}</Preview>

    <Body style="background-color: #f4f4f4; margin: 0; padding: 40px 10px; font-family: Arial, Helvetica, sans-serif;">
        <Container class="email-container" style="background-color: #ffffff; max-width: 600px; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); margin: 0 auto;">
            
            <!-- Top Accent Bar -->
            <Section style="height: 6px; background-color: #92D409;"></Section>
            
            <!-- Logo Section -->
            <Section class="content-padding" style="padding: 40px 20px 20px 20px; text-align: center;">
                <Img 
                    :src="logoUrl" 
                    alt="Company Logo" 
                    width="150" 
                    style="display: block; max-width: 150px; margin: 0 auto;" 
                />
            </Section>

            <!-- Body Section -->
            <Section class="content-padding" style="padding: 20px 40px 40px 40px; text-align: center;">
                <Heading as="h1" class="mobile-title" style="margin: 0 0 20px 0; font-size: 24px; color: #333333; font-weight: bold;">
                    Secure Login Code
                </Heading>
                
                <Text class="mobile-text" style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; color: #555555;">
                    Please use the following One-Time Password (OTP) to complete your secure login. This code is valid for a short time and should not be shared with anyone.
                </Text>
                
                <!-- Big, Easy-to-Copy OTP Code Box -->
                <Section style="margin-bottom: 30px;">
                    <div style="background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 6px; padding: 20px; text-align: center;">
                        <Text class="otp-box" style="margin: 0; font-size: 36px; font-weight: bold; color: #5AADC2; letter-spacing: 8px; font-family: 'Courier New', Courier, monospace;">
                            {{ props.otp }}
                        </Text>
                    </div>
                </Section>
                
                <Text class="mobile-text" style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; color: #555555;">
                    Or click the button below to navigate directly to the login page:
                </Text>
                
                <!-- Navigation Button -->
                <Button 
                    :href="loginUrl" 
                    class="button" 
                    style="background-color: #5AADC2; color: #ffffff; font-size: 16px; font-weight: bold; text-decoration: none; padding: 14px 28px; border-radius: 4px; display: inline-block;"
                >
                    Go to Login
                </Button>
            </Section>

            <!-- Footer Section -->
            <Section class="content-padding" style="padding: 20px; background-color: #fcfcfc; border-top: 2px solid #CD6636; text-align: center;">
                <Text style="margin: 0; color: #888888; font-size: 13px; line-height: 1.5;">
                    If you did not attempt to log in to your account, please safely ignore this email.
                </Text>
            </Section>

        </Container>
    </Body>
  </Html>
</template>
