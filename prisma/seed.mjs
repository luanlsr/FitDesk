import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
  const email = "admin@fitdesk.com.br";
  const password = "admin123";
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    console.log("Usuário já existe.");
  } else {
    await prisma.user.create({
      data: {
        name: "Personal Master",
        email,
        password: hashedPassword,
      },
    });
    console.log("Usuário de teste criado com sucesso!");
    console.log("Email: " + email);
    console.log("Senha: " + password);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
