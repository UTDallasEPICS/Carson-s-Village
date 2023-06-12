// Function that converts each date from the TimeStamp object from the date picker to a human readable format
// The timezone is computed automatically.
export function dateFormat(date: string) {
    var dateObj = new Date(date);
    return dateObj.toString();
}

// Function that converts the donation amounts in cents to a string in the form
// $ whole dollars.xx
export function donationFormat(amount: number){
    //var amountNumber = parseFloat(amount as unknown as string)
    var amountInCents = amount / 100
    return amountInCents.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    style: "currency",
    currency: "usd"
  })
}