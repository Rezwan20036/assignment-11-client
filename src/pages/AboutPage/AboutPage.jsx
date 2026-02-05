import { Target, Eye, Heart, Globe, Building2, ShieldCheck, Users2, Landmark } from "lucide-react";

const AboutPage = () => {
    const values = [
        {
            title: "Transparency",
            description: "We believe in a city where every action taken by the administration is visible and trackable by the citizens.",
            icon: Eye,
            color: "text-blue-600"
        },
        {
            title: "Accountability",
            description: "By creating a direct link between reporting and staff assignment, we ensure every issue is answered for.",
            icon: ShieldCheck,
            color: "text-green-600"
        },
        {
            title: "Efficiency",
            description: "Modernizing urban maintenance through smart routing and prioritization saves time, money, and stress.",
            icon: Target,
            color: "text-amber-600"
        },
        {
            title: "Community",
            description: "At its heart, InfraReport is about people caring for the places they live and the neighbors they share them with.",
            icon: Heart,
            color: "text-red-500"
        }
    ];

    const stats = [
        { label: "Issues Resolved", value: "2,500+" },
        { label: "Active Citizens", value: "10k+" },
        { label: "City Partners", value: "15" },
        { label: "Avg. Resolution Time", value: "48h" }
    ];

    return (
        <div className="min-h-screen pt-20 pb-20 animate-in fade-in duration-700">
            {/* Hero / Header */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="flex-1 text-center lg:text-left">
                        <span className="text-primary font-black uppercase tracking-[0.3em] text-sm mb-4 block">Our Mission</span>
                        <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white mb-8 tracking-tighter leading-tight">
                            Building the <span className="text-primary">Digital Foundation</span> of Urban Harmony
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl">
                            InfraReport isn't just a reporting tool; it's a bridge. We started with a simple idea: that every citizen should have the voice and the power to improve their neighborhood with just a few clicks.
                        </p>
                    </div>
                    <div className="flex-1 relative">
                        <div className="absolute -inset-4 bg-primary/20 rounded-[4rem] blur-3xl"></div>
                        <img
                            src="https://i.ibb.co.com/G4sT4V5X/looking-clean-cities-parks-flat-600nw-2355235719.jpg"
                            alt="City Vision"
                            className="relative rounded-[4rem] shadow-2xl object-cover w-full h-[500px]"
                        />
                    </div>
                </div>
            </div>

            {/* Stats Block */}
            <div className="bg-primary py-20 mb-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
                        {stats.map((s, i) => (
                            <div key={i} className="text-center text-white">
                                <div className="text-5xl font-black mb-2 tracking-tighter">{s.value}</div>
                                <div className="text-primary-foreground/70 font-bold uppercase tracking-widest text-xs">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Core Values */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-4">The Values We Code By</h2>
                    <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">Every line of code and every feature we build is guided by these four fundamental principles.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {values.map((v, i) => (
                        <div key={i} className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all group">
                            <div className={`w-14 h-14 bg-gray-50 dark:bg-gray-900 rounded-2xl flex items-center justify-center ${v.color} mb-6 group-hover:scale-110 transition-transform`}>
                                <v.icon size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-tighter">{v.title}</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed font-medium">
                                {v.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Vision Quote / Story */}
            <div className="max-w-5xl mx-auto px-4 mb-24">
                <div className="relative p-12 md:p-24 bg-gray-900 dark:bg-gray-950 rounded-[4rem] text-center overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10">
                        <Globe className="w-full h-full text-white" />
                    </div>
                    <div className="relative z-10">
                        <h2 className="text-white text-3xl md:text-5xl font-black italic tracking-tighter mb-8 leading-tight">
                            "Our vision is to see every city in the world run with the efficiency of a high-performance system, powered by the hearts of those who live in it."
                        </h2>
                        <div className="flex items-center justify-center gap-4 text-white/60">
                            <div className="w-12 h-px bg-white/20"></div>
                            <span className="font-black uppercase tracking-[0.2em] text-xs">The InfraReport Team</span>
                            <div className="w-12 h-px bg-white/20"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Partners / Institutional Support */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pb-20">
                <h3 className="text-xs font-black uppercase tracking-[0.4em] text-gray-400 mb-12">Trusted By Local Governments</h3>
                <div className="flex flex-wrap justify-center gap-12 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
                    <Building2 size={40} />
                    <Landmark size={40} />
                    <Users2 size={40} />
                    <ShieldCheck size={40} />
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
