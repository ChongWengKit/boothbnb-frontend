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
            <div className="mx-auto h-full w-full max-w-screen-2xl">
              {children}
            </div>
          </main>
      </div>
      <DashboardBottombar />
    </div>
  );
};

export default Navbar;
