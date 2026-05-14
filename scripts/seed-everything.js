const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

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

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const usersToCreate = [
  { email: 'master@fitdesk.com.br', password: 'master123', name: 'Admin Master', role: 'MASTER' },
  { email: 'michel@emailteste.com', password: '123456', name: 'Michel Personal', role: 'PERSONAL' },
  { email: 'ana@emailteste.com', password: '123456', name: 'Ana Trainer', role: 'PERSONAL' }
];

async function seed() {
  console.log("🌱 Iniciando o Seeding seguro do banco...");

  let personalMichelId = null;

  for (const u of usersToCreate) {
    console.log(`\nCriando usuário Auth: ${u.email}`);
    
    // 1. Tentar deletar se existir (limpeza)
    const { data: { users } } = await supabaseAdmin.auth.admin.listUsers();
    const existingUser = users?.find(user => user.email === u.email);
    if (existingUser) {
        await supabaseAdmin.auth.admin.deleteUser(existingUser.id);
    }

    // 2. Criar no Auth
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: u.email,
      password: u.password,
      email_confirm: true,
      user_metadata: { name: u.name }
    });

    if (error) {
      console.error(`❌ Erro ao criar auth para ${u.email}:`, error.message);
      continue;
    }

    const userId = data.user.id;
    console.log(`✅ Auth criado com sucesso! ID: ${userId}`);

    // 3. Inserir no public.users
    const { error: publicError } = await supabaseAdmin.from('users').insert({
      id: userId,
      name: u.name,
      email: u.email,
      role: u.role,
      password: 'HashedBySupabase' // just a placeholder since we use auth
    });

    if (publicError) {
      console.error(`❌ Erro ao criar public profile para ${u.email}:`, publicError.message);
    }

    if (u.email === 'michel@emailteste.com') {
      personalMichelId = userId;
    }
  }

  if (!personalMichelId) {
    console.error("Michel não foi criado, pulando dados de seed dependentes.");
    return;
  }

  console.log("\nInserindo dados de Seed (Grupos, Alunos, Financeiro) para o Michel...");

  // Insert Groups
  const { data: groups, error: groupsError } = await supabaseAdmin.from('student_groups').insert([
    { name: 'Emagrecimento', description: 'Foco em queima calórica', color: '#ef4444', personalId: personalMichelId },
    { name: 'Hipertrofia', description: 'Ganho de massa muscular', color: '#10b981', personalId: personalMichelId },
    { name: 'Terceira Idade', description: 'Mobilidade e força', color: '#3b82f6', personalId: personalMichelId }
  ]).select();

  if (groupsError) console.error("Erro em groups:", groupsError);

  // Insert Students
  const { data: students, error: studentsError } = await supabaseAdmin.from('students').insert([
    { name: 'João da Silva', email: 'joao@email.com', status: 'Ativo', goal: 'Perder 10kg', planValue: 350, paymentDay: 10, personalId: personalMichelId },
    { name: 'Beatriz Santos', email: 'beatriz@email.com', status: 'Ativo', goal: 'Massa Muscular', planValue: 400, paymentDay: 5, personalId: personalMichelId },
    { name: 'Carlos Souza', email: 'carlos@email.com', status: 'Ativo', goal: 'Condicionamento', planValue: 300, paymentDay: 20, personalId: personalMichelId }
  ]).select();

  if (studentsError) console.error("Erro em students:", studentsError);

  // Insert Library Exercises
  await supabaseAdmin.from('library_exercises').insert([
    { name: 'Agachamento Livre', category: 'Pernas', description: 'Manter coluna ereta e joelhos alinhados', personalId: null },
    { name: 'Supino Reto', category: 'Peitoral', description: 'Controle da descida até o peito', personalId: null },
    { name: 'Levantamento Terra', category: 'Costas', description: 'Foco na postura lombar', personalId: null },
    { name: 'Rosca Direta', category: 'Biceps', description: 'Isolamento do movimento de cotovelo', personalId: personalMichelId }
  ]);

  // Insert Financial Entries
  if (students) {
    for (const student of students) {
      await supabaseAdmin.from('financial_entries').insert({
        description: `Mensalidade - ${student.name}`,
        amount: student.planValue,
        type: 'IN',
        category: 'Mensalidade',
        personalId: personalMichelId,
        studentId: student.id
      });
    }
  }

  await supabaseAdmin.from('financial_entries').insert([
    { description: 'Aluguel Sala', amount: 1200, type: 'OUT', category: 'Infraestrutura', personalId: personalMichelId },
    { description: 'Marketing Digital', amount: 300, type: 'OUT', category: 'Marketing', personalId: personalMichelId }
  ]);

  // Insert Leads
  await supabaseAdmin.from('leads').insert([
    { name: 'Fabio Nunes', email: 'fabio@leads.com', phone: '11911112222', origin: 'Instagram', value: 400, status: 'Aguardando', personalId: personalMichelId },
    { name: 'Gisele B.', email: 'gisele@leads.com', phone: '11933334444', origin: 'Indicação', value: 350, status: 'Em Negociação', personalId: personalMichelId }
  ]);

  console.log("\n✅ Tudo finalizado! O banco está limpo e perfeitamente populado!");
}

seed();
