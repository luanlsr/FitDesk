"use client";

import { motion } from "framer-motion";
import { 
  Building2, 
  UserPlus, 
  Search,
  Filter,
  MoreVertical,
  Mail,
  Users,
  Calendar,
  ShieldCheck
} from "lucide-react";
import { useState, useEffect } from "react";
import { getTenants, createTenant } from "@/app/actions/tenants";

export default function TenantsPage() {
  const [tenants, setTenants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchTenants = async () => {
    setLoading(true);
    const data = await getTenants();
    setTenants(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const result = await createTenant(formData);
    
    if (result.success) {
      setIsModalOpen(false);
      fetchTenants();
    } else {
      alert(result.error);
    }
  };

  const filteredTenants = tenants.filter(t => 
    t.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 space-y-8 animate-fade-up">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-[#F5F5F0]">Gestão de Tenants</h1>
            <div className="bg-[#FF5C00]/10 border border-[#FF5C00]/30 rounded-full px-2 py-0.5 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#FF5C00]" />
              <span className="text-[0.6rem] font-bold text-[#FF5C00] uppercase tracking-wider">ADMIN MASTER</span>
            </div>
          </div>
          <p className="text-[#7A7A85] text-sm">Gerencie os profissionais de educação física cadastrados no FitDesk.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#FF5C00] text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-[0_0_20px_rgba(255,92,0,0.2)] hover:bg-[#FF7A2E] transition-all flex items-center gap-2 group cursor-pointer"
        >
          <UserPlus className="w-4 h-4 group-hover:scale-110 transition-transform" />
          Novo Profissional
        </button>
      </header>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A7A85]" />
          <input 
            type="text" 
            placeholder="Buscar por nome ou e-mail..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#111114] border border-[#222228] rounded-xl pl-12 pr-4 py-3 text-sm text-[#F5F5F0] focus:border-[#FF5C00] transition-colors outline-none"
          />
        </div>
        <button className="bg-[#111114] border border-[#222228] text-sm text-[#7A7A85] px-4 py-3 rounded-xl hover:text-[#F5F5F0] transition-all flex items-center gap-2 cursor-pointer">
          <Filter className="w-4 h-4" /> Filtros
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="h-48 bg-[#111114] border border-[#222228] rounded-2xl animate-pulse" />
          ))
        ) : filteredTenants.length === 0 ? (
          <div className="col-span-full py-20 text-center">
            <Building2 className="w-12 h-12 text-[#222228] mx-auto mb-4" />
            <p className="text-[#7A7A85]">Nenhum profissional encontrado.</p>
          </div>
        ) : filteredTenants.map((tenant, i) => (
          <motion.div
            key={tenant.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-[#111114] border border-[#222228] p-6 rounded-2xl hover:border-[#FF5C00]/20 transition-all group relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-full bg-[#0A0A0B] border border-[#222228] flex items-center justify-center font-bold text-[#F5F5F0] text-lg">
                {tenant.name?.[0]}
              </div>
              <button className="text-[#7A7A85] hover:text-[#F5F5F0] transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
            
            <h3 className="text-[#F5F5F0] font-semibold mb-1">{tenant.name}</h3>
            <div className="flex items-center gap-2 text-[#7A7A85] text-xs mb-4">
              <Mail className="w-3 h-3" /> {tenant.email}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#222228]">
              <div className="space-y-1">
                <div className="text-[0.6rem] text-[#7A7A85] uppercase font-bold tracking-wider">Alunos</div>
                <div className="flex items-center gap-1.5 text-[#F5F5F0] font-mono font-bold">
                  <Users className="w-3.5 h-3.5 text-[#FF5C00]" /> {tenant._count.students}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-[0.6rem] text-[#7A7A85] uppercase font-bold tracking-wider">Desde</div>
                <div className="flex items-center gap-1.5 text-[#7A7A85] text-[0.7rem] font-medium">
                  <Calendar className="w-3.5 h-3.5 text-[#64B5FF]" /> {new Date(tenant.createdAt).toLocaleDateString('pt-BR')}
                </div>
              </div>
            </div>

            <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF5C00]/5 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-[#FF5C00]/10 transition-all"></div>
          </motion.div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-[#111114] border border-[#222228] rounded-3xl p-8 relative z-10 shadow-2xl"
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#64B5FF]/10 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-[#64B5FF]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#F5F5F0]">Novo Profissional</h2>
                <p className="text-xs text-[#7A7A85]">Crie um novo acesso para personal trainer.</p>
              </div>
            </div>

            <form onSubmit={handleCreate} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[0.7rem] uppercase font-bold text-[#7A7A85] ml-1">Nome Completo</label>
                <input 
                  name="name"
                  type="text" 
                  required
                  className="w-full bg-[#0A0A0B] border border-[#222228] rounded-xl px-4 py-3 text-sm text-[#F5F5F0] focus:border-[#FF5C00] outline-none transition-all"
                  placeholder="Ex: João da Silva"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[0.7rem] uppercase font-bold text-[#7A7A85] ml-1">E-mail Profissional</label>
                <input 
                  name="email"
                  type="email" 
                  required
                  className="w-full bg-[#0A0A0B] border border-[#222228] rounded-xl px-4 py-3 text-sm text-[#F5F5F0] focus:border-[#FF5C00] outline-none transition-all"
                  placeholder="personal@fitdesk.com.br"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[0.7rem] uppercase font-bold text-[#7A7A85] ml-1">Senha de Acesso (Inicial)</label>
                <input 
                  name="password"
                  type="text" 
                  required
                  className="w-full bg-[#0A0A0B] border border-[#222228] rounded-xl px-4 py-3 text-sm text-[#F5F5F0] focus:border-[#FF5C00] outline-none transition-all"
                  placeholder="Defina uma senha provisória"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 bg-[#16161A] text-[#7A7A85] rounded-xl font-bold hover:text-[#F5F5F0] transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="flex-[2] py-3 bg-[#FF5C00] text-white rounded-xl font-bold shadow-[0_0_20px_rgba(255,92,0,0.2)] hover:bg-[#FF7A2E] transition-all cursor-pointer"
                >
                  Cadastrar Profissional
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
