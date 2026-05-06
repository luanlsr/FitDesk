import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.libraryExercise.count();
  console.log(`Total de exercícios: ${count}`);

  const sample = await prisma.libraryExercise.findFirst({
    where: { userId: null }
  });

  console.log("Amostra de exercício:");
  console.log(JSON.stringify(sample, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
