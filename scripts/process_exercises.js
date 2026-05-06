import fs from 'fs';
import path from 'path';

// Path to the JSON file we just viewed/saved
const jsonPath = 'C:\\Users\\luanr\\.gemini\\antigravity\\brain\\a7e3523c-1186-4593-86ec-07cf3c228254\\.system_generated\\steps\\505\\content.md';

function processExercises() {
    const content = fs.readFileSync(jsonPath, 'utf8');
    // The file starts with some metadata lines, we need to find the start of the JSON array
    const jsonStart = content.indexOf('[');
    const exercises = JSON.parse(content.substring(jsonStart));

    const mapping = {
        'abdominals': 'Core',
        'chest': 'Peito',
        'lats': 'Costas',
        'middle back': 'Costas',
        'lower back': 'Costas',
        'traps': 'Costas',
        'quadriceps': 'Pernas',
        'hamstrings': 'Pernas',
        'glutes': 'Pernas',
        'calves': 'Pernas',
        'adductors': 'Pernas',
        'abductors': 'Pernas',
        'shoulders': 'Ombros',
        'biceps': 'Braços',
        'triceps': 'Braços',
        'forearms': 'Braços'
    };

    const categories = ['Peito', 'Costas', 'Pernas', 'Ombros', 'Braços', 'Core', 'Cardio', 'Mobilidade'];
    const result = {};
    categories.forEach(cat => result[cat] = []);

    exercises.forEach(ex => {
        let category = 'Outros';
        
        if (ex.category === 'cardio') {
            category = 'Cardio';
        } else if (ex.category === 'stretching') {
            category = 'Mobilidade';
        } else {
            const muscle = ex.primaryMuscles[0];
            category = mapping[muscle] || 'Outros';
        }

        if (result[category] && result[category].length < 25) { // Get 25 to be safe
            result[category].push({
                name: ex.name,
                category: category,
                description: ex.instructions.join(' '),
                imageUrl: `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/gifs/${ex.id}.gif`
            });
        }
    });

    const finalExercises = [];
    Object.values(result).forEach(arr => finalExercises.push(...arr));

    const seedContent = `
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando seed de exercícios com GIFs...");
  
  // Limpa exercícios globais antigos para não duplicar muito
  await prisma.libraryExercise.deleteMany({ where: { userId: null } });

  const exercises = ${JSON.stringify(finalExercises, null, 2)};

  for (const ex of exercises) {
    await prisma.libraryExercise.create({
      data: {
        name: ex.name,
        category: ex.category,
        description: ex.description,
        imageUrl: ex.imageUrl,
        userId: null,
      },
    });
  }

  console.log(\`\${exercises.length} exercícios com GIFs inseridos com sucesso!\`);
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

    fs.writeFileSync('prisma/seed_exercises_v3.ts', seedContent);
    console.log("Seed v3 gerado com sucesso!");
}

processExercises();
