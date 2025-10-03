import DashboardProvider from "./provider";

const Layout = ({children}) => {
    return ( 
        <div>
            <DashboardProvider>
                {children}
            </DashboardProvider>
        </div>
     );
}
 
export default Layout;