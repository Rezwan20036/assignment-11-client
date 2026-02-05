import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import { ThumbsUp, MapPin, Calendar } from "lucide-react";
import Swal from "sweetalert2";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const IssueCard = ({ issue, refetch }) => {
    const { user, dbUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const axiosPublic = useAxiosPublic();
    const axiosSecure = useAxiosSecure();

    const isOwner = dbUser && issue.reporter?._id === dbUser._id;
    const hasUpvoted = dbUser && issue.upvotes?.includes(dbUser._id);

    const handleUpvote = async () => {
        if (!dbUser) {
            Swal.fire({
                title: "Login Required",
                text: "You must be logged in to upvote issues",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Login",
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate("/login");
                }
            });
            return;
        }

        if (isOwner) {
            Swal.fire("Wait", "You cannot upvote your own issue", "info");
            return;
        }

        if (hasUpvoted) {
            Swal.fire("Info", "You have already upvoted this issue", "info");
            return;
        }

        try {
            const res = await axiosSecure.patch(`/issues/upvote/${issue._id}`, { userId: dbUser._id });
            if (res.data.modifiedCount > 0) {
                Swal.fire("Success", "Upvote added!", "success");
                if (refetch) refetch();
            }
        } catch (err) {
            Swal.fire("Error", err.response?.data?.message || "Failed to upvote", "error");
        }
    };

    return (
        <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border ${issue.priority === 'High' ? 'border-amber-400 ring-1 ring-amber-400' : 'border-gray-100 dark:border-gray-700'}`}>
            <div className="h-48 overflow-hidden relative">
                <img src={issue.images?.[0] || 'https://via.placeholder.com/400'} alt={issue.title} className="w-full h-full object-cover" />
                {issue.priority === 'High' && (
                    <span className="absolute top-2 right-2 bg-amber-500 text-white px-2 py-1 rounded-md text-xs font-bold shadow-sm">
                        High Priority
                    </span>
                )}
                <span className={`absolute top-2 left-2 px-2 py-1 rounded-md text-xs font-bold text-white shadow-sm ${issue.status === 'Resolved' ? 'bg-green-600' :
                    issue.status === 'In-Progress' ? 'bg-blue-600' :
                        issue.status === 'Closed' ? 'bg-gray-600' : 'bg-red-500'
                    }`}>
                    {issue.status}
                </span>
            </div>
            <div className="p-5">
                <div className="flex justify-between items-start">
                    <div>
                        <span className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wide">{issue.category}</span>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-1 line-clamp-1" title={issue.title}>{issue.title}</h3>
                    </div>
                </div>

                <div className="mt-4 flex flex-col gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                        <MapPin size={16} className="mr-2 text-gray-400" />
                        <span className="line-clamp-1">{issue.location}</span>
                    </div>
                    <div className="flex items-center">
                        <Calendar size={16} className="mr-2 text-gray-400" />
                        <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>

                <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <button
                        onClick={handleUpvote}
                        className={`flex items-center transition-colors gap-1.5 ${hasUpvoted ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-300 hover:text-green-600'}`}
                    >
                        <ThumbsUp size={18} fill={hasUpvoted ? "currentColor" : "none"} />
                        <span className="font-semibold">{issue.upvotes?.length || 0}</span>
                    </button>
                    <Link to={`/issues/${issue._id}`} className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium rounded-lg hover:bg-green-600 hover:text-white transition-all">
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default IssueCard;
