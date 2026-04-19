"use client";
import { useUserContext } from "@/app/contexts/UserContext";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

const DashboardTopbar = () => {
  const { user, logout } = useUserContext();
  const [isOpen, setIsOpen] = useState(false);
  const searchParams = useSearchParams();
  const isMapView = searchParams.get("view") === "map";

  return (
    <header className={`sticky top-0 z-[100] flex w-full items-center justify-between border-b border-border bg-card p-2 shadow-lg ${isMapView ? "hidden md:flex" : "flex"}`}>
      <Link href="/">
        <div className="text-2xl cursor-pointer text-foreground font-extrabold text-center">BoothBnB</div>
      </Link>
      
      <nav className="flex items-center gap-4">
        {user?.role === "HOST" && (
          <div className="hidden md:flex items-center gap-2">
            <Link 
              href="/stripe-connect"
              className={`rounded-lg border px-4 py-2 text-sm font-semibold transition-colors ${user?.is_stripe_connected ? "border-border bg-background text-foreground" : "border-primary bg-primary text-primary-foreground hover:bg-primary/90"}`}
            >
              {user?.is_stripe_connected ? "Stripe Status" : "Connect Stripe"}
            </Link>
          </div>
        )}

        <div
          className="relative flex items-center gap-2 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          {user?.profile_photo ? (
            <Image 
                className="w-12 h-12 rounded-full object-cover" 
                src={user.profile_photo} 
                alt="Profile" 
                width={48} 
                height={48} 
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-muted shrink-0" />
          )}
          <div className="text-foreground font-semibold select-none">{user?.username || "Guest"}</div>

          {isOpen && (
            <ul className="absolute top-full right-0 z-50 mt-2 w-32 rounded-xl border border-border bg-popover py-2 shadow-lg">
              {user ? (
                <li
                  className="cursor-pointer px-4 py-2 text-sm font-medium text-destructive transition-colors hover:bg-muted/10"
                  onClick={() => logout()}
                >
                  Log out
                </li>
              ) : (
                <Link href="/login">
                  <li className="cursor-pointer px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-accent">
                    Log in
                  </li>
                </Link>
              )}
            </ul>
          )}
        </div>
      </nav>
    </header>
  );
};

export default DashboardTopbar;