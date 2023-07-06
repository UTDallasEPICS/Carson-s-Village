<script lang="ts" setup></script>

<template lang="pug">
.information.bg-gray-300.rounded-md.mx-9.my-2.text-center(class="sm:text-start")
    legend.ml-2(class="sm:py-1" style="font-weight: 700; text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25);") Donation record entry       
.py-4.grid(class="sm:grid-cols-3")
    label.ml-10.pt-1(class="sm:ml-11" style="text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25);") Transaction Recording Date    
    .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
        Datepicker.rounded-md.outline-0.border-box.w-full.p-2(style="border: 1px solid #c4c4c4;" v-model='data_payout.transaction_recording_date')
.py-4.grid(class="sm:grid-cols-3")
    CVLabel Enter Amount to Record 
    .col-md-8.flex.mx-9(class="sm:col-span-2 sm:mr-11")
        span.rounded-l-md.bg-gray-200.text-lg.p-2(style="text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25); border: 1px solid #c4c4c4;") $
        input.outline-0.rounded-r-md.border-box.w-full.p-2(style="border: 1px solid #c4c4c4;" min="0.00" step="0.01" v-model='data_payout.amount_to_record' onblur="(this.type='number')" onfocus="(this.type='number')" required)
.col-md-8.ml-4.pt-4.pr-5.flex
    input#anonymous(type='checkbox' class="sm:ml-1" name='allFunds' value='Bike')
    label.mt-4.ml-4.text-md(for='allFunds' class="sm:mt-0" style="letter-spacing: 0.35px;") Record all of amount left to distribute
.py-4.grid(class="sm:grid-cols-3")
    label.ml-10.pt-1(style="text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25);") Enter transaction id from Stripe
    .col-md-8.mx-9(class="sm:col-span-2 sm:mr-11")
        input.rounded-md.outline-0.border-box.w-full.p-2(style="border: 1px solid #c4c4c4;" v-model='data_payout.transaction_id')
.ml-9.mb-9.py-7.flex.flex-wrap.gap-2
    .col-md-10.py-2
        button.p-3.px-6.pt-2.bg-orange-500(@click="save" style="color: white; font-weight: 700; border-radius: 32px;") Record Transaction
</template>

<style scoped></style>
