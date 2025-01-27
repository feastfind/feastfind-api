import prisma from '@/lib/db';

const takeItem = 10;

export const getReviews = async (page?: string | undefined) => {
  const skipItem = page ? Number(page) * takeItem - takeItem : 0;
  const reviews = await prisma.menuItemReview.findMany({
    include: {
      menuItem: {
        include: { images: { orderBy: { createdAt: 'desc' } }, place: true },
      },
      user: true,
    },
    skip: skipItem,
    take: takeItem,
    orderBy: {
      createdAt: 'desc',
    },
  });

  return reviews;
};

const findManyMenuItemReview = async (
  takeItem: number,
  skipItem: number,
  order: 'desc' | 'asc'
) => {
  return await prisma.menuItemReview.findMany({
    include: {
      menuItem: {
        include: { images: { orderBy: { createdAt: 'desc' } }, place: true },
      },
      user: true,
    },
    skip: skipItem,
    take: takeItem,
    orderBy: {
      rating: order,
    },
  });
};

export const getHighestReviews = async (page?: string | undefined) => {
  const skipItem = page ? Number(page) * takeItem - takeItem : 0;

  const reviews = findManyMenuItemReview(takeItem, skipItem, 'desc');
  return reviews;
};

export const getLowestReviews = async (page?: string | undefined) => {
  const skipItem = page ? Number(page) * takeItem - takeItem : 0;

  const reviews = findManyMenuItemReview(takeItem, skipItem, 'asc');
  return reviews;
};
