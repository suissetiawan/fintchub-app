export type PeriodType = 'calendar' | 'payday'
export interface DateRange {
  startDate: string
  endDate: string
}

/**
 * Returns the YYYY-MM-DD string for a given Date object in local time.
 */
export function toLocalISODate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Calculates the monitoring date range based on the settings and the selected month/year.
 * 
 * @param month The target month (1-12) or string '01'-'12'
 * @param year The target year, e.g. 2026 or '2026'
 * @param periodType 'calendar' or 'payday'
 * @param paydayDate The day of the month for payday (1-28)
 */
export function getMonitoringDateRange(
  month: string | number,
  year: string | number,
  periodType: PeriodType,
  paydayDate: number = 25
): DateRange {
  const y = parseInt(year.toString(), 10)
  // JavaScript Date months are 0-indexed
  const m = parseInt(month.toString(), 10) - 1

  if (periodType === 'calendar') {
    // 1st to last day of the month
    const start = new Date(y, m, 1)
    const end = new Date(y, m + 1, 0) // 0th day of next month is last day of current month
    
    return {
      startDate: toLocalISODate(start),
      endDate: toLocalISODate(end)
    }
  } else {
    // Payday: e.g. if target month is April (m=3), start is March 25 (m=2, d=25)
    // End is April 24 (m=3, d=24)
    const pd = Math.max(1, Math.min(28, paydayDate)) // constrain to 1-28
    
    const start = new Date(y, m - 1, pd)
    const end = new Date(y, m, pd - 1)
    
    return {
      startDate: toLocalISODate(start),
      endDate: toLocalISODate(end)
    }
  }
}
