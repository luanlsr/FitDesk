import DashboardSidebar from "@/components/DashboardSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex bg-[#0A0A0B] text-[#F5F5F0] overflow-hidden overscroll-none min-h-screen">
      <DashboardSidebar />
      <main className="flex-1 md:h-screen overflow-y-auto bg-[#0A0A0B] pt-16 md:pt-0">
        {children}
      </main>
    </div>
  );
}
