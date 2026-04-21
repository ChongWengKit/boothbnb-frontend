import React from 'react';
import Image from "next/image";


export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen w-full">
      <div aria-hidden="true"
        className="fixed inset-0 -z-10 overflow-hidden">
        <Image
          src="https://res.cloudinary.com/di3qccrxy/image/upload/v1775736549/photo-1497366216548-37526070297c_cvi9gq.avif"
          alt="Background"
          fill
          priority
          className="object-cover blur-md scale-105"
        />
      </div>

      <main className="min-h-screen">
        {children}
      </main>

      <footer className="border-t border-border bg-card py-8 text-center text-card-foreground">
        Copyright &copy; {new Date().getFullYear()} BoothBnB
      </footer>
    </div>
  )
}