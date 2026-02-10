import SideNavbar from "../components/SideNavbar";
import { Outlet } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";
import { logout } from "../services/AuthService";

const Dashboard = () => {
    const { user } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (err) {
            console.error("Logout error:", err);
        }
    };

    return (
        <div className="container-fluid p-0">
            <div className="d-flex">
                {/* Sidebar */}
                <SideNavbar />

                {/* Main Section */}
                <div className="flex-grow-1">
                    {/* Header */}
                    <header className="d-flex justify-content-between align-items-center px-4 py-3  bg-white">
                        <h5 className="mb-0 fw-bold">
                            Sparkle & Loop Admin
                        </h5>

                        <div className="d-flex align-items-center gap-3">
                            <span className="text-muted small">
                                {user?.email}
                            </span>
                            <button
                                className="btn btn-sm btn-danger"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </div>
                    </header>

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
