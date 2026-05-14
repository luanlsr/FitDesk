const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const https = require('https');

// Carregar .env
const envContent = fs.readFileSync('.env', 'utf-8');
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length > 0) {
    let value = valueParts.join('=').trim();
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    process.env[key.trim()] = value;
  }
});

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const DATA_URL = "https://raw.githubusercontent.com/joao-gugel/exercicios-bd-ptbr/main/exercises/exercises-ptbr-full-translation.json";
const IMAGE_BASE_URL = "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/";

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

const muscleToCategory = {
  'abdominais': 'Core',
  'peito': 'Peito',
  'dorsais': 'Costas',
  'meio-das-costas': 'Costas',
  'inferior-das-costas': 'Costas',
  'trapezio': 'Costas',
  'quadriceps': 'Pernas',
  'isquiotibiais': 'Pernas',
  'gluteos': 'Pernas',
  'panturrilhas': 'Pernas',
  'adutores': 'Pernas',
  'abdutores': 'Pernas',
  'ombros': 'Ombros',
  'biceps': 'Braços',
  'triceps': 'Braços',
  'antebracos': 'Braços',
  'pescoço': 'Ombros'
};

const categoryMap = {
  'cardio': 'Cardio',
  'alongamento': 'Mobilidade',
  'pliometria': 'Cardio',
  'strongman': 'Costas',
  'potência': 'Costas'
};

async function seed() {
  console.log("🌱 Iniciando o Seeding REAL da Biblioteca de Exercícios...");
  
  try {
    const rawExercises = await fetchJson(DATA_URL);
    console.log(`📥 Recebidos ${rawExercises.length} exercícios do repositório.`);

    // Limpar antigos globais
    const { error: delErr } = await supabaseAdmin.from('library_exercises').delete().is('personalId', null);
    if(delErr) console.log("⚠️ Erro ao limpar:", delErr.message);

    const payload = rawExercises.map(ex => {
      let category = 'Outros';
      
      // Tentar mapear pela categoria original
      if (categoryMap[ex.category]) {
        category = categoryMap[ex.category];
      } else {
        // Tentar mapear pelo músculo principal
        const mainMuscle = ex.primaryMuscles[0];
        if (muscleToCategory[mainMuscle]) {
          category = muscleToCategory[mainMuscle];
        }
      }

      const instructions = Array.isArray(ex.instructions) ? ex.instructions.join(' ') : ex.instructions;

      return {
        name: ex.name,
        category: category,
        description: instructions,
        imageUrl: `${IMAGE_BASE_URL}${ex.id}/0.jpg`,
        videoUrl: `${IMAGE_BASE_URL}${ex.id}/1.jpg`, // Usando a segunda imagem como "vídeo" por enquanto
        personalId: null
      };
    });

    // Dividir em chunks para não estourar o limite do Supabase/PostgREST
    const chunkSize = 100;
    for (let i = 0; i < payload.length; i += chunkSize) {
      const chunk = payload.slice(i, i + chunkSize);
      const { error } = await supabaseAdmin.from('library_exercises').insert(chunk);
      if (error) {
        console.error(`❌ Erro no chunk ${i/chunkSize}:`, error.message);
      } else {
        console.log(`✅ Chunk ${i/chunkSize + 1} inserido (${chunk.length} exercícios).`);
      }
    }

    console.log(`🎉 Sucesso! Biblioteca populada com dados reais.`);
  } catch (err) {
    console.error("💥 Falha crítica no seeding:", err.message);
  }
}

seed();
