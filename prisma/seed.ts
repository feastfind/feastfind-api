import { PrismaClient } from '@prisma/client';
import { dataCities } from './data/cities';
import { dataUsers } from './data/users';
import { dataPlaces } from './data/places'; // Added import for dataPlaces

const prisma = new PrismaClient();

async function seedUsers() {
  for (const user of dataUsers) {
    const avatarURL = `https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${user.username}&size=64`;

    const newUser = await prisma.user.upsert({
      where: { username: user.username },
      update: {
        name: user.name,
        email: user.email,
        avatarURL,
      },
      create: {
        username: user.username,
        name: user.name,
        email: user.email,
        avatarURL,
      },
    });

    console.log(`New user: ${newUser.email}`);
  }

  console.log('Users seeded successfully \n');
}

async function seedCities() {
  for (const city of dataCities) {
    const newCity = await prisma.city.upsert({
      where: { slug: city.slug },
      update: city,
      create: city,
    });

    console.log(`New city: ${newCity.name}`);
  }

  console.log('Cities seeded successfully \n');
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

    console.log(`New place: ${newPlace.name} in ${city.name}`);
  }

  console.log('Places seeded successfully');
}

async function main() {
  try {
    await seedUsers();
    await seedCities();
    await seedPlaces(); // Added call to seedPlaces
  } catch (e) {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

main();
