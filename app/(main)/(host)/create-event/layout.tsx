import DashboardBottombar from '@/components/DashboardBottombar';
import DashboardSidebar from '@/components/DashboardSidebar';
import DashboardTopbar from '@/components/DashboardTopbar';
import RoleGuard from '@/components/ProtectedRoute';

const Navbar = ({ children }: React.PropsWithChildren) => { 
   return (
    <div className="flex flex-col min-h-screen">
      <RoleGuard allowedRoles={['HOST']}>
        <DashboardTopbar />
        <div className="flex flex-1">
          <DashboardSidebar />
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
        <DashboardBottombar />
      </RoleGuard>
    </div>
   )
}
export default Navbar;
