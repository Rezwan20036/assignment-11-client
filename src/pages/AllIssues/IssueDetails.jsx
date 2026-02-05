import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useContext } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import Swal from "sweetalert2";
import { CheckCircle, Clock, ArrowUpCircle } from "lucide-react";

const IssueDetails = () => {
    const { id } = useParams();
    const axiosPublic = useAxiosPublic();
    const axiosSecure = useAxiosSecure();
    const { user, dbUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const { data: issue, isLoading, refetch } = useQuery({
        queryKey: ['issue', id],
        queryFn: async () => {
            const res = await axiosPublic.get(`/issues/${id}`);
            return res.data;
        }
    });

    if (isLoading) return <div className="text-center py-20">Loading...</div>;

    const isOwner = dbUser && issue.reporter?._id === dbUser._id;
    const hasUpvoted = dbUser && issue.upvotes?.includes(dbUser._id);

    const handleUpvote = async () => {
        if (!dbUser) return navigate('/login');
        if (isOwner) return Swal.fire('Error', 'You cannot upvote your own issue', 'error');

        try {
            const res = await axiosSecure.patch(`/issues/upvote/${id}`, { userId: dbUser._id });
            if (res.data.modifiedCount > 0) {
                Swal.fire('Success', 'Issue Upvoted!', 'success');
                refetch();
            }
        } catch (error) {
            Swal.fire('Error', error.response?.data?.message || 'Upvote failed', 'error');
        }
    };

    const handleBoost = () => {
        if (dbUser?.isBlocked) return Swal.fire('Error', 'Your account is blocked', 'error');
        Swal.fire({
            title: 'Boost Issue?',
            text: "Pay 100tk to boost this issue to High Priority for faster staff response!",
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Pay 100tk',
            confirmButtonColor: '#f59e0b',
            cancelButtonColor: '#64748b'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // 1. Update Issue Priority
                    await axiosSecure.patch(`/issues/${id}`, { priority: 'High' });

                    // 2. Create Payment Record
                    await axiosSecure.post('/payments', {
                        user: dbUser._id,
                        amount: 100,
                        transactionId: `BOOST-${Date.now()}`,
                        type: 'boost',
                        issueId: id
                    });

                    Swal.fire('Success', 'Issue Boosted to High Priority!', 'success');
                    refetch();
                } catch (error) {
                    Swal.fire('Error', 'Failed to boost issue', 'error');
                }
            }
        });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Details */}
                <div className="lg:col-span-2 space-y-8">
                    <img src={issue.images?.[0] || 'https://via.placeholder.com/800x400'} alt={issue.title} className="w-full h-96 object-cover rounded-xl shadow-lg" />

                    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{issue.title}</h1>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleUpvote}
                                    disabled={hasUpvoted}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${hasUpvoted
                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30'
                                        : 'bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg'
                                        }`}
                                >
                                    <ArrowUpCircle size={20} />
                                    {issue.upvotes?.length || 0} Votes
                                </button>
                                {issue.priority === 'High' && <span className="bg-amber-500 text-white px-3 py-1.5 rounded-lg text-sm font-bold shadow-sm">High Priority</span>}
                            </div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-6">
                            {issue.description}
                        </p>

                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-500 dark:text-gray-400">
                            <div><strong>Category:</strong> {issue.category}</div>
                            <div><strong>Location:</strong> {issue.location}</div>
                            <div><strong>Status:</strong> {issue.status}</div>
                            <div><strong>Date:</strong> {new Date(issue.createdAt).toDateString()}</div>
                        </div>

                        {/* Action Buttons for Owner */}
                        {isOwner && issue.status === 'Pending' && !dbUser?.isBlocked && (
                            <div className="mt-8 flex gap-4">
                                <Link to="/citizen/my-issues" className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
                                    Manage Issue (Edit/Delete)
                                </Link>
                                {issue.priority !== 'High' && (
                                    <button
                                        onClick={handleBoost}
                                        className="px-6 py-3 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 flex items-center gap-2 transition-all shadow-lg shadow-amber-500/20"
                                    >
                                        <ArrowUpCircle size={20} /> Boost Issue (৳100)
                                    </button>
                                )}
                            </div>
                        )}
                        {dbUser?.isBlocked && (
                            <div className="mt-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 font-bold">
                                Your account is blocked. Actions are disabled.
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Timeline & Staff */}
                <div className="space-y-8">
                    {/* Assigned Staff */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Assigned Staff</h3>
                        {issue.assignedTo ? (
                            <div className="flex items-center gap-4">
                                <img src={issue.assignedTo.photo || 'https://via.placeholder.com/50'} className="w-12 h-12 rounded-full" alt="Staff" />
                                <div>
                                    <div className="font-bold text-gray-900 dark:text-white">{issue.assignedTo.name}</div>
                                    <div className="text-sm text-gray-500">{issue.assignedTo.email}</div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-gray-500 italic">No staff assigned yet.</div>
                        )}
                    </div>

                    {/* Timeline */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Issue Timeline</h3>
                        <div className="relative border-l-2 border-gray-200 dark:border-gray-700 ml-3 space-y-8">
                            {issue.timeline?.slice().reverse().map((event, idx) => (
                                <div key={idx} className="relative pl-8">
                                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-green-500 border-2 border-white dark:border-gray-800"></div>
                                    <div>
                                        <div className="font-bold text-gray-800 dark:text-white text-sm">{event.status}</div>
                                        <div className="text-xs text-gray-500 mb-1">{new Date(event.date).toLocaleString()}</div>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">{event.message}</p>
                                        <div className="text-xs text-green-600 mt-1">Updated by: {event.updatedBy?.name} ({event.updatedBy?.role})</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IssueDetails;
