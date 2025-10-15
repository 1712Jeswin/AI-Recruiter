import { AppSidebar } from "./_components/sideBar";
import DashboardProvider from "./provider";

interface Props{
  children: React.ReactNode
}

const Layout = ({ children }:Props) => {
  return (
    <div className="bg-secondary">
      <DashboardProvider>
        <div className="px-20 py-10">{children}</div>
        <AppSidebar />
      </DashboardProvider>
    </div>
  );
};

export default Layout;
