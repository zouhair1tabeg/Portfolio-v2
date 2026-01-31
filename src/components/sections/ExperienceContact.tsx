"use client";

export default function ExperienceContact() {
    return (
        <section id="contact" className="min-h-screen bg-zinc-950 text-white py-24 px-6 md:px-12 flex flex-col justify-between">

            {/* Experience */}
            <div className="max-w-4xl mx-auto w-full mb-32">
                <h2 className="text-4xl font-bold mb-12">Experience & Education</h2>
                <div className="border-l-2 border-white/10 pl-8 space-y-12">
                    <div className="relative">
                        <span className="absolute -left-[41px] top-1 w-5 h-5 bg-blue-500 rounded-full ring-4 ring-black" />
                        <h3 className="text-2xl font-bold">Technicien Spécialisé en Dev Mobile</h3>
                        <p className="text-gray-400">2023 - 2025</p>
                        <p className="mt-2 text-gray-300">Specialized training in mobile development (Flutter, Kotlin) and ecosystem.</p>
                    </div>
                    <div className="relative">
                        <span className="absolute -left-[41px] top-1 w-5 h-5 bg-zinc-700 rounded-full ring-4 ring-black" />
                        <h3 className="text-2xl font-bold">Bac Sciences Physiques (BIOF)</h3>
                        <p className="text-gray-400">2022 - 2023</p>
                    </div>
                </div>
            </div>

            {/* Contact Form */}
            <div className="max-w-xl mx-auto w-full">
                <h2 className="text-4xl md:text-6xl font-bold mb-12 text-center">Let's Talk</h2>
                <form className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <input type="text" placeholder="Name" className="bg-zinc-900 border-none rounded-lg p-4 text-white focus:ring-2 focus:ring-blue-500" />
                        <input type="email" placeholder="Email" className="bg-zinc-900 border-none rounded-lg p-4 text-white focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <textarea placeholder="Message" rows={6} className="w-full bg-zinc-900 border-none rounded-lg p-4 text-white focus:ring-2 focus:ring-blue-500"></textarea>
                    <button className="w-full py-4 bg-blue-600 rounded-lg font-bold hover:bg-blue-700 transition-colors">
                        Send Message
                    </button>
                </form>

                <div className="mt-12 flex justify-center gap-8 text-2xl">
                    <a href="mailto:tabeg.zouhair@gmail.com" className="hover:text-blue-500 transition-colors">📧</a>
                    <a href="https://github.com/zouhair1tabeg" target="_blank" className="hover:text-blue-500 transition-colors">🐙</a>
                    <a href="https://linkedin.com/in/tabeg-zouhair-8412a0344" target="_blank" className="hover:text-blue-500 transition-colors">💼</a>
                </div>
            </div>

        </section>
    );
}
