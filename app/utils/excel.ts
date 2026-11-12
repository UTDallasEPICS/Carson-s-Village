export type ExcelCell = string | number | boolean | Date | null

export type ExcelColumn = {
  /** Column title written in row 1. */
  header: string
  /** Property name read from each row object. */
  key: string
  /** Column width in characters. */
  width?: number
}

export type ExcelSheet = {
  /** Download name. `.xlsx` is added when it is missing. */
  filename: string
  /** Worksheet tab name. Defaults to Sheet1. Max 31 characters. */
  sheetName?: string
  columns: ExcelColumn[]
  rows: Record<ExcelCell | undefined>[]
}

const SHEET_NAME_MAX = 31

function excelFilename(filename: string): string {
  const base = filename.trim().split(/[/\\]/).pop() || 'sheet'
  return base.toLowerCase().endsWith('.xlsx') ? base : `${base}.xlsx`
}

function excelSheetName(name: string | undefined): string {
  const cleaned = (name ?? 'Sheet1').replace(/[\\/*?:[\]]/g, ' ').trim() || 'Sheet1'
  return cleaned.slice(0, SHEET_NAME_MAX)
}

function excelSheetRows(sheet: ExcelSheet): (string | number | boolean | Date)[][] {
  const header = sheet.columns.map((column) => column.header)
  const body = sheet.rows.map((row) =>
    sheet.columns.map((column) => {
      const value = row[column.key]
      if (value === null || value === undefined) return ''
      return value
    }),
  )
  return [header, ...body]
}

/**
 * Build one `.xlsx` worksheet in the browser and start a download.
 * Call from a click handler or other client-only code. SSR throws.
 */
export async function downloadExcelSheet(sheet: ExcelSheet): Promise<void> {
  if (sheet.columns.length === 0) {
    throw new Error('downloadExcelSheet needs at least one column')
  }
  if (import.meta.client === false) {
    throw new Error('downloadExcelSheet only runs in the browser')
  }

  const XLSX = await import('xlsx')
  const worksheet = XLSX.utils.aoa_to_sheet(excelSheetRows(sheet))
  const columnWidths: ({ wch: number } | undefined)[] = []
  sheet.columns.forEach((column, index) => {
    if (column.width === undefined) return
    columnWidths[index] = { wch: column.width }
  })
  if (columnWidths.some((width) => width !== undefined)) {
    worksheet['!cols'] = columnWidths
  }

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, excelSheetName(sheet.sheetName))
  XLSX.writeFile(workbook, excelFilename(sheet.filename))
}
