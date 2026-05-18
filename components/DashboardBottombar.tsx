"use client";
import { useState, useEffect } from 'react';
import { useUserContext } from '@/app/contexts/UserContext';
import Link from 'next/link';
import { MdSpaceDashboard, MdBookmarks, MdOutlineEmail } from "react-icons/md";
import { FaStore, FaRegCalendar } from "react-icons/fa";
import { SiStripe } from "react-icons/si";
import { MdOutlinePayment } from "react-icons/md";
import { CiSquareQuestion } from 'react-icons/ci';
import { MdPeople } from "react-icons/md";
import { MdCurrencyExchange } from "react-icons/md";

const DashboardBottombar = () => {
    const { user, logout } = useUserContext();

    const navLinks = [
        { href: "/dashboard", label: "Dashboard", icon: <MdSpaceDashboard className="w-6 h-6" />, show: true },
        { href: "/host-dashboard", label: "My Booths", icon: <FaStore className="w-6 h-6" />, show: user?.role === 'HOST' },
        { href: "/bookmark", label: "Bookmarks", icon: <MdBookmarks className="w-6 h-6" />, show: user?.role === 'VENDOR' },
        { href: "/stripe-connect", label: user?.is_stripe_connected ? "Stripe" : "Connect", icon: <SiStripe className="w-6 h-6" />, show: user?.role === 'HOST' },
        { href: "/payment", label: "Payments", icon: <MdOutlinePayment className="w-6 h-6" />, show: user?.role === 'VENDOR' },
        { href: "/booking", label: "Bookings", icon: <FaRegCalendar className="w-6 h-6" />, show: user?.role === 'VENDOR' },
        { href: "/admin-dashboard", label: "Approvals", icon: <CiSquareQuestion className="w-6 h-6" />, show: user?.role === 'ADMIN' },
        { href: "/email-logs", label: "Email Logs", icon: <MdOutlineEmail className="w-6 h-6" />, show: user?.role === 'ADMIN' },
        { href: "/admin-currency", label: "Admin Currency", icon: <MdCurrencyExchange className="w-6 h-6" />, show: user?.role === 'ADMIN' },
        { href: "/admin-register", label: "Admin Register", icon: <MdPeople className="w-6 h-6" />, show: user?.role === 'ADMIN' },

    ];

    return (
        <>
            <aside className="md:hidden sticky bottom-0 left-0 right-0 z-[100] w-full border-t border-border bg-card py-2">
                <nav className="grid grid-flow-col auto-cols-fr w-full items-start px-2">
                    {navLinks.filter(link => link.show).map((link) => (
                        <Link key={link.href} href={link.href} className="flex flex-col items-center gap-1 px-0.5 py-1 min-w-0">
                            <div className="text-foreground hover:text-primary">
                                {link.icon}
                            </div>
                            <span className="text-[9px] leading-tight font-medium text-foreground text-center break-words line-clamp-2 w-full">{link.label}</span>
                        </Link>
                    ))}
                </nav>
            </aside>

        </>
    );
}

export default DashboardBottombar;
