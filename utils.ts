// Function that converts each date from the TimeStamp object from the date picker to a human readable format
// The timezone is computed automatically.
export function dateFormat(date: string, justDate = false) {
  if(date === ""){
    return ""
  }
  const dateObj = new Date(date);
  if(justDate) return dateObj.toLocaleDateString()
  return dateObj.toLocaleString();
}

// Function that converts the donation amounts in cents to a string in the form
// $ whole dollars.xx
export function donationFormat(amount = 0){
    const amountInDollars = amount / 100
    if(isNaN(amount)){
       return '$0.00'
    }
    return amountInDollars.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    style: "currency",
    currency: "usd"
  })
}