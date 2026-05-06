import { supabaseAdmin } from "@/lib/supabase";

export const userService = {
  async getByEmail(email: string) {
    const { data, error } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  async getAllPersonals() {
    // Busca personais e faz um "join" com a contagem de alunos
    const { data, error } = await supabaseAdmin
      .from("users")
      .select("*, students(count)")
      .eq("role", "PERSONAL")
      .order("createdAt", { ascending: false });

    if (error) throw error;
    
    // Formata o retorno para bater com o que o frontend espera (_count)
    return data.map(user => ({
      ...user,
      _count: { students: user.students[0]?.count || 0 }
    }));
  },

  async create(userData: any) {
    const { data, error } = await supabaseAdmin
      .from("users")
      .insert(userData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updateData: any) {
    const { data, error } = await supabaseAdmin
      .from("users")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
