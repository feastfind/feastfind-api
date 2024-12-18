import { PrismaClient } from '@prisma/client';
import { dataCities } from './data/cities';
import { dataPlaces } from './data/places';
import { dataUsers } from './data/users';

const prisma = new PrismaClient();

async function upsertUsers() {
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
        name: user.name,
        username: user.username,
        email: user.email,
        avatarURL,
      },
    });

    console.log(`New user: ${newUser.email}`);
  }

  console.log('Users seeded successfully \n');
}

async function upsertCities() {
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

async function upsertPlaces() {
  const userIds = dataPlaces.map((place) => place.userId);
  const cityIds = dataPlaces.map((place) => place.cityId);

  const [users, cities] = await Promise.all([
    prisma.user.findMany({
      where: { id: { in: userIds } },
    }),
    prisma.city.findMany({
      where: { id: { in: cityIds } },
    }),
  ]);

  const userMap = new Map(users.map((user) => [user.id, user]));
  const cityMap = new Map(cities.map((city) => [city.id, city]));

  for (const place of dataPlaces) {
    const user = userMap.get(place.userId);
    const city = cityMap.get(place.cityId);

    if (!user) {
      console.error(`User not found: ${place.userId}`);
      continue; 
    }

    if (!city) {
      console.error(`City not found: ${place.cityId}`);
      continue; 
    }

    const newPlace = await prisma.place.upsert({
      where: { slug: place.slug },
      update: place,
      create: place,
    });

    console.log(`New place: ${newPlace.name}`);
  }

  console.log('Places seeded successfully \n');
}

async function main() {
  try {
    await upsertUsers();
    await upsertCities();
    await upsertPlaces();
  } catch (e) {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

main();
