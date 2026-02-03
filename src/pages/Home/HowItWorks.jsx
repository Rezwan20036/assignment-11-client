const steps = [
    { id: 1, title: "Report", desc: "Take a photo and describe the issue." },
    { id: 2, title: "Verify", desc: "Admins review and assign to staff." },
    { id: 3, title: "Resolve", desc: "Staff fixes the issue on site." },
    { id: 4, title: "Update", desc: "You get notified of the result." },
];

const HowItWorks = () => {
    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">How It Works</h2>
                <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">Simple steps to get things done.</p>
            </div>

            <div className="relative">
                {/* Connector Line (Desktop) */}
                <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 dark:bg-gray-700 -translate-y-1/2 z-0"></div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
                    {steps.map((step) => (
                        <div key={step.id} className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700 text-center relative group hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-10 h-10 mx-auto bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4 shadow-lg ring-4 ring-white dark:ring-gray-900">
                                {step.id}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{step.title}</h3>
                            <p className="text-gray-500 dark:text-gray-400">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
