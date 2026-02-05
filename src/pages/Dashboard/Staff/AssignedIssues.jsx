import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { useContext, useState } from "react";
import { AuthContext } from "../../../providers/AuthProvider";
import { Filter, Search, MoreHorizontal, CheckCircle, Clock, Hammer, AlertTriangle, Eye } from "lucide-react";

const AssignedIssues = () => {
    const axiosSecure = useAxiosSecure();
    const { dbUser } = useContext(AuthContext);
    const [statusFilter, setStatusFilter] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("");

    // Fetch assigned issues
    const { data: issues = [], refetch, isLoading } = useQuery({
        queryKey: ['assigned-issues', dbUser?._id],
        enabled: !!dbUser?._id,
        queryFn: async () => {
            const res = await axiosSecure.get(`/issues?assignedTo=${dbUser._id}&limit=1000`);
            return res.data.issues;
        }
    });

    const handleStatusChange = async (id, newStatus) => {
        try {
            await axiosSecure.patch(`/issues/${id}`, {
                status: newStatus,
                timeline: {
                    status: newStatus,
                    message: `Staff transitioned issue to ${newStatus}`,
                    updatedBy: { name: dbUser.name, role: 'staff' },
                    date: new Date()
                }
            });
            Swal.fire({
                title: 'Success',
                text: `Status updated to ${newStatus}`,
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            });
            refetch();
        } catch (error) {
            Swal.fire('Error', 'Failed to update status', 'error');
        }
    };

    const filteredIssues = issues.filter(issue => {
        const matchesStatus = statusFilter === "" || issue.status === statusFilter;
        const matchesPriority = priorityFilter === "" || issue.priority === priorityFilter;
        return matchesStatus && matchesPriority;
    }).sort((a, b) => (a.priority === 'High' ? -1 : 1));

    if (isLoading) return <div className="flex justify-center py-20"><span className="loading loading-spinner loading-lg text-primary"></span></div>;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Assigned Tasks</h2>
                <span className="bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
                    {filteredIssues.length} Active Tasks
                </span>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2">
                    <Filter size={16} className="text-gray-400" />
                    <select
                        className="bg-transparent text-sm font-bold outline-none dark:text-gray-300"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="In-Progress">In-Progress</option>
                        <option value="Working">Working</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Closed">Closed</option>
                    </select>
                </div>
                <div className="flex items-center gap-2 border-l pl-4 dark:border-gray-700">
                    <Filter size={16} className="text-gray-400" />
                    <select
                        className="bg-transparent text-sm font-bold outline-none dark:text-gray-300"
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                    >
                        <option value="">All Priorities</option>
                        <option value="High">High Only</option>
                        <option value="Normal">Normal Only</option>
                    </select>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-800/50">
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Issue Details</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Priority</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Update Workflow</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {filteredIssues.map(issue => (
                                <tr key={issue._id} className={`${issue.priority === 'High' ? 'bg-amber-50/50 dark:bg-amber-900/5' : ''} hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors`}>
                                    <td className="px-6 py-4">
                                        <div className="font-black text-gray-900 dark:text-white">{issue.title}</div>
                                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                            <Clock size={12} /> Reported: {new Date(issue.createdAt).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {issue.priority === 'High' ? (
                                            <span className="flex items-center gap-1 text-amber-600 font-black text-xs uppercase italic tracking-tighter">
                                                <AlertTriangle size={14} className="fill-amber-600/10" /> High Priority
                                            </span>
                                        ) : (
                                            <span className="text-gray-400 font-bold text-xs">Normal</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${issue.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                                            issue.status === 'Working' ? 'bg-amber-100 text-amber-700' :
                                                issue.status === 'In-Progress' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-gray-100 text-gray-500'
                                            }`}>
                                            {issue.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                to={`/issues/${issue._id}`}
                                                className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all flex items-center justify-center h-10 w-10 border border-gray-200 dark:border-gray-700"
                                                title="View Details"
                                            >
                                                <Eye size={18} />
                                            </Link>
                                            <select
                                                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 h-10 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500 dark:text-white shadow-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                                                onChange={(e) => handleStatusChange(issue._id, e.target.value)}
                                                value={issue.status}
                                            >
                                                <option disabled value="">Move to...</option>
                                                <option value="Pending">Pending</option>
                                                <option value="In-Progress">In-Progress</option>
                                                <option value="Working">Working</option>
                                                <option value="Resolved">Resolved</option>
                                                <option value="Closed">Closed</option>
                                            </select>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AssignedIssues;
