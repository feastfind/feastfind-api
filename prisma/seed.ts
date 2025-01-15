import { PrismaClient } from '@prisma/client';
import { dataCities } from './data/cities';
import { dataMenuItems } from './data/menuItems';
import { dataPlaces } from './data/places';
import { dataUsers } from './data/users';
import { dataMenuItemsReview } from './data/menuItemsReview';
import { hashPassword } from '../src/utils/password';
import { avgMenuItemRating, avgPlaceRating } from '@/utils/aggreateRating';

const prisma = new PrismaClient();

async function seedUsers() {
  for (const user of dataUsers) {
    const avatarURL = `https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${user.username}&size=64`;

    const hashedPassword = await hashPassword(user.password);

    const newUser = await prisma.user.upsert({
      where: { username: user.username },
      update: {
        name: user.name,
        email: user.email,
        avatarURL,
        password: { update: { hash: hashedPassword } },
      },
      create: {
        username: user.username,
        name: user.name,
        email: user.email,
        avatarURL,
        password: { create: { hash: hashedPassword } },
      },
    });
  }

  console.log('Users seeded successfully');
}

async function seedCities() {
  for (const city of dataCities) {
    const newCity = await prisma.city.upsert({
      where: { slug: city.slug },
      update: city,
      create: city,
    });
  }

  console.log('Cities seeded successfully');
}

async function seedPlaces() {
  for (const place of dataPlaces) {
    const { citySlug, username, ...placeData } = place;

    const [city, user] = await Promise.all([
      prisma.city.findUnique({ where: { slug: citySlug } }),
      prisma.user.findUnique({ where: { username } }),
    ]);

    if (!city || !user) {
      console.log(`Skipping place ${place.name} - city or user not found`);
      continue;
    }

    const placeUpsertData = {
      ...placeData,
      city: { connect: { id: city.id } },
      user: { connect: { id: user.id } },
    };

    const newPlace = await prisma.place.upsert({
      where: { slug: place.slug },
      update: placeUpsertData,
      create: placeUpsertData,
    });
  }

  console.log('Places seeded successfully');
}

async function seedMenuItems() {
  for (const menuItem of dataMenuItems) {
    const { placeSlug, username, images, ...menuItemData } = menuItem;

    const [place, user] = await Promise.all([
      prisma.place.findUnique({ where: { slug: placeSlug } }),
      prisma.user.findUnique({ where: { username } }),
    ]);

    if (!place || !user) {
      console.log(
        `Skipping menu item ${menuItem.name} - place or user not found`
      );
      continue;
    }

    const menuItemUpsertData = {
      ...menuItemData,
      place: { connect: { id: place.id } },
      user: { connect: { id: user.id } },
      images: {
        connectOrCreate: images.map((image) => ({
          where: { url: image.url },
          create: {
            url: image.url,
          },
        })),
      },
    };

    await prisma.menuItem.upsert({
      where: { slug: menuItem.slug },
      update: menuItemUpsertData,
      create: menuItemUpsertData,
    });
  }

  console.log('Menu Items seeded successfully');
}

async function seedMenuItemsReview() {
  await prisma.menuItemReview.deleteMany();

  for (const menuItemReview of dataMenuItemsReview) {
    const { menuItemSlug, username, ...menuItemReviewData } = menuItemReview;

    const [menuItem, user] = await Promise.all([
      prisma.menuItem.findUnique({ where: { slug: menuItemSlug } }),
      prisma.user.findUnique({ where: { username } }),
    ]);

    if (!menuItem || !user) {
      console.log(
        `Skipping menu Item ${menuItem?.name} - menu Item or user not found`
      );
      continue;
    }

    const menuItemReviewUpsertData = {
      ...menuItemReviewData,
      menuItem: { connect: { id: menuItem.id } },
      user: { connect: { id: user.id } },
    };

    await prisma.menuItemReview.create({
      data: menuItemReviewUpsertData,
    });

    const avgRatingOfMenuItem = await avgMenuItemRating(menuItem.id);

    await prisma.menuItem.update({
      where: {
        id: menuItem.id,
      },
      data: {
        ratingScore: avgRatingOfMenuItem,
      },
    });

    const avgRatingOfPlace = await avgPlaceRating(menuItem.placeId);

    await prisma.place.update({
      where: {
        id: menuItem.placeId,
      },
      data: {
        ratingScore: avgRatingOfPlace,
      },
    });
  }

  console.log('Reviews seeded successfully');
}

async function main() {
  try {
    await seedUsers();
    await seedCities();
    await seedPlaces();
    await seedMenuItems();
    await seedMenuItemsReview();
  } catch (e) {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

main();
