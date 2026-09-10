import type { Metadata } from "next";
import { Inter } from "next/font/google";
import App from "./App";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import { getThemeCookie } from "./contexts/theme";
const inter = Inter({
  subsets: ["latin"],
  display: "swap", 
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "BoothBnb",
  description: "Unlock your own booth space in minutes. Host your event, exhibition, or food & beverage service with ease.",
};
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = await getThemeCookie();
  return (

    <html lang="en" className={theme === 'dark' ? 'dark' : undefined} suppressHydrationWarning>
      <body className={inter.className}>
        <App initialTheme={theme === 'dark' ? 'dark' : 'light'}>{children}</App>
        <NextTopLoader 
          color="var(--primary)" 
          showSpinner={false}
        />
        <Toaster position="top-center" />
      </body>
    </html>
  );
}