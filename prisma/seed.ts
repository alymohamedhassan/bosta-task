import { PrismaClient } from "@prisma/client";

console.log("Prisma Seed Data")
const prisma = new PrismaClient();

async function seedAuthors() {
  await prisma.author.upsert({
    where: {name: 'Ahmed Khaled'},
    update: {},
    create: {name: 'Ahmed Khaled'}
  });
  await prisma.author.upsert({
    where: {name: 'Naguib Mahfouz'},
    update: {},
    create: {name: 'Naguib Mahfouz'}
  });
  await prisma.author.upsert({
    where: {name: 'Esaad Younis'},
    update: {},
    create: {name: 'Esaad Younis'}
  });
}

async function seedbooks() {
  const authorOne = await prisma.author.findFirst({
    select: {id: true,},
    where: { name: 'Ahmed Khaled', }
  })
  const authorTwo = await prisma.author.findFirst({
    select: {id: true,},
    where: { name: 'Naguib Mahfouz', }
  })
  const authorThree = await prisma.author.findFirst({
    select: {id: true,},
    where: { name: 'Esaad Younis', }
  })
  await prisma.book.upsert({
    where: {title: 'The Lean Startup'},
    update: {},
    create: {
      title: 'The Lean startup',
      isbn: '123456789',
      authorId: authorOne.id,
      shelfLocation: 'DLO-1234',
      totalQuantity: 1239,
    },
  });
  await prisma.book.upsert({
    where: {title: '48 Laws of power'},
    update: {},
    create: {
      title: '48 Laws of power',
      isbn: '123426789',
      authorId: authorTwo.id,
      shelfLocation: 'DLO-1234',
      totalQuantity: 1539,
    },
  });
  await prisma.book.upsert({
    where: {title: 'David Copperfield'},
    update: {},
    create: {
      title: 'David Copperfield',
      isbn: '123456389',
      authorId: authorThree.id,
      shelfLocation: 'DLO-1234',
      totalQuantity: 1939,
    },
  });
}

async function seedBorrowers() {
  await prisma.borrower.upsert({
    where: {email: 'ahmed@hotmail.com'},
    update: {},
    create: {
      name: 'Ahmed Mohamed',
      email: 'ahmed@hotmail.com',
      passwordHash: '345678',
    }
  })
}

async function main() {
  await seedAuthors();
  await seedbooks();
  await seedBorrowers();
}


main().then(() => console.log("Seed data loaded successfully"))

