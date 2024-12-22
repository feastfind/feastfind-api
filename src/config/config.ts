export const CONFIG = {
  TOKEN_SECRET: Bun.env.TOKEN_SECRET || 'so_random_you_wont_be_able_to_guess_it123',
};

export const API_TAGS = {
  AUTH: ['Auth'],
  USER: ['User'],
  CITY: ['City'],
  PLACE: ['Place'],
  MENU_ITEM: ['MenuItem'],
  MENU_ITEM_REVIEW: ['MenuItemReview'],
}