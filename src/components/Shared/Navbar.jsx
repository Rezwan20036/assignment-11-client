import { useContext, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProvider";
import { ThemeContext } from "../../providers/ThemeProvider";
import { Menu, X, User, Sun, Moon } from "lucide-react";

const Navbar = () => {
  const { user, role, logOut } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [isOpen, setIsOpen] = useState(false);

  const dashboardPath = role ? `/${role}/home` : '/dashboard';

  const handleLogOut = () => {
    logOut().then(() => { }).catch(console.error);
  };

  const navLinks = (
    <>
      <NavLink to="/" className={({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-primary text-white' : 'text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary'}`}>Home</NavLink>
      <NavLink to="/all-issues" className={({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-primary text-white' : 'text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary'}`}>All Issues</NavLink>
      <NavLink to="/features" className={({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-primary text-white' : 'text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary'}`}>Features</NavLink>
      <NavLink to="/about" className={({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-primary text-white' : 'text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary'}`}>About</NavLink>
    </>
  );

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-lg bg-white/70 dark:bg-gray-900/70 border-b border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center gap-2">
            <img src="/logo.png" alt="Logo" className="w-12 h-12" />
            <Link to="/" className="text-xl font-bold text-gray-800 dark:text-white"><span className="text-primary">Infra</span>Report</Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {navLinks}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {/* Theme Toggle */}
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 transition-colors">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {user ? (
              <div className="relative group">
                <button className="flex items-center focus:outline-none">
                  {user.photoURL ? (
                    <img className="h-10 w-10 rounded-xl object-cover border-2 border-primary/20 hover:border-primary transition-all shadow-md" src={user.photoURL} alt={user.displayName} />
                  ) : (
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <User size={20} />
                    </div>
                  )}
                </button>
                {/* Dropdown */}
                <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right border border-gray-100 dark:border-gray-800">
                  <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-800">
                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user.displayName || 'User'}</p>
                    <p className="text-xs text-gray-500 capitalize mt-0.5">{role}</p>
                  </div>
                  <Link to={dashboardPath} className="block px-5 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-primary/5 hover:text-primary transition-colors">Dashboard</Link>
                  <Link to={`/${role}/profile`} className="block px-5 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-primary/5 hover:text-primary transition-colors">Profile</Link>
                  <div className="h-px bg-gray-100 dark:border-gray-800 mx-2 my-1"></div>
                  <button onClick={handleLogOut} className="block w-full text-left px-5 py-3 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">Logout</button>
                </div>
              </div>
            ) : (
              <div className="flex gap-3">
                <Link to="/login" className="px-6 py-2.5 text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-primary">Login</Link>
                <Link to="/register" className="px-6 py-2.5 text-sm font-bold text-white bg-primary hover:bg-primary-hover rounded-xl shadow-lg shadow-primary/20 transition-all transform hover:scale-105">Get Started</Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700 dark:text-gray-200 focus:outline-none">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t dark:border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col">
            {navLinks}

            {/* Mobile Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 w-full text-left"
            >
              {theme === 'dark' ? <><Sun size={18} /> Light Mode</> : <><Moon size={18} /> Dark Mode</>}
            </button>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-2">
              {user ? (
                <>
                  <div className="flex items-center px-4 py-3 mb-2 bg-primary/5 rounded-2xl">
                    {user.photoURL ? (
                      <img className="h-10 w-10 rounded-xl object-cover" src={user.photoURL} alt="" />
                    ) : (
                      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <User size={20} />
                      </div>
                    )}
                    <div className="ml-3">
                      <p className="text-sm font-bold text-gray-900 dark:text-white leading-none">{user.displayName}</p>
                      <p className="text-xs text-gray-500 capitalize mt-1">{role}</p>
                    </div>
                  </div>
                  <Link to={dashboardPath} className="block px-4 py-3 rounded-xl text-base font-bold text-gray-700 dark:text-gray-200 hover:bg-primary/5 hover:text-primary transition-colors">Dashboard</Link>
                  <Link to={`/${role}/profile`} className="block px-4 py-3 rounded-xl text-base font-bold text-gray-700 dark:text-gray-200 hover:bg-primary/5 hover:text-primary transition-colors">Profile</Link>
                  <button onClick={handleLogOut} className="block w-full text-left px-4 py-3 rounded-xl text-base font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">Logout</button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2 px-3">
                  <Link to="/login" className="block text-center px-4 py-2 border border-primary text-primary rounded-md">Login</Link>
                  <Link to="/register" className="block text-center px-4 py-2 bg-primary text-white rounded-md">Register</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
