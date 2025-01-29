import prisma from '@/lib/db';

const takeItem = 10;

export const getReviews = async (limit?: string | undefined) => {
  // const skipItem = page ? Number(page) * takeItem - takeItem : 0;
  const skipItem = limit ? Number(limit) * takeItem - takeItem : 0;
  const reviews = await prisma.menuItemReview.findMany({
    include: {
      menuItem: {
        include: { images: { orderBy: { createdAt: 'desc' } }, place: true },
      },
      user: true,
    },
    // skip: skipItem,
    // take: takeItem,
    take: limit ? Number(limit) : 20,
    orderBy: {
      createdAt: 'desc',
    },
  });

  return reviews;
};

const findManyMenuItemReview = async (
  limit: string | undefined,
  order: 'desc' | 'asc'
  // skipItem: number,
) => {
  return await prisma.menuItemReview.findMany({
    include: {
      menuItem: {
        include: { images: { orderBy: { createdAt: 'desc' } }, place: true },
      },
      user: true,
    },
    // skip: skipItem,
    take: limit ? Number(limit) : 20,
    orderBy: {
      rating: order,
    },
  });
};

export const getHighestReviews = async (limit?: string | undefined) => {
  // const skipItem = page ? Number(page) * takeItem - takeItem : 0;

  const reviews = findManyMenuItemReview(limit, 'desc');
  return reviews;
};

export const getLowestReviews = async (limit?: string | undefined) => {
  // const skipItem = page ? Number(page) * takeItem - takeItem : 0;

  const reviews = findManyMenuItemReview(limit, 'asc');
  return reviews;
};
