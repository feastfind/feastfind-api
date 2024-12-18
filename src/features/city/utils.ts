export function isValidCitySlug(slug: string) {
  const isValidSlug = /^[\w-]+$/
  return isValidSlug.test(slug) && slug.length <= 255;
}