import DashboardBottombar from '@/components/DashboardBottombar';
import DashboardSidebar from '@/components/DashboardSidebar';
import DashboardTopbar from '@/components/DashboardTopbar';
import RoleGuard from '@/components/ProtectedRoute';

const Navbar = ({ children }: React.PropsWithChildren<{}>) => {
  return (
    <div>

      <RoleGuard allowedRoles={['VENDOR']}>
        <DashboardTopbar />
        <div className="flex min-h-screen">
          <DashboardSidebar />
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
        <DashboardBottombar />
      </RoleGuard>
    </div>
  );
};

export default Navbar;
