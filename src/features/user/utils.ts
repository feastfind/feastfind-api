export function isValidUsername(username: string) {
  const isAlphanumeric = /^\w+$/;
  return isAlphanumeric.test(username) && username.length <= 100;
}
