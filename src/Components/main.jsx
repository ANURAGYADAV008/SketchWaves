import sketchwaveImage from "../images/sketchwaves (27).png";
import { Check, Globe2, MousePointer2, Zap } from 'lucide-react'
//flex flex-col min-h-screen bg-black flex flex-col min-h-screen bg-black 

const Main = () => {
    return (
        <div className="flex flex-col min-h-screen bg-[#0B1120] top-10">

            {/* HERO SECTION */}
            <main className="flex-1 -mt-30">
                <section className="max-w-7xl mx-auto px-6 py-24 flex flex-col md:flex-row items-center justify-between gap-16 mt-20">

                    {/* Left Content */}
                    <div className="max-w-xl space-y-6 ml-10">

                        <h1 className="text-6xl font-extrabold leading-tight tracking-tight text-white">
                            Whiteboard for{" "}
                            <span className="bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                SketchWave
                            </span>
                        </h1>

                        <p className="text-lg text-white">
                            A fast, minimal whiteboard built for real-time collaboration and creative thinking.
                        </p>

                        {/* Buttons */}
                        <div className="flex gap-4">

                            <button className="px-7 py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-full font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                                Try Now
                            </button>

                            <button className="px-7 py-3 bg-white border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 transition">
                                Book Demo
                            </button>
                        </div>

                        {/* Trust Points */}
                        <div className="text-gray-500 text-sm mt-6 space-y-2">
                            <button className="flex flex-row  bg-transparent">
                                <Check size={20} />
                                <p className="text font-bold pl-1 text-white"> Real-time collaboration</p>
                            </button>
                            <button className="flex flex-row p-1 bg-transparent">
                                <Check size={20} />
                                <p className="text font-bold pl-1 text-white">  Infinite canvas</p>
                            </button>
                            <button className="flex flex-row p-1 bg-transparent">
                                <Check size={20} />
                                <p className="text font-bold pl-1 text-white"> Zero setup required</p>
                            </button>

                        </div>
                    </div>


                    <div className="bg-white border rounded-3xl transition-all duration-300 w-auto ml-10 mr-10 h-80 pt-5">
                        <img
                            src={sketchwaveImage}
                            alt="Sketch Preview"
                            // Removed absolute:none, changed w-140/h-70 to standard Tailwind or style dimensions
                            className="rounded-xl w-150 h-60 object-cover"
                        />
                    </div>
                </section>

                {/* 🚀 Features Section */}
                <section className="max-w-7xl mx-auto px-6 py-24 -mt-10">

                    <h2 className="text-4xl font-bold text-center mb-16 text-white">
                        Features of <span className="text-blue-600">SketchWave</span>
                    </h2>

                    <div className="grid md:grid-cols-3 gap-10 p-10">

                        {/* Card 1 */}
                        <div className="p-6 bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <Globe2 className="w-8 h-8 text-blue-600  mb-6" />
                            <h3 className="text-xl font-semibold mb-2"> Real-time Sync</h3>
                            <p className="text-gray-600">
                                Collaborate instantly with your team on a shared whiteboard.
                            </p>
                        </div>

                        {/* Card 2 */}
                        <div className="p-6 bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <MousePointer2 className="w-8 h-8 text-purple-400 mb-6" />
                            <h3 className="text-xl font-semibold mb-2"> Simple UI</h3>
                            <p className="text-gray-600">
                                Minimal interface designed for focus and productivity.
                            </p>
                        </div>

                        {/* Card 3 */}
                        <div className="glass-panel p-8 rounded-3xl border border-white/4 hover:border-white/10 transition-all duration-300 group hover:-translate-y-1 bg-gray-950">
                            <Zap className="w-8 h-8 text-emerald-400 mb-6" />
                            <h3 className="text-xl font-semibold mb-2 text-white"> Fast Performance</h3>
                            <p className="text-white/50 leading-relaxed text-sm">
                                Optimized for speed with smooth drawing experience.
                            </p>
                        </div>

                    </div>
                </section>

            </main>

            {/* FOOTER */}
            <footer className="bg-black border-t text-center py-6 text-gray-500">
                © 2026 SketchWave. All rights reserved.
            </footer>
        </div>
    );
}


export default Main;

