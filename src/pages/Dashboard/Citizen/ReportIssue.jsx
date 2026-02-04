import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { useContext } from "react";
import { AuthContext } from "../../../providers/AuthProvider";
import { useNavigate, Link } from "react-router-dom";
import { imageUpload } from "../../../utils/imageUpload";
import { Loader2, AlertTriangle, ShieldCheck } from "lucide-react";

const ReportIssue = () => {
    const { register, handleSubmit, reset } = useForm();
    const axiosSecure = useAxiosSecure();
    const { user, dbUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const { data: issues = [], isLoading: issuesLoading } = useQuery({
        queryKey: ['citizen-report-count', dbUser?._id],
        enabled: !!dbUser?._id,
        queryFn: async () => {
            const res = await axiosSecure.get(`/issues?reporter=${dbUser._id}`);
            return res.data.issues;
        }
    });

    const isLimitReached = !dbUser?.isPremium && issues.length >= 3;

    const onSubmit = async (data) => {
        if (!dbUser?._id) return;
        if (dbUser.isBlocked) return Swal.fire('Error', 'Your account is blocked', 'error');
        if (isLimitReached) return Swal.fire('Limit Reached', 'Free users can only report 3 issues. Please upgrade to Premium.', 'warning');

        let imageUrls = [];

        try {
            if (data.image && data.image[0]) {
                const imageData = await imageUpload(data.image[0]);
                if (imageData.data) {
                    imageUrls.push(imageData.data.display_url);
                }
            }

            const issueData = {
                title: data.title,
                category: data.category,
                location: data.location,
                description: data.description,
                reporter: dbUser._id,
                images: imageUrls.length > 0 ? imageUrls : ['https://i.ibb.co.com/G4sT4V5X/looking-clean-cities-parks-flat-600nw-2355235719.jpg'],
                status: 'Pending',
                createdAt: new Date()
            };

            const res = await axiosSecure.post('/issues', issueData);
            if (res.data._id) {
                Swal.fire('Success', 'Issue Reported Successfully', 'success');
                reset();
                navigate('/citizen/my-issues');
            }
        } catch (error) {
            Swal.fire('Error', 'Failed to report issue', 'error');
        }
    };

    if (issuesLoading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" size={40} /></div>;

    if (dbUser?.isBlocked) {
        return (
            <div className="max-w-2xl mx-auto mt-10 p-10 bg-white dark:bg-gray-900 rounded-3xl shadow-xl text-center border border-red-100 dark:border-red-900/30">
                <AlertTriangle className="mx-auto text-red-500 mb-4" size={60} />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Account Blocked</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-4 leading-relaxed">
                    Your account has been blocked by the administration team. You are not allowed to submit new reports at this time.
                </p>
                <p className="text-sm text-red-600 mt-6 font-medium bg-red-50 dark:bg-red-900/20 py-3 px-6 rounded-xl inline-block">
                    Please contact the authorities to resolve this issue.
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto">
            {isLimitReached && (
                <div className="mb-8 p-6 bg-amber-50 dark:bg-amber-900/20 rounded-3xl border border-amber-200 dark:border-amber-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-amber-100 dark:bg-amber-900/40 rounded-2xl text-amber-600 dark:text-amber-400">
                            <ShieldCheck size={32} />
                        </div>
                        <div>
                            <h3 className="font-bold text-amber-900 dark:text-amber-100">Reporting Limit Reached</h3>
                            <p className="text-sm text-amber-700 dark:text-amber-300">Free users can report up to 3 issues. Upgrade to report unlimited issues.</p>
                        </div>
                    </div>
                    <Link to="/citizen/profile" className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-amber-600/20 whitespace-nowrap">
                        Upgrade to Premium 👑
                    </Link>
                </div>
            )}

            <div className={`bg-white dark:bg-gray-900 p-10 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 ${isLimitReached ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
                <h2 className="text-3xl font-extrabold mb-8 text-gray-900 dark:text-white tracking-tight">Report a New Infrastructure Issue</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider ml-1">Issue Title</label>
                        <input {...register("title", { required: true })} className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border-0 rounded-2xl focus:ring-2 focus:ring-primary dark:text-white transition-all outline-none text-lg font-medium" placeholder="e.g. Collapsed Drain Cover" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider ml-1">Category</label>
                            <select {...register("category", { required: true })} className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border-0 rounded-2xl focus:ring-2 focus:ring-primary dark:text-white transition-all outline-none text-lg font-medium">
                                <option value="Roads">Roads & Potholes</option>
                                <option value="Electricity">Electricity</option>
                                <option value="Water">Water Supply</option>
                                <option value="Waste">Waste Management</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider ml-1">Location Address</label>
                            <input {...register("location", { required: true })} className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border-0 rounded-2xl focus:ring-2 focus:ring-primary dark:text-white transition-all outline-none text-lg font-medium" placeholder="e.g. Plot 12, Road 4, Sector 7" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider ml-1">Detailed Description</label>
                        <textarea {...register("description", { required: true })} rows={4} className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border-0 rounded-2xl focus:ring-2 focus:ring-primary dark:text-white transition-all outline-none text-lg font-medium" placeholder="Provide as much detail as possible to help the staff understand the problem..." />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider ml-1">Evidence Photo</label>
                        <div className="p-6 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl bg-gray-50 dark:bg-gray-800/50">
                            <input type="file" {...register("image")} className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-primary file:text-white hover:file:bg-primary-hover transition-colors cursor-pointer" />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button type="submit" className="w-full py-5 bg-primary hover:bg-primary-hover text-white font-extrabold rounded-2xl shadow-lg shadow-primary/20 transition-all transform hover:scale-[1.02] active:scale-95 text-xl">
                            Submit Report
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReportIssue;
