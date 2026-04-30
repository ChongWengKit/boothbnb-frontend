import React from 'react';


export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen w-full">
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat blur-md scale-105"
        style={{ backgroundImage: 'url(https://res.cloudinary.com/di3qccrxy/image/upload/v1777507176/OCR-L-BUCHANAN-0716_tffvj9.webp)' }}
      />

      <main className="min-h-screen">
        {children}
      </main>

      <footer className="border-t border-border bg-card py-8 text-center text-card-foreground">
        Copyright &copy; {new Date().getFullYear()} BoothBnB
      </footer>
    </div>
  )
}