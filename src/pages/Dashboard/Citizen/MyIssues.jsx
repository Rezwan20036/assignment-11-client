import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useContext, useState } from "react";
import { AuthContext } from "../../../providers/AuthProvider";
import { Edit, Trash2, Eye, Filter, X, Loader2, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";

const MyIssues = () => {
    const { dbUser } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const [filterStatus, setFilterStatus] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [editingIssue, setEditingIssue] = useState(null);
    const { register, handleSubmit, reset, setValue } = useForm();

    const { data: issues = [], isLoading, refetch } = useQuery({
        queryKey: ['my-issues', dbUser?._id, filterStatus, filterCategory],
        enabled: !!dbUser?._id,
        queryFn: async () => {
            let url = `/issues?reporter=${dbUser._id}&limit=100`;
            if (filterStatus) url += `&status=${filterStatus}`;
            if (filterCategory) url += `&category=${filterCategory}`;
            const res = await axiosSecure.get(url);
            return res.data.issues;
        }
    });

    const updateMutation = useMutation({
        mutationFn: async (data) => {
            const res = await axiosSecure.patch(`/issues/${editingIssue._id}`, data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['my-issues']);
            Swal.fire('Success', 'Issue updated successfully', 'success');
            setEditingIssue(null);
            reset();
        },
        onError: () => {
            Swal.fire('Error', 'Failed to update issue', 'error');
        }
    });

    const handleDelete = (id) => {
        if (dbUser?.isBlocked) return Swal.fire('Error', 'Your account is blocked', 'error');
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this issue!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axiosSecure.delete(`/issues/${id}`);
                    if (res.data.deletedCount > 0) {
                        Swal.fire({
                            title: 'Deleted!',
                            text: 'Your issue has been successfully removed.',
                            icon: 'success',
                            confirmButtonColor: '#22c55e'
                        });
                        refetch();
                    }
                } catch (err) {
                    Swal.fire('Error', 'Failed to delete the issue. Please try again.', 'error');
                }
            }
        })
    };

    const handleEditClick = (issue) => {
        if (dbUser?.isBlocked) return Swal.fire('Error', 'Your account is blocked', 'error');
        setEditingIssue(issue);
        setValue('title', issue.title);
        setValue('category', issue.category);
        setValue('location', issue.location);
        setValue('description', issue.description);
    };

    const onEditSubmit = (data) => {
        updateMutation.mutate(data);
    };

    if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" size={40} /></div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Reported Issues</h2>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                        <Filter size={16} className="text-gray-400" />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="bg-transparent border-0 text-sm focus:ring-0 text-gray-700 dark:text-gray-300 outline-none"
                        >
                            <option value="">All Status</option>
                            <option value="Pending">Pending</option>
                            <option value="In-Progress">In-Progress</option>
                            <option value="Resolved">Resolved</option>
                            <option value="Closed">Closed</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                        <Filter size={16} className="text-gray-400" />
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="bg-transparent border-0 text-sm focus:ring-0 text-gray-700 dark:text-gray-300 outline-none"
                        >
                            <option value="">All Categories</option>
                            <option value="Roads">Roads</option>
                            <option value="Electricity">Electricity</option>
                            <option value="Water">Water Supply</option>
                            <option value="Waste">Waste Management</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-800/50">
                                <th className="px-6 py-4 text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">Issue</th>
                                <th className="px-6 py-4 text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">Category</th>
                                <th className="px-6 py-4 text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">Status</th>
                                <th className="px-6 py-4 text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider text-right whitespace-nowrap">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {issues.length > 0 ? issues.map((issue) => (
                                <tr key={issue._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">{issue.title}</div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{issue.location}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-lg text-xs font-bold uppercase tracking-wider">
                                            {issue.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${issue.status === 'Resolved' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                            issue.status === 'In-Progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                                issue.status === 'Closed' ? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400' :
                                                    'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                            }`}>
                                            {issue.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link to={`/issues/${issue._id}`} className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-xl transition-all" title="View Details">
                                                <Eye size={18} />
                                            </Link>
                                            {issue.status === 'Pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleEditClick(issue)}
                                                        className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-xl transition-all"
                                                        title="Edit"
                                                    >
                                                        <Edit size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(issue._id)}
                                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all font-bold"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-20 text-center text-gray-500 dark:text-gray-400">
                                        <div className="flex flex-col items-center gap-3">
                                            <LayoutDashboard size={48} className="opacity-20" />
                                            <p className="text-lg font-medium">No issues found matching your filters.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Modal */}
            {editingIssue && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800 animate-in zoom-in-95 duration-300">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Edit Your Report</h3>
                            <button onClick={() => setEditingIssue(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                                <X size={20} className="text-gray-500" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit(onEditSubmit)} className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Title</label>
                                <input {...register("title", { required: true })} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-0 rounded-xl focus:ring-2 focus:ring-primary dark:text-white transition-all outline-none" />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Category</label>
                                    <select {...register("category", { required: true })} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-0 rounded-xl focus:ring-2 focus:ring-primary dark:text-white transition-all outline-none">
                                        <option value="Roads">Roads</option>
                                        <option value="Electricity">Electricity</option>
                                        <option value="Water">Water Supply</option>
                                        <option value="Waste">Waste Management</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Location</label>
                                    <input {...register("location", { required: true })} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-0 rounded-xl focus:ring-2 focus:ring-primary dark:text-white transition-all outline-none" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Description</label>
                                <textarea {...register("description", { required: true })} rows={4} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-0 rounded-xl focus:ring-2 focus:ring-primary dark:text-white transition-all outline-none" />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setEditingIssue(null)} className="flex-1 py-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={updateMutation.isPending}
                                    className="flex-1 py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {updateMutation.isPending && <Loader2 className="animate-spin" size={20} />}
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyIssues;
