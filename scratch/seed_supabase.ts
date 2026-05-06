import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { startOfDay, addDays, addHours, subDays } from "date-fns";

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Iniciando Seed no Supabase...");

  const password123 = await bcrypt.hash("123456", 10);
  const passwordMaster = await bcrypt.hash("master123", 10);

  // 1. Limpeza de Dados (Ordem inversa das dependências)
  console.log("🧹 Limpando dados antigos...");
  await prisma.appointment.deleteMany();
  await prisma.financialEntry.deleteMany();
  await prisma.workout.deleteMany();
  await prisma.exercise.deleteMany();
  await prisma.libraryExercise.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.student.deleteMany();
  await prisma.user.deleteMany();

  // 2. Criar Usuário MASTER
  console.log("👑 Criando Usuário MASTER...");
  await prisma.user.create({
    data: {
      name: "Administrador Master",
      email: "master@fitdesk.com.br",
      password: passwordMaster,
      role: "MASTER",
    },
  });

  // 3. Criar Usuários PERSONAL
  console.log("🏋️ Criando Usuários PERSONAL...");
  const michel = await prisma.user.create({
    data: {
      name: "Michel Personal",
      email: "michel@emailteste.com",
      password: password123,
      role: "PERSONAL",
    },
  });

  const ana = await prisma.user.create({
    data: {
      name: "Ana Trainer",
      email: "ana@emailteste.com",
      password: password123,
      role: "PERSONAL",
    },
  });

  // 4. Criar Alunos para Michel
  console.log("👥 Criando Alunos...");
  const joao = await prisma.student.create({
    data: {
      name: "João Silva",
      email: "joao@email.com",
      phone: "11999999999",
      planValue: 250,
      paymentDay: 10,
      status: "Ativo",
      userId: michel.id,
    },
  });

  const maria = await prisma.student.create({
    data: {
      name: "Maria Oliveira",
      email: "maria@email.com",
      phone: "11888888888",
      planValue: 300,
      paymentDay: 15,
      status: "Ativo",
      userId: michel.id,
    },
  });

  // 5. Criar Alunos para Ana
  const pedro = await prisma.student.create({
    data: {
      name: "Pedro Santos",
      email: "pedro@email.com",
      phone: "11777777777",
      planValue: 400,
      paymentDay: 5,
      status: "Ativo",
      userId: ana.id,
    },
  });

  // 6. Criar Agendamentos (Hoje e Amanhã)
  console.log("📅 Criando Agenda...");
  const today = startOfDay(new Date());

  await prisma.appointment.createMany({
    data: [
      {
        title: "Treino Personal - João",
        start: addHours(today, 8),
        end: addHours(today, 9),
        userId: michel.id,
        studentId: joao.id,
      },
      {
        title: "Avaliação Maria",
        start: addHours(today, 10),
        end: addHours(today, 11),
        userId: michel.id,
        studentId: maria.id,
      },
      {
        title: "Treino Funcional - Pedro",
        start: addDays(addHours(today, 14), 1),
        end: addDays(addHours(today, 15), 1),
        userId: ana.id,
        studentId: pedro.id,
      },
    ],
  });

  // 7. Criar Dados Financeiros
  console.log("💰 Criando Dados Financeiros...");
  await prisma.financialEntry.createMany({
    data: [
      {
        description: "Mensalidade João",
        amount: 250,
        type: "INCOME",
        category: "Mensalidade",
        date: subDays(new Date(), 2),
        userId: michel.id,
        studentId: joao.id,
      },
      {
        description: "Mensalidade Maria",
        amount: 300,
        type: "INCOME",
        category: "Mensalidade",
        date: subDays(new Date(), 1),
        userId: michel.id,
        studentId: maria.id,
      },
      {
        description: "Aluguel Sala",
        amount: 150,
        type: "EXPENSE",
        category: "Infraestrutura",
        date: new Date(),
        userId: michel.id,
      },
    ],
  });

  console.log("✨ Seed Finalizado com Sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
