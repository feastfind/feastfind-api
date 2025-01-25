export const SECRET = {
  TOKEN_SECRET:
    Bun.env.TOKEN_SECRET || 'so_random_you_wont_be_able_to_guess_it123',
  UPLOADCARE_SECRET:
    Bun.env.UPLOADCARE_SECRET || 'enter_uploadcare_secret_here',
};

export const API_TAGS = {
  AUTH: ['Auth'],
  USER: ['User'],
  CITY: ['City'],
  PLACE: ['Place'],
  USER_PLACE: ['UserPlace'],
  MENU_ITEM: ['Menu Item'],
  MENU_ITEM_REVIEW: ['Menu Item Review'],
  SEARCH: ['Search'],
  REVIEW: ['Review'],
};
