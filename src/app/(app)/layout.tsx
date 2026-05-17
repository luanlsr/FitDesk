import DashboardSidebar from "@/components/DashboardSidebar";
import MobileBottomNav from "@/components/MobileBottomNav";
import { AutoLogout } from "@/components/AutoLogout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex bg-[#0A0A0B] text-[#F5F5F0] min-h-screen">
      <AutoLogout />
      <DashboardSidebar />
      <main className="flex-1 h-screen overflow-y-auto bg-[#0A0A0B] pt-16 md:pt-0 pb-20 md:pb-0 custom-scrollbar">
        {children}
      </main>
      <MobileBottomNav />
    </div>
  );
}
