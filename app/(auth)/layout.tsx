import Link from 'next/dist/client/link';
import React from 'react';
import Image from 'next/image';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex flex-col min-h-screen w-full">
      <div aria-hidden="true" className="fixed inset-0 -z-10 overflow-hidden">
        <Image
          src="https://res.cloudinary.com/di3qccrxy/image/upload/f_auto,q_auto,w_1920/v1777507176/OCR-L-BUCHANAN-0716_tffvj9.webp"
          alt="Background"
          fill
          priority
          className="object-cover blur-md scale-105"
        />
      </div>
      <div className='h-[100dvh] flex flex-col'>
        <header className="px-4 md:px-8 py-6">
          <Link href="/" className="text-xl font-bold text-white tracking-tight md:text-2xl">
            BoothBnB
          </Link>
        </header>
        <main className="flex-col flex items-center justify-center flex-1">
            {children}
        </main>
      </div>
      <footer className="bg-card text-card-foreground text-center py-8 border-t border-border">
        Copyright &copy; {new Date().getFullYear()} BoothBnB
      </footer>
    </div>

  )
}