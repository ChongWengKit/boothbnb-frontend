"use client";
import { useState } from "react";
import Link from "next/link";
import { useUserContext } from "@/app/contexts/UserContext";
import { GiHamburgerMenu } from "react-icons/gi";
import { Button } from "@/components/ui/button"; 

export default function TopBar() {
    const { user, isLoading } = useUserContext();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header>
            <nav
                id="mobile-sidebar"
                className={`fixed inset-y-0 left-0 z-[101] flex w-64 flex-col gap-10  p-8 backdrop-blur-2xl transition-transform duration-300 md:hidden ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
                aria-label="Main navigation"
            >
                <div className="flex justify-between items-center">
                    <Link href="/" className="text-2xl font-bold text-white tracking-tight" onClick={() => setIsOpen(false)}>BoothBnB</Link>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-3xl font-light text-white"
                        aria-label="Close navigation"
                    >
                        &times;
                    </button>
                </div>

                <ul className="flex flex-col gap-6">
                    <li>
                        <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                            <span className="text-lg font-medium text-white transition-colors">Browse Events</span>
                        </Link>
                    </li>
                    {!isLoading && user?.role !== 'VENDOR' && (
                        <li>
                            <Link href="/getstarted" onClick={() => setIsOpen(false)}>
                                <span className="text-lg font-medium text-white transition-colors">Become a vendor</span>
                            </Link>
                        </li>
                    )}

                    <li className="my-2 h-px bg-border" />

                    {isLoading ? null : user ? (
                        <li>
                            <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                                <span className="cursor-pointer text-white transition-colors">
                                    Go to Dashboard
                                </span>
                            </Link>
                        </li>
                    ) : (
                        <>
                            <li>
                                <Link href="/login" onClick={() => setIsOpen(false)}>
                                    <span className="text-lg font-medium text-white transition-colors">Login</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/getstarted" onClick={() => setIsOpen(false)}>
                                    <span className="text-lg font-medium text-white transition-colors">Get Started</span>
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </nav >

            <nav className="relative z-50 flex justify-between items-center px-4 md:px-8 py-6 w-full" aria-label="Primary navigation">
                <div className="flex items-center gap-8">
                    <button
                        className="text-3xl text-white md:hidden cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0"
                        onClick={() => setIsOpen(true)}
                        aria-controls="mobile-sidebar"
                        aria-expanded={isOpen}
                        aria-label="Open main menu"
                    >
                        <GiHamburgerMenu />
                    </button>
                    <Link href="/" className="text-2xl font-bold text-white tracking-tight">BoothBnB</Link>
                    <ul className="hidden md:flex md:items-center md:gap-6">
                        <li>
                            <Link href="/dashboard">
                                <span className="cursor-pointer text-white transition-colors">Browse Events</span>
                            </Link>
                        </li>
                        {!isLoading && user?.role && (
                            <li>
                                <Link href="/getstarted">
                                    <span className="cursor-pointer text-white transition-colors">Become a vendor</span>
                                </Link>
                            </li>
                        )}
                    </ul>
                </div>
                <ul className="hidden md:flex items-center gap-6">
                    {isLoading ? null : user ? (
                        <li>
                            <Link href="/dashboard">
                                <span className="cursor-pointer text-white transition-colors">
                                    Go to Dashboard
                                </span>
                            </Link>
                        </li>
                    ) : (
                        <>
                            <li>
                                <Link href="/login">
                                    <span className="cursor-pointer text-white transition-colors">Login</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/getstarted">
                                    <div className="cursor-pointer rounded-full bg-primary px-4 py-2 font-bold text-primary-foreground transition-colors hover:bg-primary/90">
                                        Get Started
                                    </div>
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </nav >
        </header>
    );
}
