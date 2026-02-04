import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { Link } from "react-router-dom";
import { Eye } from "lucide-react";
import Swal from "sweetalert2";

const AdminAllIssues = () => {
    const axiosSecure = useAxiosSecure();

    const { data: issues = [], refetch } = useQuery({
        queryKey: ['admin-all-issues'],
        queryFn: async () => {
            const res = await axiosSecure.get('/issues?limit=100');
            return res.data.issues;
        }
    });

    const { data: staff = [] } = useQuery({
        queryKey: ['staff-list'],
        queryFn: async () => {
            const res = await axiosSecure.get('/users?role=staff');
            return res.data;
        }
    });

    const handleAssignStaff = (issueId) => {
        if (staff.length === 0) return Swal.fire('Error', 'No staff members found', 'error');

        const staffOptions = {};
        staff.forEach(s => {
            staffOptions[s._id] = s.name;
        });

        Swal.fire({
            title: 'Select Staff Member',
            input: 'select',
            inputOptions: staffOptions,
            inputPlaceholder: 'Search for staff...',
            showCancelButton: true,
            confirmButtonText: 'Assign Staff',
            confirmButtonColor: '#2563eb',
            cancelButtonColor: '#64748b'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const staffId = result.value;
                    const selectedStaff = staff.find(s => s._id === staffId);

                    await axiosSecure.patch(`/issues/${issueId}`, {
                        assignedTo: staffId,
                        timeline: {
                            status: 'Assigned',
                            message: `Issue assigned to ${selectedStaff.name}`,
                            updatedBy: { name: 'Admin', role: 'admin' },
                            date: new Date()
                        }
                    });

                    Swal.fire('Assigned!', `Issue assigned to ${selectedStaff.name}`, 'success');
                    refetch();
                } catch (error) {
                    Swal.fire('Error', 'Failed to assign staff', 'error');
                }
            }
        });
    };

    const handleReject = (issueId) => {
        Swal.fire({
            title: 'Reject Issue?',
            text: "This will mark the issue as Closed and finalized. The citizen will be notified via their dashboard.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Yes, Reject',
            cancelButtonColor: '#64748b'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axiosSecure.patch(`/issues/${issueId}`, {
                        status: 'Closed',
                        timeline: {
                            status: 'Closed',
                            message: 'Issue rejected by Administrator',
                            updatedBy: { name: 'Admin', role: 'admin' },
                            date: new Date()
                        }
                    });
                    Swal.fire('Rejected!', 'Issue has been marked as Closed.', 'success');
                    refetch();
                } catch (error) {
                    Swal.fire('Error', 'Failed to reject issue', 'error');
                }
            }
        });
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">All Issues</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Monitor all reports, assign specialized staff, and manage issues.</p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-800/50">
                                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Issue Details</th>
                                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest text-center">Status</th>
                                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Priority</th>
                                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Ownership</th>
                                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Action Gate</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {issues.map(issue => (
                                <tr key={issue._id} className={`${issue.priority === 'High' ? 'bg-amber-50/50 dark:bg-amber-900/5' : ''} hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors`}>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-gray-900 dark:text-white">{issue.title}</div>
                                        <div className="text-[10px] text-primary font-bold uppercase tracking-widest mt-0.5">{issue.category}</div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${issue.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                                            issue.status === 'In-Progress' ? 'bg-blue-100 text-blue-700' :
                                                issue.status === 'Closed' ? 'bg-slate-100 text-slate-700' :
                                                    'bg-amber-100 text-amber-700'
                                            }`}>
                                            {issue.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {issue.priority === 'High' ? (
                                            <span className="text-amber-600 font-bold text-xs italic tracking-tighter">High</span>
                                        ) : (
                                            <span className="text-gray-400 text-xs font-medium">Normal</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {issue.assignedTo ? (
                                            <div className="flex items-center gap-2">
                                                <img src={issue.assignedTo.photo || 'https://via.placeholder.com/30'} className="w-8 h-8 rounded-xl object-cover shadow-sm" />
                                                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{issue.assignedTo.name}</span>
                                            </div>
                                        ) : (
                                            <span className="text-gray-400 italic text-xs font-medium">No staff assigned</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                to={`/issues/${issue._id}`}
                                                className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
                                                title="View Details"
                                            >
                                                <Eye size={18} />
                                            </Link>
                                            {!issue.assignedTo && issue.status !== 'Closed' && (
                                                <button
                                                    onClick={() => handleAssignStaff(issue._id)}
                                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold uppercase rounded-xl transition-all shadow-md shadow-blue-600/20"
                                                >
                                                    Assign Staff
                                                </button>
                                            )}
                                            {issue.status === 'Pending' && (
                                                <button
                                                    onClick={() => handleReject(issue._id)}
                                                    className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-[10px] font-bold uppercase rounded-xl transition-all border border-red-100"
                                                >
                                                    Reject
                                                </button>
                                            )}
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

export default AdminAllIssues;
