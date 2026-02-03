import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { Link } from "react-router-dom";
import { CheckCircle, MapPin, Calendar } from "lucide-react";

const LatestIssues = () => {
    const axiosPublic = useAxiosPublic();

    const { data: issues = [], isLoading } = useQuery({
        queryKey: ['resolved-issues'],
        queryFn: async () => {
            const res = await axiosPublic.get('/issues/resolved');
            return res.data;
        }
    });

    if (isLoading) return (
        <div className="flex justify-center py-20">
            <span className="loading loading-spinner loading-lg text-green-600"></span>
        </div>
    );

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">Recently Resolved Issues</h2>
                <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">See how we are transforming the city, one issue at a time.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {issues.map((issue) => (
                    <div key={issue._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden border border-gray-100 dark:border-gray-700">
                        <div className="h-48 overflow-hidden">
                            <img src={issue.images?.[0] || 'https://via.placeholder.com/400x300'} alt={issue.title} className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                    <CheckCircle size={12} className="mr-1" /> Resolved
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">{issue.title}</h3>
                            <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-2">
                                <MapPin size={16} className="mr-2" />
                                {issue.location}
                            </div>
                            <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-6">
                                <Calendar size={16} className="mr-2" />
                                {new Date(issue.createdAt).toLocaleDateString()}
                            </div>
                            <Link
                                to={`/issues/${issue._id}`}
                                className="block w-full text-center py-2 px-4 border border-green-600 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 font-medium transition-colors"
                            >
                                View Details
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
            {issues.length === 0 && (
                <div className="text-center py-10 text-gray-500 italic">
                    No recently resolved issues to display.
                </div>
            )}
        </section>
    );
};

export default LatestIssues;
