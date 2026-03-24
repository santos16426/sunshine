"use client";

import { useEffect, useRef, useState } from "react";

import { LogOut } from "lucide-react";
import { useAuthStore } from "@/features/auth";
import { usePublicUser } from "@/features/users";
import { useLayoutStore } from "@/store/layoutStore";
import { Menu, User, Palette } from "lucide-react";
import { useRouter } from "next/navigation";
import ClockHeader from "./Clock";
import GlobalSearch from "./GlobalSearch";
import Link from "next/link";

export default function Header() {
  const router = useRouter();
  const { isSidebarOpen, setIsSidebarOpen } = useLayoutStore();
  const { user, logout } = useAuthStore();
  const { profile } = usePublicUser();
  const role = profile?.role;
  const displayName =
    profile?.full_name?.trim() ||
    (user?.user_metadata?.first_name && user?.user_metadata?.last_name
      ? `${user.user_metadata.first_name} ${user.user_metadata.last_name}`
      : null) ||
    user?.email;
  const initial =
    (displayName?.trim()?.[0] || "U").toUpperCase();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showProfileMenu) return;
    function handleClickOutside(event: MouseEvent) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showProfileMenu]);
  const handleLogout = () => {
    logout();
    router.push("/login");
  };
  return (
    <header className="h-16 flex items-center px-6 gap-4 border-b border-border shrink-0 bg-card z-100 relative">
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="p-2 hover:bg-muted rounded-full transition-colors"
      >
        <Menu className="w-6 h-6 text-muted-foreground" />
      </button>

      <div className="flex items-center gap-3 flex-1 text-left relative justify-center">
        <GlobalSearch />
      </div>
      <div className="flex items-center gap-1 md:gap-2">
        <ClockHeader />
        {/* <button className="p-2 hover:bg-slate-100 rounded-full relative transition-colors">
          <Bell className="w-5 h-5 text-slate-600" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
        </button> */}
        {/* Profile Menu Wrapper */}
        <div className="relative" ref={profileMenuRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary text-primary-foreground text-sm font-bold border-2 border-card shadow-sm ml-1 md:ml-2 overflow-hidden hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
          >
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              initial
            )}
          </button>

          {/* Profile Dropdown Menu */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-3 w-64 bg-card rounded-3xl shadow-2xl border border-border py-3 animate-in fade-in zoom-in-95 duration-200 text-left z-100">
              <div className="px-6 py-4 border-b border-border mb-2">
                <p className="font-bold text-foreground">
                  {displayName ?? "—"}
                </p>
                <p className="text-xs text-muted-foreground capitalize">
                  {role}
                </p>
              </div>
              <Link
                href="/settings?tab=profile"
                onClick={() => setShowProfileMenu(false)}
                className="w-full flex items-center gap-4 px-6 py-3 hover:bg-muted transition-colors text-muted-foreground"
              >
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">My Profile</span>
              </Link>
              <Link
                href="/settings?tab=appearance"
                onClick={() => setShowProfileMenu(false)}
                className="w-full flex items-center gap-4 px-6 py-3 hover:bg-muted transition-colors text-muted-foreground"
              >
                <Palette className="w-4 h-4" />
                <span className="text-sm font-medium">Appearance</span>
              </Link>
              <div className="h-px bg-border my-2 mx-6" />
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  handleLogout();
                }}
                className="w-full flex items-center gap-4 px-6 py-3 hover:bg-destructive/10 transition-colors text-destructive"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-bold">Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
