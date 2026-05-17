import { supabaseAdmin } from "@/lib/supabase";
import { notFound } from "next/navigation";
import SalesPageClient from "./SalesPageClient";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  
  const { data: personal } = await supabaseAdmin
    .from("users")
    .select("name, sales_plan_description")
    .eq("username", username)
    .single();

  if (!personal) {
    return {
      title: "Professor não encontrado | FitDesk",
    };
  }

  return {
    title: `Matricule-se com ${personal.name} | FitDesk`,
    description: personal.sales_plan_description || "Entre para a melhor assessoria fitness e mude seus hábitos.",
  };
}

export default async function ProfessorSalesPage({ params }: Props) {
  const { username } = await params;

  // Busca o professor diretamente no banco de dados usando o client admin do Supabase
  const { data: personal, error } = await supabaseAdmin
    .from("users")
    .select("id, name, email, plan, plan_status, sales_plan_value, sales_plan_description")
    .eq("username", username)
    .single();

  // Se professor não existe ou não está ativo, joga 404
  if (error || !personal) {
    notFound();
  }

  if (personal.plan_status !== "active") {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center p-4">
        <div className="bg-[#111114] border border-[#222228] p-8 rounded-[24px] text-center max-w-md w-full">
          <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
            !
          </div>
          <h1 className="text-xl font-bold text-white mb-2">Página de Vendas Suspensa</h1>
          <p className="text-sm text-[#7A7A85]">
            A consultoria de {personal.name} está temporariamente indisponível. Por favor, tente novamente mais tarde.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      <SalesPageClient personal={personal} username={username} />
    </div>
  );
}
