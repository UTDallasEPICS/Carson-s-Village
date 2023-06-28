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
  }
  
export type User = {
    cuid: string
    first_name: string,
    last_name: string,
    user_role: Object,
    email: string,
    middle_name: string,
    phone: string,
}

export type PageDonation = {
  cuid: string  
  familyCuid: string  
  pageCuid: string  
  success: boolean 
  transaction_id: string  
  amount: number 
}

export type Image = {
  cuid: String
  url: String
  pageCuid: String
}
