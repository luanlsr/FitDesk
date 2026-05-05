const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.user.findMany()
  .then(users => console.log(JSON.stringify(users, null, 2)))
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
