import { useContext } from "react";
import { AuthContext } from "../../../providers/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { AlertCircle, CheckCircle2, Clock, LayoutDashboard, CreditCard, Ban } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const CitizenHome = () => {
    const { user, dbUser, role } = useContext(AuthContext);
    const axiosPublic = useAxiosPublic();
    const axiosSecure = useAxiosSecure();

    const { data: issues = [], isLoading: issuesLoading } = useQuery({
        queryKey: ['citizen-stats', dbUser?._id],
        enabled: !!dbUser?._id,
        queryFn: async () => {
            const res = await axiosPublic.get(`/issues?reporter=${dbUser._id}&limit=100`);
            return res.data.issues;
        }
    });

    const { data: payments = [], isLoading: paymentsLoading } = useQuery({
        queryKey: ['citizen-payments', dbUser?._id],
        enabled: !!dbUser?._id,
        queryFn: async () => {
            const res = await axiosSecure.get(`/payments/user/${dbUser._id}`);
            return res.data;
        }
    });

    const stats = {
        total: issues.length,
        resolved: issues.filter(i => i.status === 'Resolved').length,
        pending: issues.filter(i => i.status === 'Pending').length,
        inProgress: issues.filter(i => i.status === 'In-Progress').length,
        closed: issues.filter(i => i.status === 'Closed').length,
        totalPayments: payments.reduce((acc, curr) => acc + curr.amount, 0)
    };

    const statusData = [
        { name: 'Pending', value: stats.pending, color: '#f59e0b' },
        { name: 'In Progress', value: stats.inProgress, color: '#6366f1' },
        { name: 'Resolved', value: stats.resolved, color: '#22c55e' },
        { name: 'Closed', value: stats.closed, color: '#64748b' },
    ].filter(d => d.value > 0);

    const categoryCounts = issues.reduce((acc, curr) => {
        acc[curr.category] = (acc[curr.category] || 0) + 1;
        return acc;
    }, {});

    const categoryData = Object.keys(categoryCounts).map(cat => ({
        name: cat,
        count: categoryCounts[cat]
    }));

    if (issuesLoading || paymentsLoading) return <div className="flex justify-center py-20"><span className="loading loading-spinner loading-lg text-primary"></span></div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {dbUser?.isBlocked && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-2xl flex items-center gap-4 text-red-700 dark:text-red-400">
                    <Ban size={24} />
                    <div>
                        <p className="font-bold">Your account is currently blocked.</p>
                        <p className="text-sm opacity-90">Please contact the authorities to resolve this issue. You cannot report or edit issues while blocked.</p>
                    </div>
                </div>
            )}

            <div>
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                    Welcome Back, <span className="text-primary">{user?.displayName?.split(' ')[0] || 'Citizen'}</span>!
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Here's your personal infrastructure monitoring dashboard.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-5">
                    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <LayoutDashboard size={24} />
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Reports</h3>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.total}</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-5">
                    <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 rounded-xl flex items-center justify-center text-amber-600 dark:text-amber-400">
                        <Clock size={24} />
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending</h3>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.pending}</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-5">
                    <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                        <AlertCircle size={24} />
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Active</h3>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.inProgress}</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-5">
                    <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center justify-center text-green-600 dark:text-green-400">
                        <CheckCircle2 size={24} />
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Resolved</h3>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.resolved}</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-5">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-400">
                        <Ban size={24} />
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Closed</h3>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.closed}</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-5">
                    <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                        <CreditCard size={24} />
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Payments</h3>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">৳{stats.totalPayments}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Status Chart */}
                <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Issue Status Distribution</h3>
                    <div className="h-64">
                        {statusData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={statusData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {statusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-500">No data available</div>
                        )}
                    </div>
                </div>

                {/* Category Chart */}
                <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Issues by Category</h3>
                    <div className="h-64">
                        {categoryData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={categoryData}>
                                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip />
                                    <Bar dataKey="count" fill="#22c55e" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-500">No data available</div>
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-primary/5 dark:bg-primary/10 rounded-3xl p-8 border border-primary/10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Have a new issue to report?</h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Help us improve the infrastructure by reporting problems you see.</p>
                </div>
                <button
                    disabled={dbUser?.isBlocked}
                    onClick={() => window.location.href = '/citizen/report-issue'}
                    className={`px-8 py-3 rounded-xl font-bold shadow-lg transition-all transform hover:scale-105 ${dbUser?.isBlocked ? 'bg-gray-400 cursor-not-allowed text-white' : 'bg-primary hover:bg-primary-hover text-white shadow-primary/20'}`}
                >
                    Report Now
                </button>
            </div>
        </div>
    );
};

export default CitizenHome;
