"use client";
import { useState } from 'react';
import { useUserContext } from '@/app/contexts/UserContext';
import Link from 'next/link';
import { MdSpaceDashboard, MdBookmarks } from "react-icons/md";
import { FaStore, FaRegCalendar } from "react-icons/fa";
import { useSideBarContext } from '@/app/contexts/SideBarContext';
import { setSidebarCookie } from '@/app/contexts/sideBar';
import { MdOutlinePayment } from "react-icons/md";
import { CiSquareQuestion } from "react-icons/ci";
import { MdOutlineEmail } from "react-icons/md";
import { MdPeople } from "react-icons/md";

const DashboardSidebar = () => {
  const { sidebarExpanded, setSidebarExpanded } = useSideBarContext();
  const { user } = useUserContext();

  const toggleSidebar = () => {
    const newState = !sidebarExpanded;
    setSidebarExpanded(newState);
    setSidebarCookie(newState);
  };

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: <MdSpaceDashboard className="w-6 h-6" />, show: true },
    { href: "/host-dashboard", label: "My Booths", icon: <FaStore className="w-6 h-6" />, show: user?.role === 'HOST' },
    { href: "/bookmark", label: "Bookmarks", icon: <MdBookmarks className="w-6 h-6" />, show: user?.role === 'VENDOR' },
    { href: "/payment", label: "Payments", icon: <MdOutlinePayment className="w-6 h-6" />, show: user?.role === 'VENDOR' },
    { href: "/booking", label: "Bookings", icon: <FaRegCalendar className="w-6 h-6" />, show: user?.role === 'VENDOR' },
    { href: "/admin-dashboard", label: "Approvals", icon: <CiSquareQuestion className="w-6 h-6" />, show: user?.role === 'ADMIN' },
    { href: "/email-logs", label: "Email Logs", icon: <MdOutlineEmail className="w-6 h-6" />, show: user?.role === 'ADMIN' },
    { href: "/admin-register", label: "Admin Register", icon: <MdPeople className="w-6 h-6" />, show: user?.role === 'ADMIN' },

  ];

  return (
    <aside className={`hidden flex-col gap-2 border-r border-border bg-card shadow-lg transition-all duration-300 md:flex ${sidebarExpanded ? 'w-[300px]' : 'w-[80px]'}`}>
      <button className="flex justify-end cursor-pointer p-4 text-xl" onClick={toggleSidebar}>
        {sidebarExpanded ? '✕' : '☰'}
      </button>

      <nav className="flex flex-col items-center gap-4 px-2">
        {navLinks.filter(link => link.show).map((link) => (
          <Link key={link.href} href={link.href} className="w-full">
            <button className={`group flex w-full cursor-pointer items-center gap-4 rounded-xl bg-background px-4 py-4 font-medium text-foreground transition-all hover:bg-accent hover:text-accent-foreground ${!sidebarExpanded && 'justify-center'}`}>
              {link.icon}
              {sidebarExpanded && <span>{link.label}</span>}
            </button>
          </Link>
        ))}
      </nav>
    </aside>

  );
}

export default DashboardSidebar;