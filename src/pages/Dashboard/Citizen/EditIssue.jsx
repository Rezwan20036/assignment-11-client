import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import Swal from "sweetalert2";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../../providers/AuthProvider";
import { imageUpload } from "../../../utils/imageUpload";
import { Loader2, ArrowLeft } from "lucide-react";

const EditIssue = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const axiosPublic = useAxiosPublic();
    const { dbUser } = useContext(AuthContext);
    const { register, handleSubmit, setValue, watch } = useForm();

    const { data: issue, isLoading } = useQuery({
        queryKey: ['issue-edit', id],
        queryFn: async () => {
            const res = await axiosPublic.get(`/issues/${id}`);
            return res.data;
        }
    });

    useEffect(() => {
        if (issue) {
            setValue('title', issue.title);
            setValue('category', issue.category);
            setValue('location', issue.location);
            setValue('description', issue.description);
        }
    }, [issue, setValue]);

    const onSubmit = async (data) => {
        let imageUrls = issue.images || [];

        if (data.image && data.image[0]) {
            const imageData = await imageUpload(data.image[0]);
            if (imageData.data) {
                imageUrls = [imageData.data.display_url]; // Replace with new image or add to array? Let's replace primary for simplicity or keep old ones.
            }
        }

        const updatedData = {
            title: data.title,
            category: data.category,
            location: data.location,
            description: data.description,
            images: imageUrls
        };

        try {
            const res = await axiosPublic.patch(`/issues/${id}`, updatedData);
            if (res.data._id) {
                Swal.fire('Success', 'Issue Updated Successfully', 'success');
                navigate('/dashboard/my-issues');
            }
        } catch (error) {
            Swal.fire('Error', 'Failed to update issue', 'error');
        }
    };

    if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin" size={40} /></div>;

    // Security check: only owner can edit
    if (dbUser && issue && issue.reporter._id !== dbUser._id) {
        return <div className="text-center py-20 text-red-500 font-bold text-xl">Unauthorized: You cannot edit this issue.</div>;
    }

    return (
        <div className="max-w-3xl mx-auto py-8">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-500 hover:text-primary mb-6 transition-colors font-medium"
            >
                <ArrowLeft size={20} /> Back to My Issues
            </button>

            <div className="bg-white dark:bg-gray-900 p-10 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800">
                <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Edit Your Report</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider ml-1">Issue Title</label>
                        <input
                            {...register("title", { required: true })}
                            className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border-0 rounded-2xl focus:ring-2 focus:ring-primary dark:text-white transition-all outline-none text-lg font-medium"
                            placeholder="e.g. Massive Pothole on Sector 7 Road"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider ml-1">Category</label>
                            <select
                                {...register("category", { required: true })}
                                className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border-0 rounded-2xl focus:ring-2 focus:ring-primary dark:text-white transition-all outline-none text-lg font-medium"
                            >
                                <option value="Roads">Roads & Potholes</option>
                                <option value="Electricity">Electricity</option>
                                <option value="Water">Water Supply</option>
                                <option value="Waste">Waste Management</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider ml-1">Location</label>
                            <input
                                {...register("location", { required: true })}
                                className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border-0 rounded-2xl focus:ring-2 focus:ring-primary dark:text-white transition-all outline-none text-lg font-medium"
                                placeholder="e.g. Near City Bank, Uttara"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider ml-1">Description</label>
                        <textarea
                            {...register("description", { required: true })}
                            rows={5}
                            className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border-0 rounded-2xl focus:ring-2 focus:ring-primary dark:text-white transition-all outline-none text-lg font-medium"
                            placeholder="Describe the issue in detail..."
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="block text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider ml-1">Update Photos (Optional)</label>
                        <div className="flex items-center gap-6 p-6 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl bg-gray-50 dark:bg-gray-800/50">
                            {issue?.images?.[0] && (
                                <img src={issue.images[0]} className="w-24 h-24 object-cover rounded-2xl shadow-md border-2 border-white dark:border-gray-900" alt="Current" />
                            )}
                            <input
                                type="file"
                                {...register("image")}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-primary file:text-white hover:file:bg-primary-hover cursor-pointer"
                            />
                        </div>
                    </div>

                    <div className="pt-6">
                        <button
                            type="submit"
                            className="w-full py-5 bg-primary hover:bg-primary-hover text-white font-extrabold rounded-2xl shadow-lg shadow-primary/20 transition-all transform hover:scale-[1.02] active:scale-95 text-xl"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditIssue;
