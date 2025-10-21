import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Formats a date string to Thai locale with Buddhist Era year when desired
export function formatThaiDate(dateInput, options = { includeTime: false, useBE: true }) {
  if (!dateInput) return "";

  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) return "";

  const locale = 'en-GB';
  const baseOptions = {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  };

  const timeOptions = options.includeTime
    ? { hour: '2-digit', minute: '2-digit' }
    : {};

  let formatted = new Intl.DateTimeFormat(locale, { ...baseOptions, ...timeOptions }).format(date);

  if (options.useBE === false) {
    const ceYear = date.getFullYear();
    formatted = formatted.replace(/(\d{4})(?!.*\d)/, String(ceYear));
  }

  return formatted;
}