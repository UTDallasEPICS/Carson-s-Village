/*import {
  Family as PFamily,
  User as PUser,
  Page as PPage,
  Image as PImage,
  PageDonation as PPageDonation,
  DonationPayout as PDonationPayout, 
  DonationToPage as PDonationToPage, 
  FamilyToPage as PFamilyToPage,
  UserToFamily as PUserToFamily,
  UserToPage as PUserToPage,
  ImageToPage as PImage
} from '@/prisma/client';
import { DonationPayout } from '@prisma/client';

export type Family = PFamily & {
  Pages?: FamilyToPage;
  FamilyMembers?: UserToFamily[];
  PageDonations?: PageDonation[];
  DonationPayout?: DonationPayout[];
}

export type User = PUser & {
  Pages?: UserToPage;
  PageDonations?: PageDonation[];
  DonationPayout?: DonationPayout[];
};

export type Page = PPage & {
  Pages?: UserToPage;
  PageDonations?: PageDonation[];
  DonationPayout?: DonationPayout[];
};

export type Image = PImage & {
  Pages?: ImageToPage;
};

export type PageDonation = PPageDonation & {
  Pages?: DonationToPage;
}

export type DonationPayout = PDonationPayout & {
  Pages?: PayoutToPage;
};
*/
import { DonationPayout } from "@prisma/client"

// TODO: import types from prisma, export them with relations added
export type Page = {
    page_name: string,
    cuid: string,
    userCuid: string,
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
    Images: Image[],
    Family: Family,
    familyCuid: string,
    status: string,
    donation_status: string,
    duration: string, 
    start_date: string
    goal_met_date: string
    PageDonations: PageDonation[]
    Reply: Reply[]
  }

export type Family = {
  cuid: string;
  family_name: string;
  stripe_account_id: string | null;
  created_at: string;
  updated_at: string;
  advocateCuid: string;
  Pages: Page[];
  FamilyMembers: User[];
  AdvocateResponsible: User;
  FamilyDonations: PageDonation[];
  FamilyDonationPayouts: DonationPayout[];
}

export type User = {
    cuid: string,
    first_name: string,
    last_name: string,
    user_role: string,
    email: string,
    middle_name: string,
    phone: string,
    Pages: Page[],
    familyCuid: String
    //PageDonations: PageDonation[]
    //DonationPayouts: DonationPayout[]  
}

export type PageDonation = {
  cuid: string,  
  userCuid: string,
  familyCuid: String,  
  pageCuid: string,  
  success: boolean, 
  transaction_id: string,  
  amount: number,
  donorFirstName: string,
  donorLastName: string,
  isAnonymous: boolean,
  comments: string,
  Page: Page,
  //User: User
}


export type donation_payout = {
    cuid: string,
    transaction_id: string,
    userCuid: string
    amount_to_record: number,
    transaction_recording_date: string,
    familyCuid: string,
    page: Page
}

export type Image = {
  cuid: string
  url: string
  pageCuid: string
  //Page: Page
}

export type Reply = {
  cuid: string,
  pageCuid: string
  familyCuid: string
  name: string
  reply: string
}
