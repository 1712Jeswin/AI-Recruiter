import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./_components/sideBar";
import WelcomeContainer from "./dashboard/_components/WelcomeContainer";

interface Props{
  children: React.ReactNode
}

const DashboardProvider = ({ children } : Props) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="w-full">
        <WelcomeContainer/>
        {/* <SidebarTrigger /> */}
        {children}</div>
    </SidebarProvider>
  );
};

export default DashboardProvider;
