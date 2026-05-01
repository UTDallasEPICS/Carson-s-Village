<script setup lang="ts">
import { authClient } from '~~/app/utils/auth-client';

const step = ref<'request'| 'verify'>('request')
const email = ref('')
const otp = ref('')
const loginError = ref('')
const loading = ref(false)

async function handleRequestOtp() {
  loading.value = true
  try {
    const { data, error } = await authClient.emailOtp.sendVerificationOtp({
      email: email.value,
      type: 'sign-in'
    })
    if (error) {
      loading.value = false
      throw Error('Failed to send OTP');
    }

    step.value = 'verify'
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

async function handleVerifyOtp() {
  loading.value = true
  try {
    loginError.value = '';

    const { data, error } = await authClient.signIn.emailOtp({
      email: email.value,
      otp: otp.value
    })
    if (error) {
      loginError.value = 'Invalid or expired code. Please check and try again.'
      throw Error(loginError.value)
    }

    // Handle onboarding to stripe if necessary after login
    try {
      const redirectUrl = await $fetch('api/stripe/create_account', {
        method: 'GET'
      })

      window.location.href = redirectUrl
    } catch (e: any) {
      console.error("An error occured while onboarding user to stripe:", e)
      await navigateTo("/")
    }
    await navigateTo("/")
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

function resetFlow() {
  step.value = 'request'
  loginError.value = ''
  otp.value = ''
}
</script>

<template lang="pug">
div(class="min-h-screen flex items-center justify-center bg-gray-50 px-4 font-sans")
  div(class="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-sm border border-gray-200")
    div(class="text-center")
      h2(class="text-3xl font-bold tracking-tight text-gray-900") 
        | {{ step === 'request' ? 'Sign in' : 'Enter Code' }}
      p(class="mt-2 text-sm text-gray-600")
        | {{ step === 'request' ? 'We will send a one-time code to your email.' : `Sent to ${email}` }}

    form(
      v-if="step === 'request'" 
      class="mt-8 space-y-6" 
      @submit.prevent="handleRequestOtp"
    )
      div
        label(for="email" class="block text-sm font-medium text-gray-700") Email address
        input(
          v-model="email"
          id="email"
          type="email"
          required
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="you@example.com"
        )
      button(
        type="submit"
        :disabled="loading"
        class="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
      ) {{ loading ? 'Sending...' : 'Send Code' }}

    form(
      v-else 
      class="mt-8 space-y-6" 
      @submit.prevent="handleVerifyOtp"
    )
      div
        label(for="otp" class="block text-sm font-medium text-gray-700") One-Time Code
        input(
          v-model="otp"
          id="otp"
          type="text"
          maxlength="6"
          required
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-center tracking-widest font-mono text-lg"
          placeholder="000000"
        )

      //- Failed Login Text for OTP

      div(
        v-if="loginError"
        class="text-red-600 text-sm font-medium text-center bg-red-50 p-2 rounded border border-red-200"
      ) {{ loginError }}

      div(class="flex flex-col gap-3")
        button(
          type="submit"
          :disabled="loading"
          class="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
        ) {{ loading ? 'Verifying...' : 'Verify & Login' }}
      button(
          type="button"
          class="text-sm text-indigo-600 hover:text-indigo-500"
          @click="resetFlow"
        ) Back to email
</template>
