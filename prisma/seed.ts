import { PrismaClient } from '@prisma/client';
import { dataCities } from './data/cities';
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

  console.log('Cities seeded successfully');
}

async function main() {
  try {
    await upsertUsers();
    await upsertCities();
    // await upsertPlaces();
  } catch (e) {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

main();
