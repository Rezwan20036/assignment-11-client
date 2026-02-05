import { Zap, BarChart3, Users, ShieldCheck, MapPin, Camera, Bell, PieChart, Heart, MousePointer2 } from "lucide-react";

const FeaturesPage = () => {
    const detailedFeatures = [
        {
            title: "Smart Reporting System",
            description: "Reporting a city issue has never been easier. Our intelligent system allows you to snap a photo, auto-detect location, and categorize issues in seconds.",
            icon: Zap,
            color: "text-amber-600",
            bg: "bg-amber-100 dark:bg-amber-900/30",
            details: ["AI Category Suggestion", "GPS Auto-Location", "Multi-Photo Upload"]
        },
        {
            title: "Transparent Workflow",
            description: "Know exactly what's happening with your report. Track the journey from 'Pending' through 'In-Progress' to a successful 'Resolved' status in real-time.",
            icon: BarChart3,
            color: "text-blue-600",
            bg: "bg-blue-100 dark:bg-blue-900/30",
            details: ["Live Timeline Updates", "Staff Assignment View", "Progress Snapshots"]
        },
        {
            title: "Community Upvoting",
            description: "Power to the people. Upvote the issues that matter most to your neighborhood, helping city officials prioritize urgent repairs and improvements.",
            icon: Users,
            color: "text-purple-600",
            bg: "bg-purple-100 dark:bg-purple-900/30",
            details: ["Trending Issues List", "Neighborhood Priorities", "Impact Visualization"]
        },
        {
            title: "Administrative Dashboard",
            description: "A comprehensive control center for staff and administrators to manage reports, assign specialists, and analyze city-wide performance data.",
            icon: ShieldCheck,
            color: "text-green-600",
            bg: "bg-green-100 dark:bg-green-900/30",
            details: ["Staff Performance Metrics", "Automated Routing", "Secure Data Audit"]
        }
    ];

    const microFeatures = [
        { icon: MapPin, label: "Interactive Maps" },
        { icon: Bell, label: "Smart Notifications" },
        { icon: PieChart, label: "Impact Analytics" },
        { icon: Heart, label: "Community Spirit" },
        { icon: MousePointer2, label: "One-Click Boost" },
        { icon: Camera, label: "High-Res Proof" }
    ];

    return (
        <div className="min-h-screen pt-20 pb-20 animate-in fade-in duration-700">
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-24">
                <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">
                    Empowering <span className="text-primary italic">Better Cities</span> Through Technology
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
                    InfraReport provides a comprehensive suite of tools designed to bridge the gap between citizens and city maintenance, ensuring transparency, accountability, and faster resolution.
                </p>
            </div>

            {/* Main Features Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {detailedFeatures.map((f, i) => (
                        <div key={i} className="group bg-white dark:bg-gray-800 p-10 rounded-[3rem] shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-700 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-8 -mt-8 group-hover:scale-110 transition-transform"></div>

                            <div className={`w-16 h-16 ${f.bg} rounded-3xl flex items-center justify-center ${f.color} mb-8 shadow-sm`}>
                                <f.icon size={32} />
                            </div>

                            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4 uppercase tracking-tighter">{f.title}</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed text-lg">
                                {f.description}
                            </p>

                            <ul className="space-y-3">
                                {f.details.map((d, di) => (
                                    <li key={di} className="flex items-center gap-3 text-sm font-bold text-gray-500 dark:text-gray-400">
                                        <div className={`w-1.5 h-1.5 rounded-full ${f.bg.replace('/30', '')}`}></div>
                                        {d}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Micro Features Strip */}
                <div className="bg-gray-50 dark:bg-gray-800/50 py-12 px-8 rounded-[3rem] border border-dashed border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
                        {microFeatures.map((m, i) => (
                            <div key={i} className="flex flex-col items-center gap-3 text-center group">
                                <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center text-primary shadow-sm group-hover:bg-primary group-hover:text-white transition-all">
                                    <m.icon size={20} />
                                </div>
                                <span className="text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">{m.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="max-w-5xl mx-auto px-4 mt-24 text-center">
                <div className="bg-primary/5 dark:bg-primary/10 p-16 rounded-[4rem] border border-primary/10">
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-6 uppercase tracking-tighter">Ready to Make an Impact?</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-10 text-lg">Join thousands of citizens already using InfraReport to build a better community.</p>
                    <button className="bg-primary text-white px-12 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 hover:scale-105">
                        Get Started Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FeaturesPage;
