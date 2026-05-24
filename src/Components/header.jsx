import React, { useState, useRef, useEffect } from "react";
import { Github, CircleUser, Layers } from "lucide-react";
import Rightbar from "./rightsidemenu";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Header = () => {
    const [isRightbarOpen, setIsRightbarOpen] = useState(false);
    const wrapperRef = useRef(null);
    const user = useSelector((store) => store.user.user);
    const { firstName } = user || {};
    const navigate = useNavigate();
    console.log("Current User is", user);

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
        // <header className="w-full px-6 py-3 flex items-center justify-between bg-white/70 backdrop-blur-md shadow-sm border-none border fixed h-20">

        //     {/* Logo */}
        //     <div className="flex items-center gap-2">
        //         <span className="text-3xl"></span>
        //         <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
        //             Sketch<span className="text-blue-600">Wave</span>
        //         </h1>
        //     </div>

        //     {/* Right Actions */}
        //     <div className="flex items-center gap-5">

        //         {/* GitHub */}
        //         <a
        //             href="https://github.com"
        //             target="_blank"
        //             rel="noopener noreferrer"
        //             className="p-2 rounded-full hover:bg-gray-100 transition"
        //         >
        //             <Github size={22} />
        //         </a>

        //         {/* Auth Section */}
        //         {!user ? (
        //             <button
        //                 className="px-5 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 active:scale-95 transition-all shadow-sm"
        //                 onClick={() => navigate("/signup")}
        //             >
        //                 Sign In
        //             </button>
        //         ) : (
        //             <div className="flex items-center gap-3">

        //                 {/* Welcome Text */}
        //                 <span className="text-gray-900  hidden md:block font-semibold">
        //                     Welcome back,{" "}
        //                     <span className="text-blue-700 font-semibold">
        //                         {user.firstName || ""}
        //                     </span>
        //                 </span>

        //                 {/* Avatar */}
        //                 <div className="relative" ref={wrapperRef}>
        //                     <CircleUser
        //                         size={30}
        //                         className="cursor-pointer text-gray-600 hover:text-blue-600 transition"
        //                         onClick={() => setIsRightbarOpen((prev) => !prev)}
        //                     />

        //                     {isRightbarOpen && (
        //                         <div className="absolute right-0 top-12 z-50">
        //                             <Rightbar />
        //                         </div>
        //                     )}
        //                 </div>

        //             </div>
        //         )}
        //     </div>

        //</header>

        <nav className="fixed top-0 w-full z-50 glass-panel border-b-0 border-white/5">
    <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
      <div className="flex items-center gap-2 cursor-pointer group">
        <div className="w-8 h-8 rounded-lg bg-linear-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow">
          <Layers className="w-4 h-4 text-white" />
        </div>
        <span className="text-lg font-bold tracking-tight text-white">
          Sketch<span className="text-white/60">Wave</span>
        </span>
      </div>
      
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/60">
        <a href="#" className="hover:text-white transition-colors">Product</a>
        <a href="#" className="hover:text-white transition-colors">Features</a>
        <a href="#" className="hover:text-white transition-colors">Pricing</a>
      </div>

      <div className="flex items-center gap-4">
        <button className="hidden sm:block text-sm font-medium text-white/60 hover:text-white transition-colors">
          Log in
        </button>
        <button className="h-9 px-4 rounded-full bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors flex items-center gap-2">
          Start building
        </button>
      </div>
    </div>
  </nav>
    );
};

export default Header;


