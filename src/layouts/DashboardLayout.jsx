import { useContext, useState } from "react";
import { Link, Outlet, NavLink, useLocation } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";
import { ThemeContext } from "../providers/ThemeProvider";
import { Home, List, User, PlusCircle, LayoutDashboard, Users, CreditCard, Shield, Menu, X, Sun, Moon, Bell } from "lucide-react";

const DashboardLayout = () => {
    const { user, role, logOut } = useContext(AuthContext);
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    const userRole = role || 'citizen';

    // Helper to get page title from pathname
    const getPageTitle = (path) => {
        const parts = path.split('/');
        const lastPart = parts[parts.length - 1];
        if (!lastPart || ['citizen', 'admin', 'staff'].includes(lastPart)) return 'Overview';
        return lastPart.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    const navLinkClass = ({ isActive }) =>
        `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${isActive
            ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary dark:hover:text-primary'
        }`;

    const citizenLinks = <>
        <NavLink to="/citizen/home" end className={navLinkClass}>
            <LayoutDashboard size={20} /> Dashboard
        </NavLink>
        <NavLink to="/citizen/my-issues" className={navLinkClass}>
            <List size={20} /> My Issues
        </NavLink>
        <NavLink to="/citizen/report-issue" className={navLinkClass}>
            <PlusCircle size={20} /> Report Issue
        </NavLink>
        <NavLink to="/citizen/profile" className={navLinkClass}>
            <User size={20} /> Profile
        </NavLink>
    </>;

    const staffLinks = <>
        <NavLink to="/staff/home" end className={navLinkClass}>
            <LayoutDashboard size={20} /> Dashboard
        </NavLink>
        <NavLink to="/staff/assigned-issues" className={navLinkClass}>
            <List size={20} /> Assigned Issues
        </NavLink>
        <NavLink to="/staff/profile" className={navLinkClass}>
            <User size={20} /> Profile
        </NavLink>
    </>;

    const adminLinks = <>
        <NavLink to="/admin/home" end className={navLinkClass}>
            <LayoutDashboard size={20} /> Overview
        </NavLink>
        <NavLink to="/admin/all-issues" className={navLinkClass}>
            <List size={20} /> All Issues
        </NavLink>
        <NavLink to="/admin/manage-users" className={navLinkClass}>
            <Users size={20} /> Manage Citizens
        </NavLink>
        <NavLink to="/admin/manage-staff" className={navLinkClass}>
            <Shield size={20} /> Manage Staff
        </NavLink>
        <NavLink to="/admin/payments" className={navLinkClass}>
            <CreditCard size={20} /> Payments
        </NavLink>
        <NavLink to="/admin/profile" className={navLinkClass}>
            <User size={20} /> Profile
        </NavLink>
    </>;

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
            {/* Sidebar Desktop */}
            <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 hidden lg:flex flex-col shadow-sm">
                <div className="h-16 flex items-center px-6 border-b border-gray-100 dark:border-gray-800">
                    <Link to="/" className="text-xl font-bold flex items-center gap-2">
                        <img src="/logo.png" alt="Logo" className="w-8 h-8" />
                        <span className="text-gray-800 dark:text-white"><span className="text-primary">Infra</span>Report</span>
                    </Link>
                </div>

                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
                    <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Main Menu</p>
                    {userRole === 'citizen' && citizenLinks}
                    {userRole === 'staff' && staffLinks}
                    {userRole === 'admin' && adminLinks}
                </div>

                <div className="p-4 border-t border-gray-100 dark:border-gray-800">
                    <button onClick={logOut} className="flex items-center gap-3 px-4 py-2.5 w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg font-medium transition-all group">
                        <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                        Log out
                    </button>
                </div>
            </aside>

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Mobile Sidebar Drawer */}
            <aside className={`fixed inset-y-0 left-0 w-72 bg-white dark:bg-gray-900 z-50 lg:hidden transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="h-16 flex items-center justify-between px-6 border-b dark:border-gray-800">
                    <Link to="/" className="text-xl font-bold flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white text-sm">P</div>
                        <span className="text-gray-800 dark:text-white">InfraReport</span>
                    </Link>
                    <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-500"><X size={24} /></button>
                </div>
                <div className="py-6 px-4 space-y-2">
                    {userRole === 'citizen' && citizenLinks}
                    {userRole === 'staff' && staffLinks}
                    {userRole === 'admin' && adminLinks}
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Dashboard Header */}
                <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 lg:px-8 shrink-0 transition-colors duration-300">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="lg:hidden p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                        >
                            <Menu size={24} />
                        </button>
                        <h1 className="text-lg font-semibold text-gray-800 dark:text-white">
                            {getPageTitle(location.pathname)}
                        </h1>
                    </div>

                    <div className="flex items-center gap-2 md:gap-4">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                            title="Toggle Theme"
                        >
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        <div className="h-8 w-[1px] bg-gray-200 dark:border-gray-800 mx-1 hidden md:block"></div>

                        {/* User Profile Info */}
                        <div className="flex items-center gap-3">
                            <div className="hidden md:block text-right">
                                <p className="text-sm font-semibold text-gray-800 dark:text-white">{user?.displayName || 'User'}</p>
                                <p className="text-xs text-gray-500 capitalize">{userRole}</p>
                            </div>
                            <Link to={`/${userRole}/profile`} className="flex-shrink-0">
                                {user?.photoURL ? (
                                    <img
                                        src={user.photoURL}
                                        alt="Profile"
                                        className="h-9 w-9 rounded-full object-cover border-2 border-primary/20 hover:border-primary transition-all shadow-sm"
                                    />
                                ) : (
                                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <User size={18} />
                                    </div>
                                )}
                            </Link>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto focus:outline-none scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
                    <div className="max-w-7xl mx-auto p-4 lg:p-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
