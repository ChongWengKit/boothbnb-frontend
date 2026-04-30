import Link from 'next/dist/client/link';
import React from 'react';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex flex-col min-h-screen w-full">
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat blur-md scale-105"
        style={{ backgroundImage: 'url(https://res.cloudinary.com/di3qccrxy/image/upload/v1777507176/OCR-L-BUCHANAN-0716_tffvj9.webp)' }}
      />
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