import Link from 'next/dist/client/link';
import React from 'react';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex flex-col min-h-screen w-full">
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat blur-md scale-105"
        style={{ backgroundImage: 'url(https://res.cloudinary.com/di3qccrxy/image/upload/v1775736549/photo-1497366216548-37526070297c_cvi9gq.avif)' }}
      />
      <header className="px-4 md:px-8 py-6">
        <Link href="/" className="text-xl font-bold text-white tracking-tight md:text-2xl">
          BoothBnB
        </Link>
      </header>
      <main className="p-4 flex items-center justify-center flex-1 m-8">
        <div className="max-w-md">
          {children}
        </div>
      </main>
      <footer className="bg-card text-card-foreground text-center py-8 border-t border-border">
        Copyright &copy; {new Date().getFullYear()} BoothBnB
      </footer>
    </div>

  )
}