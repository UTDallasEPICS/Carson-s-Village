<template lang="pug">
div
    // Static duplicate table for presentation
    h2(style="margin-top: 2.5rem;") Example Family Reports Table for Presentation
    table(style="margin-top: 1.25rem; width: 100%; border-spacing: 0; border-collapse: collapse;")
      thead
        tr
          th(style="padding: 1rem; background-color: #6eabbf; border-radius: 60px 0 0 0; width: 14%; text-align: left;") Page Number
          th(style="padding: 1rem; background-color: #6eabbf; width: 14%;") Donation Duration
          th(style="padding: 1rem; background-color: #6eabbf;") Deadline Passed
          th(style="padding: 1rem; background-color: #6eabbf;") Deadline Pass Date
          th(style="padding: 1rem; background-color: #6eabbf;") Start Date
          th(style="padding: 1rem; background-color: #6eabbf;") Amount Owed
          th(style="padding: 1rem; background-color: #6eabbf;") Amount Paid
          th(style="padding: 1rem; background-color: #6eabbf; border-radius: 0 60px 0 0;") Donation Creator Goal
      tbody
        tr
          td(style="text-align: center;") 1
          td(style="text-align: center;") "1 Year"
          td(style="text-align: center;") "No"
          td(style="text-align: center;") "2023-12-31"
          td(style="text-align: center;") "2023-01-01"
          td(style="text-align: center;") "$1,500.00"
          td(style="text-align: center;") "$1,000.00"
          td(style="text-align: center;") "$2,000.00"
        tr
          td(style="text-align: center;") 2
          td(style="text-align: center;") "6 Months"
          td(style="text-align: center;") "Yes"
          td(style="text-align: center;") "2023-06-01"
          td(style="text-align: center;") "2023-01-01"
          td(style="text-align: center;") "$800.00"
          td(style="text-align: center;") "$600.00"
          td(style="text-align: center;") "$1,400.00"
        tr
          td(style="text-align: center;") 3
          td(style="text-align: center;") "3 Months"
          td(style="text-align: center;") "Yes"
          td(style="text-align: center;") "2023-03-15"
          td(style="text-align: center;") "2023-01-01"
          td(style="text-align: center;") "$300.00"
          td(style="text-align: center;") "$200.00"
          td(style="text-align: center;") "$500.00"
        // Continue adding rows as needed
</template>

<script lang ="ts" setup>
// No script is necessary for the static presentation table
</script>