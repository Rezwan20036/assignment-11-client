import { Link } from "react-router-dom";
import { Home } from "lucide-react";

const ErrorPage = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 text-center px-4">
            <h1 className="text-9xl font-extrabold text-green-700 dark:text-green-500">404</h1>
            <p className="text-2xl font-semibold text-gray-800 dark:text-white mt-4">Oops! Page not found.</p>
            <p className="text-gray-600 dark:text-gray-400 mt-2 mb-8">The page you are looking for might have been removed or is temporarily unavailable.</p>
            <Link to="/" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-700 hover:bg-green-800 transition-colors">
                <Home className="mr-2" size={20} />
                Go Back to Home
            </Link>
        </div>
    );
};

export default ErrorPage;
