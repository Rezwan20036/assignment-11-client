const testimonials = [
    {
        id: 1,
        content: "I reported a broken streetlight and it was fixed in 2 days! Amazing service.",
        author: "Light Yagami",
        role: "Resident"
    },
    {
        id: 2,
        content: "Finally a way to track what the city is actually working on. Very transparent.",
        author: "Senku Ishigami",
        role: "Local Business Owner"
    },
    {
        id: 3,
        content: "The upvote feature is great. It helps prioritize the real urgent issues.",
        author: "Suika",
        role: "Teacher"
    }
];

const Testimonials = () => {
    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">Citizen Voices</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((t) => (
                    <div key={t.id} className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border-t-4 border-green-500">
                        <p className="text-gray-600 dark:text-gray-300 italic mb-6">"{t.content}"</p>
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500 mr-3">
                                {t.author.charAt(0)}
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 dark:text-white">{t.author}</h4>
                                <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">{t.role}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Testimonials;
