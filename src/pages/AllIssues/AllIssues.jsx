import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import IssueCard from "./IssueCard";
import { Search, Filter } from "lucide-react";

const AllIssues = () => {
    const axiosPublic = useAxiosPublic();
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [page, setPage] = useState(1);
    const limit = 6;

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['issues', page, searchTerm, filterCategory, filterStatus],
        queryFn: async () => {
            const res = await axiosPublic.get(`/issues?page=${page}&limit=${limit}&search=${searchTerm}&category=${filterCategory}&status=${filterStatus}`);
            return res.data;
        }
    });

    const issues = data?.issues || [];
    const totalPages = data?.totalPages || 1;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">All Reported Issues</h1>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                <div className="relative w-full md:w-1/2">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search issues by title..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-green-500 outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <div className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2">
                        <Filter className="text-gray-400" size={18} />
                        <select
                            className="bg-transparent dark:text-white focus:ring-0 outline-none text-sm font-medium"
                            value={filterCategory}
                            onChange={(e) => { setFilterCategory(e.target.value); setPage(1); }}
                        >
                            <option value="">All Categories</option>
                            <option value="Roads">Roads & Potholes</option>
                            <option value="Electricity">Electricity</option>
                            <option value="Water">Water Supply</option>
                            <option value="Waste">Waste Management</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2">
                        <Filter className="text-gray-400" size={18} />
                        <select
                            className="bg-transparent dark:text-white focus:ring-0 outline-none text-sm font-medium"
                            value={filterStatus}
                            onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
                        >
                            <option value="">All Status</option>
                            <option value="Pending">Pending</option>
                            <option value="In-Progress">In-Progress</option>
                            <option value="Resolved">Resolved</option>
                            <option value="Closed">Closed</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Issues Grid */}
            {isLoading ? (
                <div className="h-64 flex items-center justify-center">
                    <span className="loading loading-spinner loading-lg text-green-600">Loading...</span>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {issues.map(issue => <IssueCard key={issue._id} issue={issue} refetch={refetch} />)}
                </div>
            )}

            {/* Pagination (Simple) */}
            <div className="flex justify-center mt-12 gap-2">
                <button
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                    className="px-4 py-2 border border-green-600 text-green-600 rounded-md disabled:opacity-50"
                >
                    Prev
                </button>
                <div className="px-4 py-2 text-gray-700 dark:text-gray-300">
                    Page {page} of {totalPages}
                </div>
                <button
                    disabled={page === totalPages}
                    onClick={() => setPage(p => p + 1)}
                    className="px-4 py-2 bg-green-700 text-white rounded-md disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default AllIssues;
