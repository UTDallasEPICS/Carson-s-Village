import type { PageDonation } from '../../types.d.ts'
import { dateFormat } from './index'
import { downloadExcelSheet } from './excel'

function reportFilenameDate(date = new Date()): string {
  const formatted = dateFormat(date.toString(), true).replaceAll('/', '-')
  const [month = '', day = '', year = ''] = formatted.split('-')
  const formatedMonth = parseInt(month) >= 10 ? month : `0${month}`
  const formatedDay = parseInt(day) >= 10 ? day : `0${day}`
  return `${year}-${formatedMonth}-${formatedDay}`
}

function toExcelDate(value: unknown): Date | null {
  if (value === null || value === undefined || value === '') return null
  const date = value instanceof Date ? value : new Date(value as string | number)
  return Number.isNaN(date.getTime()) ? null : date
}

/** Download the family donation report. Amounts are dollars. */
export async function downloadDonationReport(
  donations: readonly PageDonation[] | null | undefined,
): Promise<void> {
  await downloadExcelSheet({
    filename: `donation_report_${reportFilenameDate()}`,
    sheetName: 'Donations',
    columns: [
      { header: 'ID', key: 'id' },
      { header: 'Donor Name', key: 'donorName', width: 15 },
      { header: 'Email', key: 'email', width: 20 },
      { header: 'Amount ($)', key: 'amount', width: 10 },
      { header: 'Date Processed', key: 'dateProcessed', width: 14 },
      { header: 'Comments', key: 'comments', width: 10 },
    ],
    rows: (donations ?? []).map((donation) => ({
      id: donation.id,
      donorName: `${donation.donorFirstName} ${donation.donorLastName}`.trim(),
      email: donation.donorEmail,
      amount: (donation.amount / 100).toFixed(2),
      dateProcessed: toExcelDate(donation.donationProcessed),
      comments: donation.comments,
    })),
  })
}

type FamilyReportPage = {
  donation_goal?: number | string | null
  amount_raised?: number | string | null
  deadline?: string | Date | null
  donation_status?: string | null
  start_date?: string | Date | null
  goal_met_date?: string | Date | null
  page_first_name?: string | null
  page_last_name?: string | null
  /** Advocate full name, copied from User.name. */
  name?: string | null
}

function reportDollars(cents: unknown): string {
  const value = Number(cents)
  if (!Number.isFinite(value)) return '0.00'
  return (value / 100).toFixed(2)
}

/** Download the advocate family report. */
export async function downloadFamilyReport(
  pages: readonly FamilyReportPage[] | null | undefined,
): Promise<void> {
  await downloadExcelSheet({
    filename: `family_report_${reportFilenameDate()}`,
    sheetName: 'Family Reports',
    columns: [
      { header: 'Donation Goal', key: 'donationGoal', width: 15 },
      { header: 'Amount Raised', key: 'amountRaised', width: 15 },
      { header: 'Deadline', key: 'deadline', width: 14 },
      { header: 'Donation Status', key: 'donationStatus', width: 15 },
      { header: 'Start Date', key: 'startDate', width: 14 },
      { header: 'Goal Met Date', key: 'goalMetDate', width: 14 },
      { header: 'Page Name', key: 'pageName', width: 15  },
      { header: 'Advocate Name', key: 'advocateName', width: 15  },
    ],
    rows: (pages ?? []).filter((page) => page != null).map((page) => {
      const goalCents = Number(page.donation_goal) || 0
      return {
        donationGoal: goalCents > 0 ? reportDollars(goalCents) : 'No Goal',
        amountRaised: reportDollars(page.amount_raised),
        deadline: toExcelDate(page.deadline),
        donationStatus: goalCents > 0 ? (page.donation_status ?? '') : 'No Goal',
        startDate: toExcelDate(page.start_date),
        goalMetDate: goalCents > 0 ? toExcelDate(page.goal_met_date) : 'No Goal',
        pageName: `${page.page_first_name ?? ''} ${page.page_last_name ?? ''}`.trim(),
        advocateName: (page.name ?? '').trim(),
      }
    }),
  })
}
