import prisma from '@/lib/db';

export const getReviews = async () => {
  const reviews = await prisma.menuItemReview.findMany({
    include: {
      menuItem: true,
      user: true,
    },
  });

  return reviews;
};
