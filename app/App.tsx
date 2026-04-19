import { GoogleOAuthProvider } from '@react-oauth/google';
import { SideBarProvider } from '@/app/contexts/SideBarContext';
import GlobalInterceptor from '@/components/GlobalInterceptor';
import { getSidebarCookie } from '@/app/contexts/sideBar';
async function App({ children }: { children: React.ReactNode }) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const sidebarExpanded = await getSidebarCookie();

  return (
    <GoogleOAuthProvider clientId={clientId || ""}>
        <GlobalInterceptor />
        <SideBarProvider initialExpanded={sidebarExpanded}>
          {children}
        </SideBarProvider>
    </GoogleOAuthProvider>
  );
}

export default App;