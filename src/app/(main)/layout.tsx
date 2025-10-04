import { AppSidebar } from "./_components/sideBar";
import DashboardProvider from "./provider";

const Layout = ({ children }) => {
  return (
    <div className="bg-secondary">
      <DashboardProvider>
        <div className="p-20">{children}</div>
        <AppSidebar />
      </DashboardProvider>
    </div>
  );
};

export default Layout;
