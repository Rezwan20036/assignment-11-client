import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Banner = () => {
    return (
        <div className="relative overflow-hidden bg-gray-900 text-white min-h-[600px] flex items-center">
            {/* Background Image/Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://i.ibb.co.com/G4sT4V5X/looking-clean-cities-parks-flat-600nw-2355235719.jpg"
                    alt="City Background"
                    className="w-full h-full object-cover opacity-30"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-xl space-y-8 animate-fade-in-up">
                    <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
                        Report Issues. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
                            Build a Better City.
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300">
                        Join your community in making our city cleaner, safer, and smarter.
                        Report infrastructure problems directly to the authorities and track their resolution.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                            to="/citizen/report-issue"
                            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 md:text-lg transition-transform hover:scale-105 shadow-lg shadow-green-900/50"
                        >
                            Report an Issue
                        </Link>
                        <Link
                            to="/all-issues"
                            className="inline-flex items-center justify-center px-8 py-3 border border-gray-500 hover:border-white text-base font-medium rounded-lg text-gray-300 hover:text-white md:text-lg transition-colors"
                        >
                            View All Issues <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Banner;
