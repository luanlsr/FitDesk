import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const exercises: any[] = await prisma.$queryRawUnsafe(`SELECT * FROM LibraryExercise WHERE name = 'Alternate Hammer Curl' LIMIT 1`);
  console.log("Resultado da query bruta:");
  console.log(JSON.stringify(exercises, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
