// App-wide configuration constants

export const WHATSAPP_GROUP_NAME = 'AI Income Accelerator';

export const WHATSAPP_GROUP_URL =
  (import.meta.env.VITE_WHATSAPP_GROUP_URL as string) ||
  'https://chat.whatsapp.com/KDb21dpkaxQDBNtLcVmPkV?mode=gi_t';

export const CALENDLY_MEETING_URL =
  (import.meta.env.VITE_CALENDLY_URL as string) ||
  'https://calendly.com/career-qnayds/new-meeting';

export const DEFAULT_GOOGLE_SHEET_WEBHOOK_URL =
  'https://script.google.com/macros/s/AKfycbz85Z6wW1ByEmMn64Qavns7wbAhqVeG9NhEKttGfFg16G-xuXHNJAHr9BuOXyiiWt0U/exec';
