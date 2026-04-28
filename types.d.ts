import { PrismaClient,  } from "~~/prisma/generated/client";

declare module 'h3' {
  interface H3EventContext {
    user?: Partial<User> & { Family: Partial<Family>}; 
    claims?: {
      email: string
    }
  }
}

// TODO: import types from prisma, export them with relations added
export type Page = {
    page_first_name: string,
    page_last_name: string,
    cuid: string,
    userCuid: string,
    day_of_birth: Date | string | null,
    day_of_passing: Date | string | null,
    visitation_date: Date | string | null,
    visitation_location: string,
    visitation_address: string,
    visitation_description: string,
    funeral_date: Date | string | null,
    funeral_description: string,
    funeral_location: string,
    funeral_address: string,
    obituary: string,
    deadline: Date | string | null,
    donation_goal: number | string
    donation_description: string,
    amount_raised: number | string
    amount_distributed: number | string
    profileImageCuid: string
    Images: Image[],
    Family: Family,
    familyCuid: string,
    status: string,
    donation_status: string,
    duration: string, 
    start_date: Date | string | null
    goal_met_date: Date | string | null
    PageDonations: PageDonation[]
    last_donation_date: Date | string | null
    Reply: Reply[]
  }

export type Family = {
  cuid: string;
  family_name: string;
  stripe_account_id: string | null;
  created_at: Date | string | null;
  updated_at: Date | string | null;
  advocateCuid: string;
  Pages: Page[];
  FamilyMembers: User[];
  AdvocateResponsible: User;
  FamilyDonations: PageDonation[];
}

export type User = {
  id: string,
  name: string
  email: string,
  emailVerified: boolean,
  image?: string,
  createdAt: Date,
  updatedAt: Date,
  role: 'admin' | 'advocate' | 'family',
  address: string,
  phone: string,
  Pages: Page[],
  familyId: string,
  AdvocateFamily: User[]     
}

export type PageDonation = {
  id: string,
  familyCuid: string,
  pageCuid: string,
  donorFirstName: string,
  donorLastName: string,
  donorEmail: string,
  comments: string,
  donationInitiated: Date,
  donationProcessed: Date,
  amount: int
}

export type Image = {
  id: string
  url: string
  pageCuid: string
  //Page: Page
}

export type Reply = {
  id: string,
  pageCuid: string
  familyCuid: string
  name: string
  reply: string
  date: Date | string | null | undefined
  suspended: boolean
}
