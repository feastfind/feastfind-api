export function getDiceBearAvatar(username: string, size: number): string {
  const DICEBEAR_AVATAR_URL = `https://api.dicebear.com/9.x/adventurer-neutral/svg`;
  return `${DICEBEAR_AVATAR_URL}?seed=${username}&size=${size}`;
}
