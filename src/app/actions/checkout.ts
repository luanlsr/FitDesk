"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { userService } from "@/services/userService";
import { asaasService } from "@/services/asaasService";

// Validação mínima de senha: 8 chars, pelo menos 1 letra e 1 número
function isPasswordStrong(password: string): boolean {
  return password.length >= 8 && /[A-Za-z]/.test(password) && /[0-9]/.test(password);
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidCpf(cpf: string): boolean {
  const digits = cpf.replace(/\D/g, "");
  return digits.length === 11;
}

const VALID_PLANS = ["starter", "pro", "studio"] as const;
type PlanKey = (typeof VALID_PLANS)[number];

export async function processCheckout(formData: FormData) {
  try {
    const plan = formData.get("plan") as string;
    const name = (formData.get("name") as string)?.trim();
    const email = (formData.get("email") as string)?.trim().toLowerCase();
    const password = formData.get("password") as string;
    const cpf = formData.get("cpf") as string;
    const phone = formData.get("phone") as string;
    const postalCode = (formData.get("postalCode") as string)?.replace(/\D/g, "");
    // Token gerado pelo Asaas.js no client-side — NUNCA receber dados de cartão em texto claro
    const creditCardToken = formData.get("creditCardToken") as string;
    const lgpdConsent = formData.get("lgpdConsent") === "true";

    // Validações de input
    if (!name || name.length < 2) throw new Error("Nome inválido.");
    if (!isValidEmail(email)) throw new Error("E-mail inválido.");
    if (!isPasswordStrong(password)) {
      throw new Error("A senha deve ter no mínimo 8 caracteres, incluindo letras e números.");
    }
    if (!isValidCpf(cpf)) throw new Error("CPF inválido.");
    if (!postalCode || postalCode.length !== 8) throw new Error("CEP inválido. Informe os 8 dígitos.");
    if (!creditCardToken) throw new Error("Token de cartão não gerado. Tente novamente.");
    if (!lgpdConsent) throw new Error("É necessário aceitar os Termos de Uso e Política de Privacidade.");

    // Validar plano
    if (!VALID_PLANS.includes(plan as PlanKey)) throw new Error("Plano inválido.");

    const planValues: Record<PlanKey, number> = { starter: 49, pro: 89, studio: 159 };
    const planValue = planValues[plan as PlanKey];

    // Criar cliente no Asaas
    const customer = await asaasService.createCustomer({
      name,
      email,
      cpfCnpj: cpf.replace(/\D/g, ""),
      mobilePhone: phone.replace(/\D/g, ""),
    });

    // Criar assinatura usando token do cartão (não dados em texto claro)
    await asaasService.createSubscriptionWithToken({
      customerId: customer.id,
      value: planValue,
      description: `Assinatura FitDesk - Plano ${plan.toUpperCase()}`,
      creditCardToken,
      creditCardHolderInfo: {
        name,
        email,
        cpfCnpj: cpf.replace(/\D/g, ""),
        postalCode,
        phone: phone.replace(/\D/g, ""),
      },
    });

    // Criar usuário no Supabase apenas após pagamento confirmado
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError || !authData.user) {
      throw new Error("Erro ao criar conta de acesso.");
    }

    await userService.create({
      id: authData.user.id,
      name,
      email,
      role: "PERSONAL",
    });

    if (lgpdConsent) {
      await supabaseAdmin.from('users').update({
        lgpd_consent_at: new Date().toISOString(),
        lgpd_consent_version: 'v1.0'
      }).eq('id', authData.user.id);
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Erro no processamento." };
  }
}

