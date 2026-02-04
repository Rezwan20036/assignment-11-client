import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { AlertCircle, CheckCircle2, Clock, Users, CreditCard, LayoutDashboard, UserPlus, BadgeCheck } from 'lucide-react';

const AdminHome = () => {
    const axiosSecure = useAxiosSecure();

    const { data: stats, isLoading } = useQuery({
        queryKey: ['admin-stats'],
        queryFn: async () => {
            const res = await axiosSecure.get('/stats/admin');
            return res.data;
        }
    });

    if (isLoading) return <div className="flex justify-center py-20"><span className="loading loading-spinner loading-lg text-primary"></span></div>;

    const { counts, latestIssues, latestPayments, latestUsers } = stats;

    const issueDistribution = [
        { name: 'Pending', value: counts.pendingIssues, color: '#f59e0b' },
        { name: 'Resolved', value: counts.resolvedIssues, color: '#22c55e' },
        { name: 'Closed', value: counts.closedIssues, color: '#64748b' },
    ];

    const cards = [
        { label: 'Total Issues', value: counts.totalIssues, icon: LayoutDashboard, color: 'from-blue-500 to-blue-600' },
        { label: 'Resolved', value: counts.resolvedIssues, icon: CheckCircle2, color: 'from-green-500 to-green-600' },
        { label: 'Pending', value: counts.pendingIssues, icon: Clock, color: 'from-amber-500 to-amber-600' },
        { label: 'Rejected (Closed)', value: counts.closedIssues, icon: AlertCircle, color: 'from-red-500 to-red-600' },
        { label: 'Total Revenue', value: `৳${counts.totalPayments}`, icon: CreditCard, color: 'from-emerald-500 to-emerald-600' },
        { label: 'Total Citizens', value: counts.totalUsers, icon: Users, color: 'from-indigo-500 to-indigo-600' },
        { label: 'Active Staff', value: counts.totalStaff, icon: UserPlus, color: 'from-purple-500 to-purple-600' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Admin Dashboard</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Overview of system status and community reports.</p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, idx) => (
                    <div key={idx} className={`bg-gradient-to-br ${card.color} p-6 rounded-2xl shadow-lg text-white transform hover:scale-[1.02] transition-all`}>
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-white/80 font-medium text-sm uppercase tracking-wider">{card.label}</p>
                                <h3 className="text-3xl font-bold mt-1">{card.value}</h3>
                            </div>
                            <card.icon className="h-8 w-8 text-white/40" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Issue Distribution Chart */}
                <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Issue Distribution</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={issueDistribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {issueDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Latest Payments List */}
                <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Recent Payments</h3>
                    <div className="space-y-4">
                        {latestPayments.map((p, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-600">
                                        <CreditCard size={18} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-white text-sm">{p.user?.name || 'Anonymous'}</p>
                                        <p className="text-xs text-gray-500">{new Date(p.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <span className="font-bold text-emerald-600">৳{p.amount}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Latest Issues List */}
                <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Latest Reports</h3>
                    <div className="space-y-4">
                        {latestIssues.map((issue, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
                                <div>
                                    <p className="font-bold text-gray-900 dark:text-white text-sm">{issue.title}</p>
                                    <p className="text-xs text-gray-500">By {issue.reporter?.name} • {issue.category}</p>
                                </div>
                                <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${issue.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                                    issue.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'
                                    }`}>
                                    {issue.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Latest Registered Users */}
                <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Newly Joined Citizens</h3>
                    <div className="space-y-4">
                        {latestUsers.map((user, idx) => (
                            <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
                                <img src={user.photo || 'https://via.placeholder.com/40'} className="w-10 h-10 rounded-xl object-cover" alt="" />
                                <div>
                                    <p className="font-bold text-gray-900 dark:text-white text-sm">{user.name}</p>
                                    <p className="text-xs text-gray-500">{user.email}</p>
                                </div>
                                {user.isPremium && <span className="ml-auto text-green-500"><BadgeCheck className="w-6 h-6" /></span>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminHome;
