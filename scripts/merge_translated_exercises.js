const fs = require('fs');
const path = require('path');

// Paths to the downloaded content
const ptJsonPath = path.join(__dirname, '..', 'scratch', 'pt_exercises.md');
const gifJsonPath = path.join(__dirname, '..', 'scratch', 'gif_exercises.md');

function cleanJson(content) {
  // Remove the "Source: ..." header and "---" separator
  const lines = content.split('\n');
  const startIdx = lines.findIndex(line => line.trim() === '[');
  if (startIdx === -1) return content;
  return lines.slice(startIdx).join('\n');
}

try {
  const ptContent = cleanJson(fs.readFileSync(ptJsonPath, 'utf8'));
  const gifContent = cleanJson(fs.readFileSync(gifJsonPath, 'utf8'));

  const ptExercises = JSON.parse(ptContent);
  const gifExercises = JSON.parse(gifContent);

  console.log(`Loaded ${ptExercises.length} translated exercises.`);
  console.log(`Loaded ${gifExercises.length} GIF exercises.`);

  // Create a map for GIF exercises by name (lowercased)
  const gifMap = {};
  gifExercises.forEach(ex => {
    gifMap[ex.name.toLowerCase()] = ex;
  });

  // Muscle mapping based on PT-BR dataset keys
  const muscleMap = {
    "abdominais": "Core",
    "isquiotibiais": "Pernas",
    "adutores": "Pernas",
    "quadriceps": "Pernas",
    "biceps": "Braços",
    "ombros": "Ombros",
    "peito": "Peito",
    "meio-das-costas": "Costas",
    "panturrilhas": "Pernas",
    "gluteos": "Pernas",
    "inferior-das-costas": "Costas",
    "dorsais": "Costas",
    "triceps": "Braços",
    "trapezio": "Costas",
    "antebracos": "Braços",
    "pescoco": "Mobilidade",
    "abdutores": "Pernas"
  };

  const getMuscleGroup = (muscles, category) => {
    if (category === "cardio") return "Cardio";
    if (category === "alongamento") return "Mobilidade";
    
    if (!muscles || muscles.length === 0) return "Outros";
    const primary = muscles[0].toLowerCase();
    
    return muscleMap[primary] || "Outros";
  };

  const finalExercises = [];

  ptExercises.forEach(ex => {
    // Find matching GIF
    // The Portuguese ID is like "3_4_Sit-Up". 
    // We try to match with the GIF name which is "3/4 sit-up"
    let match = gifMap[ex.id.toLowerCase().replace(/_/g, ' ')];
    
    // If no direct match, try replacing ' ' with '/' in the ID for things like 3/4
    if (!match) {
        const fuzzyName = ex.id.toLowerCase().replace(/_/g, ' ').replace(/(\d) (\d)/g, '$1/$2');
        match = gifMap[fuzzyName];
    }

    const imageUrl = match 
      ? `https://github.com/hasaneyldrm/exercises-dataset/raw/refs/heads/main/${match.gif_url}`
      : `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${ex.id}/0.jpg`;

    finalExercises.push({
      name: ex.name,
      category: getMuscleGroup(ex.primaryMuscles, ex.category),
      videoUrl: "", // We don't have video URLs yet, but we have GIFs in imageUrl
      description: ex.instructions.join('\n'),
      imageUrl: imageUrl,
      userId: null // Global
    });
  });

  console.log(`Merged ${finalExercises.length} exercises.`);

  // Generate seed script
  const seedContent = `// @ts-nocheck
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando seed da biblioteca de exercícios traduzida e com GIFs...");

  // Limpa exercícios MASTER existentes para evitar duplicatas
  await prisma.libraryExercise.deleteMany({
    where: { userId: null }
  });

  const exercises = ${JSON.stringify(finalExercises, null, 2)};

  for (const exercise of exercises) {
    await (prisma.libraryExercise as any).create({
      data: exercise
    });
  }

  console.log(\`Seed concluído! \${exercises.length} exercícios adicionados.\`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
`;

  fs.writeFileSync(path.join(__dirname, '..', 'prisma', 'seed_exercises_v4.ts'), seedContent);
  console.log("Seed v4 generated at prisma/seed_exercises_v4.ts");

} catch (err) {
  console.error("Error merging exercises:", err);
}
