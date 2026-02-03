import { ShieldCheck, Zap, BarChart3, Users } from "lucide-react";

const features = [
    {
        name: 'Instant Reporting',
        description: 'Snap a photo, add location, and submit directly from your phone.',
        icon: Zap,
    },
    {
        name: 'Real-time Tracking',
        description: 'Follow the process from "Pending" to "Resolved" with live updates.',
        icon: BarChart3,
    },
    {
        name: 'Community Validation',
        description: 'Upvote important issues to prioritize them for quicker resolution.',
        icon: Users,
    },
    {
        name: 'Secure & Transparent',
        description: 'All data is secure, and the resolution process is visible to everyone.',
        icon: ShieldCheck,
    },
];

const Features = () => {
    return (
        <section className="bg-gray-50 dark:bg-gray-800/50 py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">Why Use InfraReport?</h2>
                    <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">Streamlining civic engagement with modern technology.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature) => (
                        <div key={feature.name} className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700 text-center">
                            <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center text-green-700 dark:text-green-300 mb-6">
                                <feature.icon size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{feature.name}</h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
