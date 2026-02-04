import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { BadgeCheck } from "lucide-react";

const ManageUsers = () => {
    const axiosSecure = useAxiosSecure();

    const { data: users = [], refetch } = useQuery({
        queryKey: ['users-citizens'],
        queryFn: async () => {
            const res = await axiosSecure.get('/users?role=citizen');
            return res.data;
        }
    });

    const handleToggleBlock = (user) => {
        Swal.fire({
            title: user.isBlocked ? 'Unblock User?' : 'Block User?',
            text: `Are you sure you want to ${user.isBlocked ? 'unblock' : 'block'} ${user.name}? This will affect their ability to report issues.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: user.isBlocked ? '#22c55e' : '#d33',
            cancelButtonColor: '#64748b',
            confirmButtonText: `Yes, ${user.isBlocked ? 'Unblock' : 'Block'}!`
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axiosSecure.patch('/users/update', {
                        email: user.email,
                        isBlocked: !user.isBlocked
                    });
                    Swal.fire(
                        'Updated!',
                        `User has been ${user.isBlocked ? 'unblocked' : 'blocked'}.`,
                        'success'
                    );
                    refetch();
                } catch (error) {
                    Swal.fire('Error', 'Failed to update user status', 'error');
                }
            }
        });
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Manage Citizens</h2>
            <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
                <table className="table w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left">Citizen</th>
                            <th className="px-6 py-3 text-left">Email</th>
                            <th className="px-6 py-3 text-left">Subscription</th>
                            <th className="px-6 py-3 text-left">Status</th>
                            <th className="px-6 py-3 text-left text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {users.map(user => (
                            <tr key={user._id} className="text-gray-900 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                <td className="px-6 py-4 flex items-center gap-3">
                                    <img src={user.photo || 'https://via.placeholder.com/40'} alt="" className="w-10 h-10 rounded-xl object-cover" />
                                    <span className="font-bold">{user.name}</span>
                                </td>
                                <td className="px-6 py-4 text-sm font-medium">{user.email}</td>
                                <td className="px-6 py-4">
                                    {user.isPremium ? (
                                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded-lg text-xs font-bold uppercase tracking-wider border border-amber-200 dark:border-amber-800">
                                            <BadgeCheck className="w-3.5 h-3.5" /> Premium
                                        </span>
                                    ) : (
                                        <span className="px-3 py-1 bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 rounded-lg text-xs font-bold uppercase tracking-wider">
                                            Basic
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    {user.isBlocked ? (
                                        <span className="px-3 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-lg text-xs font-bold uppercase tracking-wider">Blocked</span>
                                    ) : (
                                        <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-lg text-xs font-bold uppercase tracking-wider">Active</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => handleToggleBlock(user)}
                                        className={`px-4 py-2 rounded-xl text-white text-xs font-bold uppercase tracking-widest transition-all ${user.isBlocked ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700 shadow-lg shadow-red-600/20'}`}
                                    >
                                        {user.isBlocked ? 'Unblock' : 'Block User'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageUsers;
