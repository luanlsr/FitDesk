import { supabaseAdmin } from "@/lib/supabase";
import { notFound } from "next/navigation";
import CadastroAlunoClient from "./CadastroAlunoClient";

interface Props {
  searchParams: Promise<{
    personalId?: string;
    email?: string;
    studentId?: string;
  }>;
}

export default async function CadastroAlunoPage({ searchParams }: Props) {
  const params = await searchParams;
  const { personalId, email, studentId } = params;

  if (!personalId || !email || !studentId) {
    return notFound();
  }

  // 1. Buscar o Personal Trainer para apresentar um cabeçalho personalizado
  const { data: personal } = await supabaseAdmin
    .from("users")
    .select("name")
    .eq("id", personalId)
    .single();

  // 2. Buscar o Aluno para garantir a consistência do nome e e-mail
  const { data: student } = await supabaseAdmin
    .from("students")
    .select("name, email")
    .eq("id", studentId)
    .single();

  if (!student) {
    return notFound();
  }

  return (
    <CadastroAlunoClient
      personalName={personal?.name || "Seu Personal Trainer"}
      personalId={personalId}
      studentId={studentId}
      studentName={student.name}
      studentEmail={student.email}
    />
  );
}
