import React, { useState, useRef, useEffect } from "react";
import { Github, CircleUser } from "lucide-react";
import Rightbar from "./rightsidemenu";

const Header = () => {
    const [isRightbarOpen, setIsRightbarOpen] = useState(false);
    const wrapperRef = useRef(null);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setIsRightbarOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="w-full px-6 py-3 flex items-center justify-between bg-white/70 backdrop-blur-md shadow-sm border-b fixed h-20">

            {/* Logo */}
            <div className="flex items-center gap-2">
                <span className="text-3xl">🎨</span>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                    Sketch<span className="text-blue-600">Wave</span>
                </h1>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">

                {/* GitHub */}
                <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full hover:bg-gray-100 transition"
                >
                    <Github size={22} />
                </a>

                {/* Sign In */}
                <button className="px-5 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 active:scale-95 transition-all shadow-sm">
                    Sign In
                </button>

                {/* Avatar + Dropdown */}
                <div className="relative" ref={wrapperRef}>
                    <CircleUser
                        size={28}
                        className="cursor-pointer text-gray-600 hover:text-blue-600 transition"
                        onClick={() => setIsRightbarOpen((prev) => !prev)}
                    />

                    {isRightbarOpen && (
                        <div className="absolute right-0 top-10 z-50">
                            <Rightbar />
                        </div>
                    )}
                </div>

            </div>
        </header>
    );
};

export default Header;


// import { Github } from "lucide-react";
// import { CircleUser } from 'lucide-react';
// import Rightbar from "./rightsidemenu";

// const Header = () => {
//     const [isRightbarOpen, setIsRightbarOpen] = useState(false);

//     const toggleRightbar = () => {
//         setIsRightbarOpen(prev => !prev);
//     };
//     return (
//         <header className="w-full px-6 py-3 flex items-center justify-between bg-white/70 backdrop-blur-md shadow-sm border-b fixed h-20">
//             {/* Logo */}
//             <div className="flex items-center gap-2">
//                 <span className="text-3xl">🎨</span>
//                 <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
//                     Sketch<span className="text-blue-600">Wave</span>
//                 </h1>
//             </div>

//             {/* Actions */}
//             <div className="flex items-center gap-4">
//                 {/* GitHub Button */}
//                 <a
//                     href="https://github.com"
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="p-2 rounded-full hover:bg-gray-100 transition"
//                 >
//                     <Github size={22} />
//                 </a>

//                 {/* Sign In Button */}
//                 <button className="px-5 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 active:scale-95 transition-all shadow-sm">
//                     Sign In
//                 </button>

//                 <CircleUser size={22} onClick={() => toggleRightbar()} />

//                 {
//                     isRightbarOpen && (
//                         <div className="absolute">
//                             <Rightbar />
//                         </div>
//                     )
//                 }
//             </div>


//         </header>
//     );
// };

// export default Header;
