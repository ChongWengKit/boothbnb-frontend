import DashboardSidebar from '@/components/DashboardSidebar';
import DashboardTopbar from '@/components/DashboardTopbar';
import RoleGuard from '@/components/ProtectedRoute';
import DashboardBottombar from '@/components/DashboardBottombar';
import { IoArrowBack } from 'react-icons/io5';
import Link from 'next/dist/client/link';

const Navbar = ({ children }: React.PropsWithChildren) => {
  return (
    <div>
      <DashboardTopbar />
      <div className="flex min-h-screen">
        <DashboardSidebar />

        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Navbar;
