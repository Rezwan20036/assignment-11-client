import { useContext } from "react";
import { AuthContext } from "../../../providers/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { CheckCircle, Clock, Construction, AlertTriangle, ListTodo, LayoutDashboard } from "lucide-react";

const StaffHome = () => {
    const { user, dbUser } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();

    const { data: staffData, isLoading } = useQuery({
        queryKey: ['staff-stats', dbUser?._id],
        enabled: !!dbUser?._id,
        queryFn: async () => {
            const res = await axiosSecure.get(`/stats/staff/${dbUser._id}`);
            return res.data;
        }
    });

    if (isLoading) return <div className="flex justify-center py-20"><span className="loading loading-spinner loading-lg text-primary"></span></div>;

    const { stats, latestTasks } = staffData || { stats: {}, latestTasks: [] };

    const statusData = [
        { name: 'Pending', value: stats.pendingCount || 0, color: '#94a3b8' },
        { name: 'Working', value: stats.workingCount || 0, color: '#f59e0b' },
        { name: 'Resolved', value: stats.resolvedCount || 0, color: '#22c55e' }
    ];

    const cards = [
        { label: 'Assigned Issues', value: stats.totalAssigned, icon: LayoutDashboard, color: 'text-blue-600', bg: 'bg-blue-100' },
        { label: 'Working Issues', value: stats.workingCount, icon: Construction, color: 'text-amber-600', bg: 'bg-amber-100' },
        { label: 'Resolved Issues', value: stats.resolvedCount, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
        { label: 'Pending Issues', value: stats.pendingCount, icon: Clock, color: 'text-slate-600', bg: 'bg-slate-100' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Staff Dashboard</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your assignments and track resolution progress.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, idx) => (
                    <div key={idx} className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
                        <div className={`p-4 ${card.bg} rounded-2xl ${card.color}`}>
                            <card.icon size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{card.label}</p>
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white">{card.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Performance Chart */}
                <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Resolution Status</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                    {statusData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Today's Tasks */}
                <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-6 text-indigo-600">
                        <ListTodo size={24} />
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Active Tasks</h3>
                    </div>
                    <div className="space-y-4">
                        {latestTasks.length > 0 ? latestTasks.map((task, idx) => (
                            <div key={idx} className={`p-4 rounded-2xl border ${task.priority === 'High' ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800' : 'bg-gray-50 dark:bg-gray-700/30 border-gray-100 dark:border-gray-700'}`}>
                                <div className="flex justify-between items-start">
                                    <h4 className="font-bold text-gray-900 dark:text-white">{task.title}</h4>
                                    {task.priority === 'High' && <AlertTriangle size={16} className="text-amber-600" />}
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-xs text-gray-500">{task.category} • {task.location}</span>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg uppercase ${task.status === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                        {task.status}
                                    </span>
                                </div>
                            </div>
                        )) : (
                            <p className="text-gray-500 italic text-center py-10">No active tasks assigned.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StaffHome;
