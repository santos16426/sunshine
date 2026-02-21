import Sidebar from "@/components/common/Sidebar";
import Header from "@/components/common/Header";
import { AuthSync } from "@/features/auth/components/AuthSync";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen app-bg">
      <AuthSync />
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <Header />
        <main className="flex-1 flex overflow-hidden relative">
          <div className="h-full flex-1 bg-background no-scrollbar overflow-y-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
