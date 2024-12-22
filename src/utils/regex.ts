export function isValidCUID(value: string): boolean {
  return /^[a-z0-9]{25}$/.test(value);
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}