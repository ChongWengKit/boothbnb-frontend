import DashboardBottombar from '@/components/DashboardBottombar';
import DashboardSidebar from '@/components/DashboardSidebar';
import DashboardTopbar from '@/components/DashboardTopbar';
import RoleGuard from '@/components/ProtectedRoute';

const Navbar = ({ children }: React.PropsWithChildren) => { 
   return (
    <div>
      <RoleGuard allowedRoles={['HOST']}>
        <DashboardTopbar />
        <div className="flex min-h-screen">
          <DashboardSidebar />
          <main className="flex-1 min-w-0">
            <div className="mx-auto h-full w-full max-w-screen-2xl">
              {children}
            </div>
          </main>
        </div>
        <DashboardBottombar />
      </RoleGuard>
    </div>
  );
}
export default Navbar;
