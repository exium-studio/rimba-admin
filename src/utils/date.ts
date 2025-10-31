export const isDateObject = (date: any): boolean => date instanceof Date;

export const countDay = (
  dateFrom: string | Date,
  dateTo: string | Date
): number => {
  const from = typeof dateFrom === "string" ? new Date(dateFrom) : dateFrom;
  const to = typeof dateTo === "string" ? new Date(dateTo) : dateTo;

  if (isNaN(from.getTime()) || isNaN(to.getTime())) {
    throw new Error("Invalid date input");
  }

  from.setHours(0, 0, 0, 0);
  to.setHours(0, 0, 0, 0);

  const diffTime = Math.abs(to.getTime() - from.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays + 1;
};

export const dateInRange = (
  date: Date | string,
  range: { from: Date | string; to: Date | string },
  includeStartDate?: boolean,
  includeEndDate?: boolean
) => {
  const dateObj = new Date(date);
  const startDate = new Date(range?.from);
  const endDate = new Date(range?.to);

  return (
    (includeStartDate ? dateObj >= startDate : dateObj > startDate) &&
    (includeEndDate ? dateObj <= endDate : dateObj < endDate)
  );
};

export const getCalendarRange = ({
  month,
  year,
}: {
  month: number;
  year: number;
}) => {
  // Use UTC everywhere to avoid local timezone shifts when serializing to ISO.
  const firstOfMonthUTC = new Date(Date.UTC(year, month, 1));

  // Shift weekday so Monday = 0, Sunday = 6 (use UTC weekday).
  const startDay = (firstOfMonthUTC.getUTCDay() + 6) % 7;

  // Calculate first visible date in UTC (6 rows × 7 days = 42 days).
  const firstVisibleUTC = new Date(firstOfMonthUTC);
  firstVisibleUTC.setUTCDate(firstOfMonthUTC.getUTCDate() - startDay);

  // Last visible = firstVisible + 41 days
  const lastVisibleUTC = new Date(firstVisibleUTC);
  lastVisibleUTC.setUTCDate(firstVisibleUTC.getUTCDate() + 41);

  // Return plain ISO date (YYYY-MM-DD)
  const toISODate = (d: Date) => d.toISOString().slice(0, 10);

  return {
    firstVisible: toISODate(firstVisibleUTC),
    lastVisible: toISODate(lastVisibleUTC),
  };
};
