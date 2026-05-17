const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const crypto = require('crypto');

// 1. Carregar variáveis de ambiente do .env
const envContent = fs.readFileSync('.env', 'utf-8');
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length > 0) {
    let value = valueParts.join('=').trim();
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    process.env[key.trim()] = value;
  }
});

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Erro: Variáveis do Supabase não configuradas no .env.");
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

// Chave e lógica de criptografia (idêntica ao fitdesk)
const SECRET = process.env.ENCRYPTION_KEY || process.env.AUTH_SECRET || "fallback-secret-for-fitdesk-development-only-32-chars";
const ENCRYPTION_KEY = crypto.createHash("sha256").update(SECRET).digest();

function encrypt(text) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag().toString("hex");
  return `${iv.toString("hex")}:${authTag}:${encrypted}`;
}

function encryptJSON(data) {
  return encrypt(JSON.stringify(data));
}

const personalMichelId = 'b336825a-7fdc-4931-b7d5-ed1cf9bd8a08';
const studentEmail = 'alunoteste@email.com';
const studentPassword = 'senha123';
const studentName = 'Lucas Aluno Teste';

async function seedStudent() {
  console.log("🌱 Iniciando o seed para o Aluno do Michel...");

  // 1. Verificar se o Michel existe no public.users
  const { data: michel, error: mError } = await supabaseAdmin
    .from('users')
    .select('id, name')
    .eq('id', personalMichelId)
    .single();

  if (mError || !michel) {
    console.error("❌ Erro: Personal Michel não encontrado no banco. Verifique se rodou o seed geral antes.");
    console.log("Dica: Rodar 'node scripts/seed-everything.js' primeiro!");
    process.exit(1);
  }

  console.log(`✅ Personal Trainer encontrado: ${michel.name}`);

  // 2. Limpar aluno de teste existente se houver
  const { data: { users } } = await supabaseAdmin.auth.admin.listUsers();
  const existingAuthUser = users?.find(u => u.email === studentEmail);
  if (existingAuthUser) {
    console.log(`Limpando usuário de teste existente com e-mail: ${studentEmail}`);
    await supabaseAdmin.auth.admin.deleteUser(existingAuthUser.id);
  }

  // 3. Criar usuário no Auth (Aluno)
  console.log(`Criando usuário no Supabase Auth: ${studentEmail}`);
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: studentEmail,
    password: studentPassword,
    email_confirm: true,
    user_metadata: { name: studentName }
  });

  if (authError || !authData.user) {
    console.error("❌ Erro ao criar Auth para o aluno:", authError?.message);
    process.exit(1);
  }

  const studentUserId = authData.user.id;
  console.log(`✅ Auth do Aluno criado! ID: ${studentUserId}`);

  // 4. Inserir no public.users com role STUDENT
  const { error: userInsertError } = await supabaseAdmin
    .from('users')
    .upsert({
      id: studentUserId,
      name: studentName,
      email: studentEmail,
      role: 'STUDENT',
      password: 'HashedBySupabase',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

  if (userInsertError) {
    console.error("❌ Erro ao inserir public profile do aluno:", userInsertError.message);
    process.exit(1);
  }
  console.log("✅ Perfil público do usuário sincronizado como STUDENT.");

  // 5. Cadastrar na tabela 'students'
  const { data: studentRecord, error: studentInsertError } = await supabaseAdmin
    .from('students')
    .insert({
      name: studentName,
      email: studentEmail,
      phone: '(11) 98888-8888',
      cpf: '123.456.789-00',
      gender: 'Masculino',
      status: 'Ativo',
      goal: 'Hipertrofia e Condicionamento',
      planValue: 250.00,
      paymentDay: 10,
      personalId: personalMichelId,
      associatedUserId: studentUserId,
      plan_status: 'active',
      plan_name: 'Consultoria Premium Recorrente',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
    .select()
    .single();

  if (studentInsertError || !studentRecord) {
    console.error("❌ Erro ao inserir registro do aluno na tabela 'students':", studentInsertError?.message);
    process.exit(1);
  }
  console.log(`✅ Registro de Aluno inserido na tabela 'students'! ID: ${studentRecord.id}`);

  // 6. Inserir Histórico de Avaliações Físicas Criptografadas (Evolução de Peso e BF% para os Gráficos)
  console.log("Gerando histórico de avaliações físicas (Cálculo Pollock) criptografadas para evolução gráfica...");
  const evaluationHistory = [
    {
      monthsAgo: 4,
      weight: 80.5,
      bf: 22.1,
      leanMass: 62.7,
      fatMass: 17.8,
      protocol: "3",
      skinfolds: { chest: 18, abdomen: 25, thigh: 22 }
    },
    {
      monthsAgo: 3,
      weight: 78.2,
      bf: 19.8,
      leanMass: 62.7,
      fatMass: 15.5,
      protocol: "3",
      skinfolds: { chest: 15, abdomen: 21, thigh: 19 }
    },
    {
      monthsAgo: 2,
      weight: 76.5,
      bf: 18.2,
      leanMass: 62.6,
      fatMass: 13.9,
      protocol: "3",
      skinfolds: { chest: 14, abdomen: 19, thigh: 17 }
    },
    {
      monthsAgo: 1,
      weight: 74.0,
      bf: 16.5,
      leanMass: 61.8,
      fatMass: 12.2,
      protocol: "3",
      skinfolds: { chest: 12, abdomen: 17, thigh: 15 }
    },
    {
      monthsAgo: 0,
      weight: 72.5,
      bf: 14.8,
      leanMass: 61.8,
      fatMass: 10.7,
      protocol: "3",
      skinfolds: { chest: 11, abdomen: 14, thigh: 13 }
    }
  ];

  for (const ev of evaluationHistory) {
    const date = new Date();
    date.setMonth(date.getMonth() - ev.monthsAgo);

    const evaluationPayload = {
      protocol: ev.protocol,
      age: 26,
      weight: ev.weight,
      height: 175,
      perimeters: {
        neck: 37, chest: 102, rightBiceps: 36, leftBiceps: 35.5, rightForearm: 29, leftForearm: 28.5,
        waist: 82, abdomen: 84, hip: 96, rightThigh: 56, leftThigh: 55.5, rightCalf: 38, leftCalf: 38
      },
      skinfolds: ev.skinfolds,
      tests: { wells: 32, pushUps: 35, sitUps: 45 },
      postural: { head: "Normal", shoulders: "Simétricos", spine: "Normal", hip: "Alinhado", knees: "Normais", feet: "Normais" },
      results: { bf: ev.bf, fatMass: ev.fatMass, leanMass: ev.leanMass, density: 1.0650 }
    };

    const encryptedData = encryptJSON(evaluationPayload);

    const { error: evalError } = await supabaseAdmin
      .from('evaluations')
      .insert({
        studentId: studentRecord.id,
        personalId: personalMichelId,
        encryptedData,
        createdAt: date.toISOString(),
        updatedAt: date.toISOString()
      });

    if (evalError) {
      console.error(`❌ Erro ao criar avaliação de ${ev.monthsAgo} meses atrás:`, evalError.message);
    }
  }
  console.log("✅ 5 avaliações físicas encriptadas e inseridas com sucesso.");

  // 7. Criar treinos de demonstração para o aluno
  console.log("Criando treinos de demonstração (Treino A - Peito/Tríceps, Treino B - Costas/Bíceps)...");
  
  const { data: workoutA, error: wAError } = await supabaseAdmin
    .from('workouts')
    .insert({
      name: 'Treino A - Peitoral e Tríceps',
      studentId: studentRecord.id,
      personalId: personalMichelId,
      createdAt: new Date().toISOString()
    })
    .select()
    .single();

  const { data: workoutB, error: wBError } = await supabaseAdmin
    .from('workouts')
    .insert({
      name: 'Treino B - Dorsais e Bíceps',
      studentId: studentRecord.id,
      personalId: personalMichelId,
      createdAt: new Date().toISOString()
    })
    .select()
    .single();

  if (wAError || wBError) {
    console.error("❌ Erro ao criar cabeçalho de treinos:", wAError?.message || wBError?.message);
  } else {
    // Buscar exercícios do seed para vincular
    const { data: exercises } = await supabaseAdmin
      .from('library_exercises')
      .select('id, name');

    const agachamento = exercises?.find(e => e.name.includes("Agachamento"));
    const supino = exercises?.find(e => e.name.includes("Supino"));
    const terra = exercises?.find(e => e.name.includes("Terra"));
    const rosca = exercises?.find(e => e.name.includes("Rosca"));

    if (workoutA && supino) {
      await supabaseAdmin.from('workout_items').insert({
        workoutId: workoutA.id,
        exerciseId: supino.id,
        series: 4,
        reps: '12',
        weight: '60kg',
        restTime: '60s',
        notes: 'Focar na cadência de descida de 3 segundos.'
      });
    }

    if (workoutB && rosca) {
      await supabaseAdmin.from('workout_items').insert({
        workoutId: workoutB.id,
        exerciseId: rosca.id,
        series: 3,
        reps: '10',
        weight: '14kg',
        restTime: '45s',
        notes: 'Manter cotovelos fixos ao lado do corpo.'
      });
    }
    console.log("✅ Itens de treino de demonstração inseridos com sucesso.");
  }

  console.log("\n🚀 SEED DE ALUNO CONCLUÍDO COM SUCESSO TOTAL!");
  console.log("==========================================");
  console.log(`📧 E-mail do Aluno: ${studentEmail}`);
  console.log(`🔑 Senha do Aluno: ${studentPassword}`);
  console.log("==========================================");
}

seedStudent();
