"use server";

import { auth } from "@/auth";
import { userService } from "@/services/userService";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function getTenants() {
  const session = await auth();
  if (session?.user?.role !== "MASTER") return [];

  try {
    return await userService.getAllPersonals();
  } catch (error) {
    console.error("Error fetching tenants:", error);
    return [];
  }
}

export async function createTenant(formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "MASTER") return { success: false, error: "Não autorizado" };

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const existingUser = await userService.getByEmail(email);

    if (existingUser) {
      return { success: false, error: "Este e-mail já está cadastrado." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await userService.create({
      name,
      email,
      password: hashedPassword,
      role: "PERSONAL",
    });

    revalidatePath("/dashboard/tenants");
    return { success: true };
  } catch (error) {
    console.error("Error creating tenant:", error);
    return { success: false, error: "Falha ao criar profissional" };
  }
}
