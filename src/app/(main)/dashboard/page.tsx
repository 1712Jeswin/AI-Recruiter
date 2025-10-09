import { AppSidebar } from "../_components/sideBar";
import CreateOptions from "./_components/CreateOptions";
import LatestInterviewsList from "./_components/LatestInterviewsList";
import WelcomeContainer from "./_components/WelcomeContainer";

const Dashboard = () => {
    return ( 
        <div>
            {/* <WelcomeContainer /> */}
            <h2 className=" mb-3 font-medium text-2xl">Dashboard</h2>
            <CreateOptions />
            <LatestInterviewsList />
        </div>
     );
}
 
export default Dashboard;