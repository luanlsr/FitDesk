import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ ERRO: Faltam variáveis de ambiente (NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY).");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

// URLs dos repositórios open-source
const PTBR_DATASET_URL = 'https://raw.githubusercontent.com/joao-gugel/exercicios-bd-ptbr/main/exercises/exercises-ptbr-full-translation.json';
const GIF_DATASET_URL = 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/data/exercises.json';
const GIF_BASE_URL = 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/';

async function seedLibrary() {
  console.log("📥 Baixando bases de dados de exercícios...");
  
  try {
    const [ptbrRes, gifRes] = await Promise.all([
      fetch(PTBR_DATASET_URL),
      fetch(GIF_DATASET_URL)
    ]);

    if (!ptbrRes.ok || !gifRes.ok) {
      throw new Error("Falha ao baixar os datasets.");
    }

    const ptbrData = await ptbrRes.json();
    const gifData = await gifRes.json();

    console.log(`✅ Bases carregadas! PT-BR: ${ptbrData.length} | GIFs: ${gifData.length}`);

    // Cria um mapa rápido de GIFs normalizando o nome do exercício
    const gifMap = new Map();
    for (const ex of gifData) {
      // Normaliza: remove hífens, underlines, espaços extras e deixa minúsculo
      const normalizedName = ex.name.toLowerCase().replace(/[-_ ]/g, '');
      gifMap.set(normalizedName, ex);
    }

    // Processa os exercícios (Limitado a 250 para otimização ou pode inserir todos)
    // Vamos inserir todos os que conseguirmos casar com GIFs!
    const exercisesToInsert = [];
    let matchCount = 0;

    for (const ptbrEx of ptbrData) {
      const normalizedId = ptbrEx.id.toLowerCase().replace(/[-_ ]/g, '');
      const gifMatch = gifMap.get(normalizedId);

      if (gifMatch) {
        matchCount++;
        exercisesToInsert.push({
          name: ptbrEx.name,
          category: ptbrEx.primaryMuscles[0] || ptbrEx.category, // Categoria principal
          description: ptbrEx.instructions.join('\n\n'), // Instruções em parágrafos
          videoUrl: GIF_BASE_URL + gifMatch.gif_url, // O GIF animado real
          imageUrl: GIF_BASE_URL + gifMatch.image,   // A thumb estática
          personalId: null // Exercício global da plataforma
        });
      }

      // Limita a 200+ para não sobrecarregar o banco na primeira carga
      if (exercisesToInsert.length >= 250) break;
    }

    console.log(`🔄 Encontrados ${matchCount} exercícios perfeitos (PT-BR + GIF). Preparando para inserir no Supabase...`);

    // Limpa a biblioteca antiga (cuidado: cascade)
    console.log("🧹 Limpando biblioteca antiga...");
    const { error: deleteError } = await supabase.from('library_exercises').delete().is('personalId', null);
    if (deleteError) {
      console.warn("⚠️ Aviso ao deletar (Pode ser porque está vazia):", deleteError.message);
    }

    // Insere em lotes de 50 para evitar timeout
    const batchSize = 50;
    for (let i = 0; i < exercisesToInsert.length; i += batchSize) {
      const batch = exercisesToInsert.slice(i, i + batchSize);
      console.log(`🚀 Inserindo lote ${Math.floor(i / batchSize) + 1} de ${Math.ceil(exercisesToInsert.length / batchSize)}...`);
      
      const { error: insertError } = await supabase.from('library_exercises').insert(batch);
      
      if (insertError) {
        console.error("❌ Erro ao inserir lote:", insertError);
        throw insertError;
      }
    }

    console.log("🎉 CONCLUÍDO! Biblioteca FitDesk alimentada com sucesso com exercícios profissionais!");

  } catch (error) {
    console.error("❌ Ocorreu um erro no seed:", error);
  }
}

seedLibrary();
