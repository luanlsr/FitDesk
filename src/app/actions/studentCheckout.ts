"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { asaasService } from "@/services/asaasService";
import { auditService } from "@/services/auditService";
import { studentService } from "@/services/studentService";

interface StudentCheckoutPayload {
  personalUsername: string;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  postalCode: string;
  creditCardToken: string;
}

export async function processStudentCheckout(payload: StudentCheckoutPayload) {
  try {
    const { personalUsername, name, email, cpf, phone, postalCode, creditCardToken } = payload;

    // 1. Validar Inputs
    if (!name || name.length < 2) throw new Error("Nome inválido.");
    if (!email || !email.includes("@")) throw new Error("E-mail inválido.");
    if (!cpf || cpf.replace(/\D/g, "").length !== 11) throw new Error("CPF inválido.");
    if (!postalCode || postalCode.replace(/\D/g, "").length !== 8) throw new Error("CEP inválido.");
    if (!creditCardToken) throw new Error("Token do cartão de crédito não fornecido.");

    // 2. Buscar o Personal Trainer pelo username
    const { data: personal, error: pError } = await supabaseAdmin
      .from("users")
      .select("id, name, email, plan, plan_status, sales_plan_value, sales_plan_description")
      .eq("username", personalUsername)
      .single();

    if (pError || !personal) {
      throw new Error("Professor não encontrado ou página de vendas inativa.");
    }

    // 3. Verificar se o plano do professor está ativo
    if (personal.plan_status !== "active") {
      throw new Error("A página de vendas deste professor está temporariamente suspensa.");
    }

    // 4. Verificar limite de alunos ativos do professor (Starter = 10, Pro = 50, Studio = Unlimited)
    const limits: Record<string, number> = { starter: 10, pro: 50, studio: 999999 };
    const limit = limits[personal.plan || "starter"] || 10;
    
    // Contagem de alunos ativos do professor
    const { count, error: countError } = await supabaseAdmin
      .from("students")
      .select("id", { count: "exact", head: true })
      .eq("personalId", personal.id)
      .eq("status", "Ativo");

    if (countError) throw new Error("Erro ao verificar limite de alunos do professor.");

    if ((count || 0) >= limit) {
      throw new Error("Este professor atingiu o limite máximo de alunos ativos para o plano atual. Por favor, entre em contato diretamente com ele.");
    }

    // 5. Integrar com Asaas (Criar cliente Aluno)
    const customer = await asaasService.createCustomer({
      name,
      email,
      cpfCnpj: cpf.replace(/\D/g, ""),
      mobilePhone: phone.replace(/\D/g, ""),
    });

    // 6. Criar Assinatura Recorrente no Asaas (Opção A)
    const planValue = personal.sales_plan_value || 199.90;
    const planDescription = personal.sales_plan_description || "Consultoria Fitness Completa";
    
    const subscription = await asaasService.createSubscriptionWithToken({
      customerId: customer.id,
      value: planValue,
      description: `Assinatura FitDesk - Aluno de ${personal.name} (${planDescription})`,
      creditCardToken,
      creditCardHolderInfo: {
        name,
        email,
        cpfCnpj: cpf.replace(/\D/g, ""),
        postalCode: postalCode.replace(/\D/g, ""),
        phone: phone.replace(/\D/g, ""),
      },
    });

    // 7. Criar a conta de acesso para o Aluno (Supabase Auth com convite por e-mail)
    // Isso gerará o e-mail oficial do Supabase para o aluno criar sua senha
    const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      data: {
        role: "STUDENT",
        name,
      }
    });

    if (inviteError || !inviteData.user) {
      console.error("Erro ao enviar convite por e-mail:", inviteError?.message);
      throw new Error("Assinatura criada com sucesso, mas houve uma falha ao enviar o convite de acesso. Entre em contato com o suporte.");
    }

    const studentUserId = inviteData.user.id;

    // 8. Atualizar/Inserir o perfil do aluno associado na tabela 'users'
    // Como inviteUserByEmail cria um registro na tabela auth.users, atualizamos na nossa tabela public.users
    // (Presumindo que exista uma trigger de sincronização de auth.users para public.users, ou inserimos diretamente se necessário)
    const { error: userInsertError } = await supabaseAdmin
      .from("users")
      .upsert({
        id: studentUserId,
        name,
        email,
        role: "STUDENT",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

    if (userInsertError) {
      console.error("Erro ao sincronizar dados do usuário do aluno:", userInsertError.message);
    }

    // 9. Cadastrar o Aluno na tabela de estudantes vinculando ao Personal Trainer
    const newStudent = await studentService.create(supabaseAdmin, {
      name,
      email,
      phone,
      cpf,
      status: "Ativo",
      goal: "Definido com o Personal",
      planValue,
      paymentDay: new Date().getDate(),
      personalId: personal.id,
      associatedUserId: studentUserId,
      asaas_customer_id: customer.id,
      asaas_subscription_id: subscription.id,
      plan_status: "active",
      plan_name: planDescription,
    });

    // 10. Log de Auditoria LGPD
    await auditService.log(supabaseAdmin, {
      userId: personal.id,
      action: "student.billing_checkout",
      resourceId: newStudent.id,
      resourceType: "students",
      metadata: { 
        studentName: name, 
        planValue, 
        asaasSubscriptionId: subscription.id 
      }
    });

    return { success: true };
  } catch (error: any) {
    console.error("Erro no processamento do checkout do aluno:", error);
    return { success: false, error: error.message || "Erro no processamento do pagamento." };
  }
}
