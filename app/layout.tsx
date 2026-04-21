import type { Metadata } from "next";
import { Inter } from "next/font/google";
import App from "./App";
import SessionProvider from "../components/SessionProvider";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "../components/theme-provider";
import ThemeToggle from "../components/ThemeToggle";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BoothBnb",
  description: "Unlock your own booth space in minutes. Host your event, exhibition, or food & beverage service with ease.",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProvider>
          <ThemeProvider>
          <App>{children}</App>
          <ThemeToggle />
          </ThemeProvider>
        </SessionProvider>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}