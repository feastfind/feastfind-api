import prisma from '@/lib/db';

export const avgMenuItemRating = async (menuItemId: string) => {
  const { _avg } = await prisma.menuItemReview.aggregate({
    where: {
      menuItemId: menuItemId,
    },
    _avg: {
      rating: true,
    },
  });

  if (_avg.rating) {
    const rating = Number(_avg.rating.toFixed(1));
    return rating;
  }
};

export const avgPlaceRating = async (placeId: string) => {
  const { _avg } = await prisma.menuItem.aggregate({
    where: {
      placeId: placeId,
    },
    _avg: {
      ratingScore: true,
    },
  });

  if (_avg.ratingScore) {
    const ratingScore = Number(_avg.ratingScore.toFixed(1));
    return ratingScore;
  }
};
