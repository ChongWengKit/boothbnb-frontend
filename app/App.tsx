import { GoogleOAuthProvider } from '@react-oauth/google';
import { SideBarProvider } from '@/app/contexts/SideBarContext';
import GlobalInterceptor from '@/components/GlobalInterceptor';
import { getSidebarCookie } from '@/app/contexts/sideBar';
import ThemeToggle from '@/components/ThemeToggle';
import { ThemeProvider } from '@/components/theme-provider';
import SessionProvider from '@/components/SessionProvider';
import { headers } from 'next/headers';
import CurrencyProvider from '@/components/CurrencyProvider';
import { getCurrency } from './contexts/currency';
async function App({ children }: { children: React.ReactNode }) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const sidebarExpanded = await getSidebarCookie();
  const headersList = await headers();
  const currency = await getCurrency();
  const countryCode = headersList.get('x-vercel-ip-country');
  return (
    <GoogleOAuthProvider clientId={clientId || ""}>
      <SessionProvider>
        <GlobalInterceptor />

        <CurrencyProvider initialCountryCode={countryCode} initialCurrencyCode={currency}>
          <ThemeProvider>
            <SideBarProvider initialExpanded={sidebarExpanded}>
              {children}
            </SideBarProvider>
            <ThemeToggle />
          </ThemeProvider>
        </CurrencyProvider>
      </SessionProvider>
    </GoogleOAuthProvider >
  );
}

export default App;