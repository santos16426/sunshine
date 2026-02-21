"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, X } from "lucide-react";
import { getNavigation, type NavigationItem } from "@/constants/navigations";
import { Logo } from "@/components/common/Logo";
import { useAuthStore } from "@/features/auth";
import { useLayoutStore } from "@/store/layoutStore";
import { useEffect, useState } from "react";

export default function Sidebar() {
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { isSidebarOpen, setIsSidebarOpen } = useLayoutStore();
  const navigation: NavigationItem[] = getNavigation(user);
  const pathname = usePathname();
  const handleLogout = () => {
    logout();
    router.push("/login");
  };
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setIsSidebarOpen]);
  return (
    <>
      <aside
        className={`
            h-full bg-muted shrink-0
            flex flex-col py-6 px-3 gap-1 text-left
            transition-all duration-500 ease-in-out z-90 overflow-hidden
            ${
              isSidebarOpen
                ? "w-full translate-x-0 md:w-72 lg:w-72 text-center md:text-left lg:text-left"
                : "w-0 -translate-x-full -mr-6 opacity-0 pointer-events-none "
            }`}
      >
        <div className="px-4 mb-4">
          <div className="flex items-center gap-4 mb-10 relative">
            <Logo />
            {isMobile && (
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 text-muted-foreground hover:bg-muted rounded-full absolute top-0 right-0"
              >
                <X size={20} />
              </button>
            )}
          </div>

          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
            Main Menu
          </p>
        </div>
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all ${
                isActive
                  ? "bg-card shadow-sm font-bold text-primary"
                  : "hover:bg-secondary text-muted-foreground"
              }`}
            >
              <Icon
                className={`w-5 h-5 ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              />
              <span
                className={`text-sm whitespace-nowrap transition-opacity duration-300 ${
                  isSidebarOpen ? "opacity-100" : "opacity-0"
                }`}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
        <div className="mt-auto px-4 py-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 text-muted-foreground hover:text-destructive transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-bold">Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
