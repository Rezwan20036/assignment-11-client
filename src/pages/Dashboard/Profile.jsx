import { useContext, useState } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import { useForm } from "react-hook-form";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { imageUpload } from "../../utils/imageUpload";
import Swal from "sweetalert2";
import { Camera, ShieldCheck, User as UserIcon, Mail, Laptop, BadgeCheck, Loader2, AlertCircle, Lock } from "lucide-react";
import { updatePassword } from "firebase/auth";

const Profile = () => {
    const { user, dbUser, role, setDbUser, updateUserProfile } = useContext(AuthContext);
    const { register, handleSubmit, reset } = useForm();
    const axiosSecure = useAxiosSecure();
    const [isUploading, setIsUploading] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const imageData = await imageUpload(file);
            const newPhotoURL = imageData.data.display_url;

            // 1. Update Firebase
            await updateUserProfile(user.displayName, newPhotoURL);

            // 2. Update MongoDB
            const res = await axiosSecure.patch(`/users/update`, { email: user.email, photo: newPhotoURL });

            if (res.data) {
                setDbUser(res.data);
                Swal.fire({
                    title: 'Profile Updated!',
                    text: 'Your profile picture has been changed successfully.',
                    icon: 'success',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000
                });
            }
        } catch (err) {
            Swal.fire('Error', 'Failed to update profile picture', 'error');
        } finally {
            setIsUploading(false);
        }
    };

    const onUpdateProfile = async (data) => {
        setIsUpdating(true);
        try {
            // 1. Update Password if provided
            if (data.newPassword) {
                try {
                    await updatePassword(user, data.newPassword);
                } catch (passErr) {
                    if (passErr.code === 'auth/requires-recent-login') {
                        setIsUpdating(false);
                        return Swal.fire({
                            title: 'Login Required',
                            text: 'This action requires a recent login. Please logout and login again to change your password.',
                            icon: 'warning'
                        });
                    }
                    throw passErr;
                }
            }

            // 2. Update Firebase Profile (only name is stored in Firebase profile)
            await updateUserProfile(data.name, user.photoURL);

            // 3. Update MongoDB
            const res = await axiosSecure.patch(`/users/update`, {
                email: user.email,
                name: data.name,
                phone: data.phone
            });

            if (res.data) {
                setDbUser(res.data);
                Swal.fire('Success', 'Profile updated successfully', 'success');
                reset({ ...data, newPassword: '' }); // Clear password field
            }
        } catch (err) {
            console.error(err);
            Swal.fire('Error', 'Failed to update profile info', 'error');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleSubscribe = () => {
        if (dbUser?.isBlocked) return Swal.fire('Error', 'Your account is blocked', 'error');
        Swal.fire({
            title: 'Welcome to Premium!',
            text: "Upgrade for 1000tk to get priority support, unlimited reports, and a special badge.",
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Pay 1000tk',
            confirmButtonColor: '#22c55e',
            cancelButtonColor: '#64748b'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // 1. Update User Status
                    const res = await axiosSecure.patch(`/users/make-premium`, { email: user.email });

                    if (res.data) {
                        // 2. Create Payment Record
                        await axiosSecure.post('/payments', {
                            user: dbUser._id,
                            amount: 1000,
                            transactionId: `SUB-${Date.now()}`,
                            type: 'subscription'
                        });

                        setDbUser(res.data);
                        Swal.fire({
                            title: 'Congratulations!',
                            text: 'You are now a Premium Member!',
                            icon: 'success',
                            confirmButtonColor: '#22c55e'
                        });
                    }
                } catch (err) {
                    Swal.fire('Error', 'Payment failed or server error', 'error');
                }
            }
        });
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800 transition-all duration-300">
                {/* Blocked Warning */}
                {dbUser?.isBlocked && (
                    <div className="bg-red-500 text-white px-8 py-3 flex items-center gap-3 font-bold animate-pulse">
                        <AlertCircle className="w-6 h-6" />
                        Account Blocked: You cannot perform any actions. Please contact the authorities to resolve this issue.
                    </div>
                )}

                {/* Banner */}
                <div className="bg-primary h-48 relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>

                <div className="px-8 pb-10">
                    <div className="relative -top-20 flex flex-col md:flex-row justify-between items-center md:items-end gap-6 text-center md:text-left">
                        {/* Profile Photo with Upload Trigger */}
                        <div className="relative group">
                            <div className="w-40 h-40 rounded-3xl border-[6px] border-white dark:border-gray-900 shadow-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 relative">
                                {isUploading ? (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white z-10 backdrop-blur-sm">
                                        <Loader2 className="w-8 h-8 animate-spin" />
                                    </div>
                                ) : null}
                                <img
                                    src={dbUser?.photo || user?.photoURL || 'https://i.ibb.co/5GzXkwq/user.png'}
                                    alt="Profile"
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                {!dbUser?.isBlocked && (
                                    <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity duration-300">
                                        <div className="text-white flex flex-col items-center">
                                            <Camera className="w-8 h-8 mb-1" />
                                            <span className="text-xs font-bold uppercase tracking-wider">Change Photo</span>
                                        </div>
                                        <input type="file" onChange={handleImageChange} className="hidden" accept="image/*" disabled={isUploading} />
                                    </label>
                                )}
                            </div>
                        </div>

                        {/* Status/Badge Area */}
                        <div className="mb-4">
                            {dbUser?.isPremium ? (
                                <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-6 py-2.5 rounded-2xl border border-amber-200 dark:border-amber-800/50 flex items-center gap-2 font-bold shadow-sm">
                                    <BadgeCheck className="w-6 h-6" /> Premium Member
                                </div>
                            ) : role === 'citizen' ? (
                                <button
                                    onClick={handleSubscribe}
                                    disabled={dbUser?.isBlocked}
                                    className={`px-8 py-3 font-bold rounded-2xl shadow-lg transition-all transform hover:scale-105 active:scale-95 ${dbUser?.isBlocked ? 'bg-gray-400 cursor-not-allowed text-white' : 'bg-primary hover:bg-primary-hover text-white shadow-primary/20'}`}
                                >
                                    Upgrade to Premium
                                </button>
                            ) : null}
                        </div>
                    </div>

                    {/* Basic Info */}
                    <div className="mt-[-2rem] md:mt-2">
                        <div className="flex flex-col md:flex-row items-center md:items-baseline gap-3">
                            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                                {dbUser?.name || user?.displayName}
                            </h2>
                        </div>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4 text-gray-500 dark:text-gray-400 font-medium">
                            <span className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-sm">
                                <Mail className="w-4 h-4 text-primary" /> {user?.email}
                            </span>
                            <span className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-sm">
                                <Laptop className="w-4 h-4 text-primary" /> {role || 'Citizen'}
                            </span>
                        </div>
                    </div>

                    {/* Form Section */}
                    <div className="mt-12 pt-10 border-t border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <UserIcon className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Settings</h3>
                        </div>

                        <form onSubmit={handleSubmit(onUpdateProfile)} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider ml-1">Full Name</label>
                                    <input
                                        type="text"
                                        {...register("name", { required: true })}
                                        defaultValue={dbUser?.name || user?.displayName}
                                        className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border-0 rounded-2xl focus:ring-2 focus:ring-primary dark:text-white transition-all outline-none text-lg font-medium"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider ml-1">Phone Number</label>
                                    <input
                                        type="text"
                                        {...register("phone")}
                                        defaultValue={dbUser?.phone}
                                        placeholder="Add your contact number"
                                        className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border-0 rounded-2xl focus:ring-2 focus:ring-primary dark:text-white transition-all outline-none text-lg font-medium"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider ml-1">Email (Primary)</label>
                                    <input
                                        type="email"
                                        value={user?.email}
                                        disabled
                                        className="w-full px-5 py-4 bg-gray-100 dark:bg-gray-800/50 border-0 rounded-2xl text-gray-400 dark:text-gray-500 cursor-not-allowed text-lg font-medium"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider ml-1">Change Password (Optional)</label>
                                    <div className="relative">
                                        <Lock size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="password"
                                            {...register("newPassword")}
                                            placeholder="Leave blank to keep current"
                                            className="w-full pl-12 pr-5 py-4 bg-gray-50 dark:bg-gray-800 border-0 rounded-2xl focus:ring-2 focus:ring-primary dark:text-white transition-all outline-none text-lg font-medium"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-start">
                                <button
                                    type="submit"
                                    disabled={isUpdating || dbUser?.isBlocked}
                                    className={`px-10 py-4 font-bold rounded-2xl transition-all flex items-center gap-3 disabled:opacity-50 ${dbUser?.isBlocked ? 'bg-gray-400 cursor-not-allowed text-white' : 'bg-gray-900 dark:bg-white text-white dark:text-black hover:scale-105 active:scale-95'}`}
                                >
                                    {isUpdating ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                                    Save Profile Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
