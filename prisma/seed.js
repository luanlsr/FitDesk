require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const password = "master123";
  const hashedPassword = await bcrypt.hash(password, 10);

  // Criar Usuário Master
  const masterEmail = "master@fitdesk.com.br";
  await prisma.user.upsert({
    where: { email: masterEmail },
    update: { role: "MASTER" },
    create: {
      name: "Admin Master",
      email: masterEmail,
      password: hashedPassword,
      role: "MASTER"
    },
  });

  // Criar Usuário Personal Exemplo
  const personalEmail = "admin@fitdesk.com.br";
  await prisma.user.upsert({
    where: { email: personalEmail },
    update: { role: "PERSONAL" },
    create: {
      name: "Personal Master",
      email: personalEmail,
      password: hashedPassword,
      role: "PERSONAL"
    },
  });

  console.log("=========================================");
  console.log("USUÁRIOS DE TESTE ATUALIZADOS");
  console.log("-----------------------------------------");
  console.log("MASTER:");
  console.log("  Email: " + masterEmail);
  console.log("  Pass:  " + password);
  console.log("-----------------------------------------");
  console.log("PERSONAL:");
  console.log("  Email: " + personalEmail);
  console.log("  Pass:  " + password);
  console.log("=========================================");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
