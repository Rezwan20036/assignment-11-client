import { Link } from "react-router-dom";

const CallToAction = () => {
    return (
        <section className="bg-green-700 text-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl font-extrabold sm:text-4xl mb-6">
                    Ready to Make a Difference?
                </h2>
                <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
                    Join thousands of citizens who are actively improving their neighborhoods. Your voice matters.
                </p>
                <div className="flex justify-center gap-4">
                    <Link to="/register" className="bg-white text-green-800 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors shadow-lg">
                        Sign Up Now
                    </Link>
                    <Link to="/about" className="bg-green-800 border border-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-900 transition-colors">
                        Learn More
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default CallToAction;
