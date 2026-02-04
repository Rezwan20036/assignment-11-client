import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoiceDocument from "../../../components/Documents/InvoiceDocument";
import { useState } from "react";
import { Search, Filter, CreditCard, Download, BarChart2, Loader2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const Payments = () => {
    const axiosSecure = useAxiosSecure();
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("");

    const { data: payments = [], isLoading } = useQuery({
        queryKey: ['admin-payments'],
        queryFn: async () => {
            const res = await axiosSecure.get('/payments');
            return res.data;
        }
    });

    const filteredPayments = payments.filter(p => {
        const matchesSearch = p.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === "" || p.type === filterType;
        return matchesSearch && matchesType;
    });

    // Prepare chart data (Revenue by Month)
    const monthlyData = payments.reduce((acc, p) => {
        const month = new Date(p.createdAt).toLocaleString('default', { month: 'short' });
        acc[month] = (acc[month] || 0) + p.amount;
        return acc;
    }, {});

    const chartData = Object.keys(monthlyData).map(month => ({
        month,
        revenue: monthlyData[month]
    }));

    if (isLoading) return <div className="flex justify-center py-20"><span className="loading loading-spinner loading-lg text-primary"></span></div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Transaction Ledger</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Detailed history of all system revenue and payments.</p>
            </div>

            {/* Stats & Chart Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-2 mb-6">
                        <BarChart2 className="text-emerald-500" size={24} />
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Revenue Performance</h3>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    cursor={{ fill: '#F3F4F6' }}
                                />
                                <Bar dataKey="revenue" fill="#10b981" radius={[8, 8, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-8 rounded-3xl shadow-lg text-white flex flex-col justify-center">
                    <CreditCard className="mb-4 opacity-50" size={48} />
                    <p className="text-emerald-100 font-medium uppercase tracking-widest text-sm">Total Gross Volume</p>
                    <h3 className="text-5xl font-black mt-2">৳{payments.reduce((sum, p) => sum + p.amount, 0)}</h3>
                    <div className="mt-8 pt-6 border-t border-white/20">
                        <p className="text-sm text-emerald-100 italic">Across {payments.length} successful transactions</p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by Transaction ID or Payer Name..."
                        className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm dark:text-white transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 bg-white dark:bg-gray-900 px-4 py-2 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm">
                    <Filter className="text-gray-400" size={18} />
                    <select
                        className="bg-transparent focus:ring-0 outline-none text-sm font-bold text-gray-700 dark:text-gray-300"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                    >
                        <option value="">All Types</option>
                        <option value="subscription">Subscription</option>
                        <option value="boost">Issue Boost</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-800/50">
                                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Transaction</th>
                                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Payer</th>
                                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest text-center">Type</th>
                                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Amount</th>
                                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Date</th>
                                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Invoice</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {filteredPayments.map(payment => (
                                <tr key={payment._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-lg">
                                            #{payment.transactionId}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-gray-900 dark:text-white uppercase text-xs">{payment.user?.name || 'Anonymous'}</div>
                                        <div className="text-[10px] text-gray-500">{payment.user?.email || 'N/A'}</div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${payment.type === 'subscription'
                                            ? 'bg-purple-100 text-purple-700 border-purple-200'
                                            : 'bg-amber-100 text-amber-700 border-amber-200'
                                            }`}>
                                            {payment.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-black text-emerald-600">৳{payment.amount}</span>
                                    </td>
                                    <td className="px-6 py-4 text-xs font-medium text-gray-500">
                                        {new Date(payment.createdAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <PDFDownloadLink document={<InvoiceDocument payment={payment} />} fileName={`invoice-${payment.transactionId}.pdf`}>
                                            {({ loading }) =>
                                                loading ? <Loader2 className="animate-spin text-gray-400" size={16} /> : (
                                                    <button className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all" title="Download PDF Invoice">
                                                        <Download size={18} />
                                                    </button>
                                                )
                                            }
                                        </PDFDownloadLink>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Payments;
