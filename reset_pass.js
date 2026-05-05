const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function reset() {
  const hp = await bcrypt.hash('master123', 10);
  await prisma.user.update({
    where: { email: 'admin@fitdesk.com.br' },
    data: { password: hp }
  });
  await prisma.user.update({
    where: { email: 'master@fitdesk.com.br' },
    data: { password: hp }
  });
  console.log('Senhas resetadas com sucesso para as duas contas!');
}

reset()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
