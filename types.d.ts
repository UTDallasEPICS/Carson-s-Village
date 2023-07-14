// TODO: import types from prisma, export them with relations added
export type Page = {
    page_name: string,
    cuid: string,
    familyCuid: string,
    day_of_birth: Date | string,
    day_of_passing: Date | string,
    visitation_date: Date | string,
    visitation_location: string,
    visitation_description: string,
    funeral_date: Date | string,
    funeral_description: string,
    funeral_location: string,
    obituary: string,
    deadline: Date | string,
    donation_goal: number | string
    amount_raised: number | string
    amount_distributed: number | string
    profileImageCuid: string
    Images: Image[]
  }
  
export type User = {
    cuid: string
    first_name: string,
    last_name: string,
    user_role: Object,
    email: string,
    middle_name: string,
    phone: string,
    //Pages: Page[]
    //PageDonations: PageDonation[]
    //DonationPayouts: DonationPayout[]  
}

export type PageDonation = {
  cuid: string  
  familyCuid: string  
  pageCuid: string  
  success: boolean 
  transaction_id: string  
  amount: number
  //Page: Page
  //User: User
}


export type donation_payout = {
    cuid: string,
    transaction_id: string,
    familyCuid: string
    amount_to_record: number,
    transaction_recording_date: string
    //page: Page
    //user: User
}

export type Image = {
  cuid: string
  url: string
  pageCuid: string
  //Page: Page
}