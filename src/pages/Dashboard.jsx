import SideNavbar from "../components/SideNavbar";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  

    return (
        <div className="container-fluid p-0">
            <div className="d-flex">
                {/* Sidebar */}
                <SideNavbar />

                {/* Main Section */}
                <div className="flex-grow-1">
                 
                   

                    {/* Page Content */}
                    <main className="p-4 bg-light min-vh-100">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
