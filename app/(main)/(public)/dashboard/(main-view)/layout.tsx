import DashboardSidebar from '@/components/DashboardSidebar';
import DashboardTopbar from '@/components/DashboardTopbar';
import DashboardBottombar from '@/components/DashboardBottombar';

const Navbar = ({ children }: React.PropsWithChildren) => {
  return (
    <div className="flex flex-col min-h-screen">
      <DashboardTopbar />
      <div className="flex flex-1"> 
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
