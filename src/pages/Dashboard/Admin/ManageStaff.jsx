import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { UserPlus, Edit, Trash2, Phone, Mail, User, Loader2, Camera } from "lucide-react";
import { secondaryAuth } from "../../../firebase/adminAuth";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { imageUpload } from "../../../utils/imageUpload";
import { useState } from "react";

const ManageStaff = () => {
    // Separate forms for Add and Update
    const addForm = useForm();
    const updateForm = useForm();

    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingStaff, setEditingStaff] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

    // Fetch all staff
    const { data: staffMembers = [], isLoading } = useQuery({
        queryKey: ['manage-staff'],
        queryFn: async () => {
            const res = await axiosSecure.get('/users?role=staff');
            return res.data;
        }
    });

    const onAddSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            let photoUrl = '';
            if (data.photo?.[0]) {
                const imgData = await imageUpload(data.photo[0]);
                photoUrl = imgData.data.display_url;
            }

            // 1. Create in Firebase (Secondary Auth)
            const userCredential = await createUserWithEmailAndPassword(secondaryAuth, data.email, data.password);

            // Sync Firebase Profile (Name & Photo)
            await updateProfile(userCredential.user, {
                displayName: data.name,
                photoURL: photoUrl || 'https://i.ibb.co/5GzXkwq/user.png'
            });

            // 2. Create in DB
            const staffData = {
                name: data.name,
                email: data.email,
                phone: data.phone,
                photo: photoUrl || 'https://i.ibb.co/5GzXkwq/user.png',
                role: 'staff'
            };

            await axiosSecure.post('/users', staffData);

            Swal.fire({
                title: 'Staff Created!',
                text: 'Account has been created in both Firebase and Database.',
                icon: 'success',
                confirmButtonColor: '#15803d'
            });
            addForm.reset();
            setIsAddModalOpen(false);
            queryClient.invalidateQueries(['manage-staff']);
        } catch (error) {
            Swal.fire('Error', error.message || 'Failed to create staff member', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = (id, name) => {
        Swal.fire({
            title: 'Delete Staff?',
            text: `Are you sure you want to remove ${name}? This action cannot be undone.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Yes, Delete'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axiosSecure.delete(`/users/${id}`);
                    Swal.fire('Deleted!', 'Staff member has been removed.', 'success');
                    queryClient.invalidateQueries(['manage-staff']);
                } catch (error) {
                    Swal.fire('Error', 'Failed to delete staff member', 'error');
                }
            }
        });
    };

    const handleUpdateClick = (staff) => {
        setEditingStaff(staff);
        updateForm.reset({
            name: staff.name,
            phone: staff.phone
        });
        setIsUpdateModalOpen(true);
    };

    const onUpdateSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            const updateData = {
                email: editingStaff.email, // Key for update
                name: data.name,
                phone: data.phone
            };

            await axiosSecure.patch('/users/update', updateData);
            Swal.fire('Success', 'Staff information updated', 'success');
            setIsUpdateModalOpen(false);
            queryClient.invalidateQueries(['manage-staff']);
            setEditingStaff(null);
            updateForm.reset();
        } catch (error) {
            Swal.fire('Error', 'Update failed', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" size={40} /></div>;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Staff Management</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Control and monitor your staff members.</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-green-700/20 transition-all transform hover:scale-105"
                >
                    <UserPlus size={20} />
                    Add Staff Member
                </button>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-800/50">
                                <th className="px-6 py-4 text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Staff Details</th>
                                <th className="px-6 py-4 text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Contact Info</th>
                                <th className="px-6 py-4 text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Joined Date</th>
                                <th className="px-6 py-4 text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {staffMembers.map(staff => (
                                <tr key={staff._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <img src={staff.photo || 'https://i.ibb.co/5GzXkwq/user.png'} className="w-12 h-12 rounded-xl object-cover shadow-sm" alt="" />
                                            <div>
                                                <div className="font-bold text-gray-900 dark:text-white">{staff.name}</div>
                                                <div className="text-xs text-primary font-bold uppercase tracking-widest">{staff.role}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                            <Mail size={14} className="text-gray-400" /> {staff.email}
                                        </div>
                                        <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                                            <Phone size={14} className="text-gray-400" /> {staff.phone || 'N/A'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(staff.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleUpdateClick(staff)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all"
                                                title="Update Details"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(staff._id, staff.name)}
                                                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                                                title="Delete Staff"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Staff Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)}></div>
                    <div className="bg-white dark:bg-gray-900 overflow-hidden max-w-xl w-full rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 relative z-10 animate-in fade-in zoom-in duration-300">
                        {/* Modal Header */}
                        <div className="bg-gray-50 dark:bg-gray-800/50 px-8 py-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center text-green-700">
                                    <UserPlus size={20} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">New Staff Member</h3>
                                    <p className="text-xs text-gray-500">Create employee credentials</p>
                                </div>
                            </div>
                            <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-500 font-bold">✕</button>
                        </div>

                        <form onSubmit={addForm.handleSubmit(onAddSubmit)} className="p-8 space-y-6 max-h-[80vh] overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                                    <div className="relative">
                                        <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input {...addForm.register("name")} placeholder="e.g. Rezwan Islam" className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-0 rounded-2xl focus:ring-2 focus:ring-green-500 dark:text-white transition-all outline-none border border-transparent shadow-sm" required />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Phone Number</label>
                                    <div className="relative">
                                        <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input {...addForm.register("phone")} placeholder="01XXX-XXXXXX" className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-0 rounded-2xl focus:ring-2 focus:ring-green-500 dark:text-white transition-all outline-none border border-transparent shadow-sm" required />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
                                <div className="relative">
                                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input {...addForm.register("email")} type="email" placeholder="staff@gmail.com" className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-0 rounded-2xl focus:ring-2 focus:ring-green-500 dark:text-white transition-all outline-none border border-transparent shadow-sm" required />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Temporary Password</label>
                                <input {...addForm.register("password")} type="password" placeholder="••••••••" className="w-full px-5 py-3 bg-gray-50 dark:bg-gray-800/50 border-0 rounded-2xl focus:ring-2 focus:ring-green-500 dark:text-white transition-all outline-none border border-transparent shadow-sm" required minLength={6} />
                                <p className="text-[10px] text-gray-400 italic font-medium ml-1">Minimal 6 characters required for security.</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Profile Photo</label>
                                <div className="flex items-center gap-4 p-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl bg-gray-50 dark:bg-gray-800/30">
                                    <Camera className="text-gray-400" size={32} />
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-500 mb-2">Upload a professional headshot</p>
                                        <input {...addForm.register("photo")} type="file" className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-green-100 file:text-green-700 hover:file:bg-green-200" accept="image/*" required />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-4 border border-gray-200 dark:border-gray-700 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">Cancel</button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-[2] bg-green-700 hover:bg-green-800 text-white py-4 rounded-2xl font-bold shadow-xl shadow-green-700/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <UserPlus size={20} />}
                                    Register Staff
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Update Staff Modal */}
            {isUpdateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsUpdateModalOpen(false)}></div>
                    <div className="bg-white dark:bg-gray-900 overflow-hidden max-w-md w-full rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 relative z-10 animate-in fade-in zoom-in duration-300">
                        <div className="bg-gray-50 dark:bg-gray-800/50 px-8 py-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Update Profile</h3>
                            <button onClick={() => setIsUpdateModalOpen(false)} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-500 font-bold">✕</button>
                        </div>

                        <form onSubmit={updateForm.handleSubmit(onUpdateSubmit)} className="p-8 space-y-6">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Full Name</label>
                                <input {...updateForm.register("name")} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 dark:text-white outline-none border border-transparent shadow-sm" required />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Phone Number</label>
                                <input {...updateForm.register("phone")} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 dark:text-white outline-none border border-transparent shadow-sm" required />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setIsUpdateModalOpen(false)} className="flex-1 py-3 border border-gray-200 dark:border-gray-700 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">Cancel</button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-bold shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
                                >
                                    {isSubmitting && <Loader2 className="animate-spin" size={18} />}
                                    Save Updates
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageStaff;
