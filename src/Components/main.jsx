import sketchwaveImage from "../images/sketchwaves (27).png";
import { Check } from 'lucide-react'

const Main = () => {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50 ">

            {/* HERO SECTION */}
            <main className="flex-1">
                <section className="max-w-7xl mx-auto px-6 py-24 flex flex-col md:flex-row items-center justify-between gap-16 mt-20">

                    {/* Left Content */}
                    <div className="max-w-xl space-y-6">

                        <h1 className="text-6xl font-extrabold leading-tight tracking-tight">
                            Whiteboard for{" "}
                            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                SketchWave
                            </span>
                        </h1>

                        <p className="text-lg text-gray-600">
                            A fast, minimal whiteboard built for real-time collaboration and creative thinking.
                        </p>

                        {/* Buttons */}
                        <div className="flex gap-4">
                            <button className="px-7 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
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
                                <p className="text font-bold pl-1"> Real-time collaboration</p>
                            </button>
                            <button className="flex flex-row p-1 bg-transparent">
                                <Check size={20} />
                                <p className="text font-bold pl-1">  Infinite canvas</p>
                            </button>
                            <button className="flex flex-row p-1 bg-transparent">
                                <Check size={20} />
                                <p className="text font-bold pl-1"> Zero setup required</p>
                            </button>

                        </div>
                    </div>


                    <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl p-6 hover:scale-[1.02] transition-all duration-300">

                        <img
                            src={sketchwaveImage} Replace with your canvas screenshot
                            alt="Sketch Preview"
                            className="rounded-xl w-full h-80 absolute:none"
                        />

                    </div>
                </section>

                {/* 🚀 Features Section */}
                <section className="max-w-7xl mx-auto px-6 py-24">

                    <h2 className="text-4xl font-bold text-center mb-16">
                        Features of <span className="text-blue-600">SketchWave</span>
                    </h2>

                    <div className="grid md:grid-cols-3 gap-8">

                        {/* Card 1 */}
                        <div className="p-6 bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <h3 className="text-xl font-semibold mb-2"> Real-time Sync</h3>
                            <p className="text-gray-600">
                                Collaborate instantly with your team on a shared whiteboard.
                            </p>
                        </div>

                        {/* Card 2 */}
                        <div className="p-6 bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <h3 className="text-xl font-semibold mb-2"> Simple UI</h3>
                            <p className="text-gray-600">
                                Minimal interface designed for focus and productivity.
                            </p>
                        </div>

                        {/* Card 3 */}
                        <div className="p-6 bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <h3 className="text-xl font-semibold mb-2"> Fast Performance</h3>
                            <p className="text-gray-600">
                                Optimized for speed with smooth drawing experience.
                            </p>
                        </div>

                    </div>
                </section>

            </main>

            {/* FOOTER */}
            <footer className="bg-white border-t text-center py-6 text-gray-500">
                © 2026 SketchWave. All rights reserved.
            </footer>
        </div>
    );
}


export default Main;

