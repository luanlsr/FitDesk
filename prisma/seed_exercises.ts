import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const exercises = [
  // PEITO
  { name: "Supino Reto com Barra", category: "Peito" },
  { name: "Supino Inclinado com Halteres", category: "Peito" },
  { name: "Crucifixo Reto", category: "Peito" },
  { name: "Crossover Polia Alta", category: "Peito" },
  
  // COSTAS
  { name: "Puxada Frontal Aberta", category: "Costas" },
  { name: "Remada Curvada com Barra", category: "Costas" },
  { name: "Remada Unilateral com Halter", category: "Costas" },
  { name: "Pull Down na Polia", category: "Costas" },

  // PERNAS
  { name: "Agachamento Livre", category: "Pernas" },
  { name: "Leg Press 45º", category: "Pernas" },
  { name: "Cadeira Extensora", category: "Pernas" },
  { name: "Mesa Flexora", category: "Pernas" },
  { name: "Panturrilha em pé", category: "Pernas" },

  // OMBROS
  { name: "Desenvolvimento com Halteres", category: "Ombros" },
  { name: "Elevação Lateral", category: "Ombros" },
  { name: "Elevação Frontal", category: "Ombros" },

  // BRAÇOS
  { name: "Rosca Direta com Barra", category: "Braços" },
  { name: "Rosca Martelo", category: "Braços" },
  { name: "Tríceps Corda", category: "Braços" },
  { name: "Tríceps Testa", category: "Braços" },
];

async function main() {
  console.log("Seeding exercises...");
  for (const ex of exercises) {
    await prisma.libraryExercise.upsert({
      where: { id: `seed-${ex.name.toLowerCase().replace(/ /g, "-")}` },
      update: {},
      create: {
        id: `seed-${ex.name.toLowerCase().replace(/ /g, "-")}`,
        name: ex.name,
        category: ex.category,
        userId: null, // Global
      },
    });
  }
  console.log("Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
