import type { Workbook, Worksheet } from 'exceljs'

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
  rows: Record<string, ExcelCell | undefined>[]
  /**
   * Column keys totaled on a row under the data.
   * Each total is an Excel SUM formula of the finite numbers in that column.
   * Text, dates, and booleans are ignored, matching Excel SUM.
   * A medium top border separates that row. The first column that is not totaled is labeled Total.
   * Omit this to skip the total row. An empty data set writes 0, because a SUM range would include the header or the total cell.
   */
  sumColumns?: string[]
}

const SHEET_NAME_MAX = 31
const DATE_FORMAT = 'mm/dd/yyyy'
const SUM_LABEL = 'Total'
const WORKBOOK_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'

type ExcelJSModule = typeof import('exceljs')

function excelFilename(filename: string): string {
  const base = filename.trim().split(/[/\\]/).pop() || 'sheet'
  return base.toLowerCase().endsWith('.xlsx') ? base : `${base}.xlsx`
}

function excelSheetName(name: string | undefined): string {
  const cleaned = (name ?? 'Sheet1').replace(/[\\/*?:[\]]/g, ' ').trim() || 'Sheet1'
  return cleaned.slice(0, SHEET_NAME_MAX)
}

function excelCellValue(value: ExcelCell | undefined): string | number | boolean | Date {
  if (value === null || value === undefined) return ''
  return value
}

function finiteColumnSum(rows: ExcelSheet['rows'], key: string): number {
  let total = 0
  for (const row of rows) {
    const value = row[key]
    if (typeof value === 'number' && Number.isFinite(value)) total += value
  }
  return total
}

function uniqueSumKeys(sheet: ExcelSheet): string[] {
  if (sheet.sumColumns === undefined || sheet.sumColumns.length === 0) return []
  const known = new Set(sheet.columns.map((column) => column.key))
  const unique: string[] = []
  const seen = new Set<string>()
  for (const key of sheet.sumColumns) {
    if (!known.has(key)) {
      throw new Error(`downloadExcelSheet sum column "${key}" is not a column key`)
    }
    if (seen.has(key)) continue
    seen.add(key)
    unique.push(key)
  }
  return unique
}

async function loadExcelJS(): Promise<ExcelJSModule> {
  const imported = await import('exceljs') as ExcelJSModule & { default?: ExcelJSModule }
  if (typeof imported.Workbook === 'function') return imported
  if (imported.default !== undefined && typeof imported.default.Workbook === 'function') {
    return imported.default
  }
  throw new Error('downloadExcelSheet could not load ExcelJS')
}

function writeSumRow(
  workbook: Workbook,
  worksheet: Worksheet,
  sheet: ExcelSheet,
  sumKeys: string[],
): void {
  const dataCount = sheet.rows.length
  const totalRow = worksheet.getRow(dataCount + 2)
  const summed = new Set(sumKeys)
  let labelPlaced = false
  let wroteFormula = false

  sheet.columns.forEach((column, index) => {
    const cell = totalRow.getCell(index + 1)
    if (summed.has(column.key)) {
      const result = finiteColumnSum(sheet.rows, column.key)
      if (dataCount === 0) {
        // A SUM range would include the header or this cell.
        cell.value = 0
      } else {
        const letter = worksheet.getColumn(index + 1).letter
        // ExcelJS drops a cached formula result of 0. Excel calculates it on open.
        cell.value = {
          formula: `SUM(${letter}2:${letter}${dataCount + 1})`,
          result,
        }
        wroteFormula = true
      }
    } else if (!labelPlaced) {
      cell.value = SUM_LABEL
      labelPlaced = true
    }
    cell.border = {
      top: { style: 'medium', color: { argb: 'FF000000' } },
    }
  })

  if (wroteFormula) workbook.calcProperties.fullCalcOnLoad = true
}

function buildExcelWorkbook(
  ExcelJS: ExcelJSModule,
  sheet: ExcelSheet,
  sumKeys: string[],
): Workbook {
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet(excelSheetName(sheet.sheetName))
  worksheet.columns = sheet.columns.map((column) => {
    const definition: { header: string, key: string, width?: number } = {
      header: column.header,
      key: column.key,
    }
    if (column.width !== undefined) definition.width = column.width
    return definition
  })

  for (const row of sheet.rows) {
    const excelRow = worksheet.addRow(sheet.columns.map((column) => excelCellValue(row[column.key])))
    sheet.columns.forEach((column, index) => {
      if (row[column.key] instanceof Date) excelRow.getCell(index + 1).numFmt = DATE_FORMAT
    })
  }

  if (sumKeys.length > 0) writeSumRow(workbook, worksheet, sheet, sumKeys)
  return workbook
}

function downloadBuffer(buffer: BlobPart, filename: string): void {
  const blob = new Blob([buffer], { type: WORKBOOK_TYPE })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  globalThis.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

/**
 * Build one `.xlsx` worksheet in the browser and start a download.
 * Call from a click handler or other client-only code. SSR throws.
 */
export async function downloadExcelSheet(sheet: ExcelSheet): Promise<void> {
  if (sheet.columns.length === 0) {
    throw new Error('downloadExcelSheet needs at least one column')
  }
  const sumKeys = uniqueSumKeys(sheet)
  if (import.meta.client === false) {
    throw new Error('downloadExcelSheet only runs in the browser')
  }

  const ExcelJS = await loadExcelJS()
  const workbook = buildExcelWorkbook(ExcelJS, sheet, sumKeys)
  const buffer = await workbook.xlsx.writeBuffer()
  downloadBuffer(buffer, excelFilename(sheet.filename))
}
