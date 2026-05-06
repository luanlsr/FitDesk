import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { startOfDay, addDays, addHours } from "date-fns";
import path from "path";
import { fileURLToPath } from "url";

// Configuração de ambiente manual para garantir que o SQLite seja encontrado
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, "../prisma/dev.db");
process.env.DATABASE_URL = `file:${dbPath}`;

const prisma = new PrismaClient();

async function main() {
  const email = "michel@emailteste.com";
  const password = "123456";
  const hashedPassword = await bcrypt.hash(password, 10);

  console.log("Usando banco em:", dbPath);

  // 1. Criar/Atualizar Usuário Michel e Admin
  const adminPassword = await bcrypt.hash("master123", 10);
  await prisma.user.upsert({
    where: { email: "admin@fitdesk.com.br" },
    update: { password: adminPassword },
    create: {
      email: "admin@fitdesk.com.br",
      name: "Admin FitDesk",
      password: adminPassword,
      role: "PERSONAL",
    },
  });

  const user = await prisma.user.upsert({
    where: { email },
    update: { password: hashedPassword },
    create: {
      email,
      name: "Michel",
      password: hashedPassword,
      role: "PERSONAL",
    },
  });

  const userId = user.id;

  // Limpar dados antigos do Michel para evitar duplicatas e horários errados
  await prisma.appointment.deleteMany({ where: { userId } });
  await prisma.student.deleteMany({ where: { userId } });

  // 2. Criar Alunos Mockados
  const studentsData = [
    { name: "João Silva", email: "joao@email.com", phone: "11999999999", planValue: 250, paymentDay: 10, status: "Ativo" },
    { name: "Maria Oliveira", email: "maria@email.com", phone: "11888888888", planValue: 300, paymentDay: 15, status: "Ativo" },
    { name: "Pedro Santos", email: "pedro@email.com", phone: "11777777777", planValue: 200, paymentDay: 5, status: "Atrasado" },
  ];

  const students = [];
  for (const s of studentsData) {
    const student = await prisma.student.create({
      data: {
        ...s,
        userId: userId,
      },
    });
    students.push(student);
  }

  // 3. Criar Agendamentos (Próximos dias em horários redondos)
  const today = startOfDay(new Date());
  const appointmentsData = [
    { 
      title: "Treino Personal - João", 
      start: addDays(addHours(today, 8), 1), // Amanhã às 08:00
      end: addDays(addHours(today, 9), 1), 
      studentId: students[0].id 
    },
    { 
      title: "Avaliação Física - Maria", 
      start: addDays(addHours(today, 10), 2), // Depois de amanhã às 10:00
      end: addDays(addHours(today, 11), 2), 
      studentId: students[1].id 
    },
    { 
      title: "Treino Funcional - Pedro", 
      start: addDays(addHours(today, 14), 1), // Amanhã às 14:00
      end: addDays(addHours(today, 15), 1), 
      studentId: students[2].id 
    },
  ];

  for (const a of appointmentsData) {
    await prisma.appointment.create({
      data: {
        ...a,
        userId: userId,
      },
    });
  }

  // 4. Criar Dados Financeiros (Entradas e Saídas)
  const financialData = [
    { description: "Mensalidade João Silva", amount: 250, type: "IN", category: "Mensalidade", studentId: students[0].id },
    { description: "Mensalidade Maria Oliveira", amount: 300, type: "IN", category: "Mensalidade", studentId: students[1].id },
    { description: "Compra de Halteres", amount: 150, type: "OUT", category: "Equipamento" },
    { description: "Aluguel Sala", amount: 500, type: "OUT", category: "Aluguel" },
    { description: "Suplementos Venda", amount: 120, type: "IN", category: "Suplemento" },
  ];

  for (const f of financialData) {
    await prisma.financialEntry.create({
      data: {
        ...f,
        userId: userId,
      },
    });
  }

  console.log("Usuário Michel e dados mockados criados com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
