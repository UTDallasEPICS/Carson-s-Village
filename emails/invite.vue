<script setup lang="ts">
import { 
  Html, 
  Head, 
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
  name: String,
  url: String,
})

const logoUrl = `${props.url}/CVLogo.png`
</script>

<template>
  <Html lang="en">
    <Head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>You're Invited!</title>
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
                .button {
                    display: block !important;
                    width: 100% !important;
                    text-align: center !important;
                    box-sizing: border-box !important;
                }
            }
        </Style>
    </Head>

    <Body style="background-color: #f4f4f4; margin: 0; padding: 40px 10px; font-family: Arial, Helvetica, sans-serif;">
        <!-- Container automatically generates Outlook ghost tables to enforce max-width -->
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
                    You've been invited!
                </Heading>
                
                <Text class="mobile-text" style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; color: #555555;">
                    Hi {{ props.name }},<br><br>
                    We are thrilled to invite you to join our platform. Getting started is simple, just click the button below to accept your invitation and set up your account.
                </Text>
                
                <!-- Button automatically generates VML for Outlook border-radius support -->
                <Button 
                    :href="props.url" 
                    class="button" 
                    style="background-color: #5AADC2; color: #ffffff; font-size: 16px; font-weight: bold; text-decoration: none; padding: 14px 28px; border-radius: 4px; display: inline-block;"
                >
                    Accept Invitation
                </Button>
            </Section>

            <!-- Footer Section -->
            <Section class="content-padding" style="padding: 20px; background-color: #fcfcfc; border-top: 2px solid #CD6636; text-align: center;">
                <Text style="margin: 0; color: #888888; font-size: 13px; line-height: 1.5;">
                    If you did not expect this invitation, you can safely ignore this email.
                </Text>
            </Section>

        </Container>
    </Body>
  </Html>
</template>
