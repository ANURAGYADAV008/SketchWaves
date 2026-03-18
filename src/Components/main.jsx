import sketchwaveImage from "../images/sketchwaves (27).png";

const Main = () => {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50 ">

            {/* HERO SECTION */}
            <main className="flex-1">
                <section className="flex flex-col md:flex-row items-center justify-between px-10 py-20 max-w-7xl mx-auto mt-20">

                    {/* LEFT */}
                    <div className="max-w-xl">
                        <h1 className="text-5xl font-bold text-blue-600 mb-4 pt-5">
                            WHITEBOARD FOR SKETCHWAVE
                        </h1>
                        <p className="text-black text-lg mb-6 pt-3 font-bold">
                            A fast and minimal whiteboard tool for drawing, brainstorming, and collaboration.
                        </p>

                        <div className="flex gap-4">
                            <button className="px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600">
                                Try Now
                            </button>
                            <button className="px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600">
                                Book Demo
                            </button>
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="mt-10 md:mt-0 ">
                        <img
                            src={sketchwaveImage}
                            alt="whiteboard preview"
                            className="rounded-2xl shadow-2xl w-[560px] h-80"
                        />
                    </div>

                </section>

                {/* FEATURES */}
                <section className="py-20 px-6">
                    <h2 className="text-4xl font-bold text-center text-blue-600 mb-12">
                        Features of SketchWave
                    </h2>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">

                        {[
                            {
                                title: "Infinite Canvas",
                                desc: "A limitless space for brainstorming and visual planning.",
                            },
                            {
                                title: "Real-time Collaboration",
                                desc: "Work together with your team instantly.",
                            },
                            {
                                title: "Custom Templates",
                                desc: "Use templates to speed up your workflow.",
                            },
                        ].map((f, i) => (
                            <div
                                key={i}
                                className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition text-center"
                            >
                                <div className="w-12 h-12 mx-auto mb-4 bg-green-500 rounded-full"></div>
                                <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                                <p className="text-gray-600">{f.desc}</p>
                            </div>
                        ))}

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