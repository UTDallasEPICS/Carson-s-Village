const runtime = useRuntimeConfig()
const creds = runtime.CONSTANT_CONTACTS_CLIENTID + ':' + runtime.CONSTANT_CONTACTS_SECRET
const encodedCreds = btoa(creds)
import { PrismaClient } from "@prisma/client";
import type { Page } from "~/types";
const prisma = new PrismaClient()
export default defineTask({
    meta: {
      name: "family_reports:generate_data",
      description: "Generate data for family reports from family pages.",
    },
    async run({ payload, context }) {
      console.log("Running generate data task");
      const familyPages = await prisma.page.findMany({
        where: {
          status: 'active',
          donation_status: 'in progress'
      }
    })

      let donation_status = "in progress";

      await Promise.all(familyPages.map(async (page: any) => {
        if(page?.deadline && new Date().getTime() > (page?.deadline as Date).getTime() && page.donation_status == "in progress") {
          donation_status = "Failed"
        }
        // Calculate duration if needed
        const startDate = new Date(page?.start_date as Date);
        let duration: number | string = Math.round((new Date().getTime() - startDate.getTime()) / (1000 * 3600 * 24)) + " days";
        if(duration == "1 days") {
          duration = "1 day"
        }

        await prisma.page.update({
          where: { 
            cuid: page?.cuid as string
          },
          data: {
            donation_status: donation_status,
            duration: duration + "",
          }
        })
      }))
      console.log("Family reports data generated successfully")
      return { result: "Success" };
    }
  });