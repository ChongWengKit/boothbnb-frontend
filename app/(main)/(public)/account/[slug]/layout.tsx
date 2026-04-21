import DashboardSidebar from '@/components/DashboardSidebar';
import DashboardTopbar from '@/components/DashboardTopbar';
import DashboardBottombar from '@/components/DashboardBottombar';

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
      <DashboardBottombar />
    </div>
  );
};

export default Navbar;
