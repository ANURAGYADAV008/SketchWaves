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
    //console.log("Current User is", user);

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
        <header className="w-full px-6 py-3 flex items-center justify-between backdrop-blur-md shadow-sm border-none border  h-20 sticky top-0 left-0 right-0 bg-[#0B1120] text-white">

            {/* Logo */}
            <div className="flex items-center gap-2">
                <Layers size={28} color="blue" />
                <span className="text-3xl"></span>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                    Sketch <span className="text-blue-600">Wave</span>
                </h1>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-5 text-white">

                {/* GitHub */}
                <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full hover:bg-gray-100 transition"
                >
                    <Github size={22} />
                </a>

                {/* Auth Section */}
                {!user ? (
                    <button
                        className="px-5 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 active:scale-95 transition-all shadow-sm"
                        onClick={() => navigate("/signup")}
                    >
                        Sign In
                    </button>
                ) : (
                    <div className="flex items-center gap-3">

                        {/* Welcome Text */}
                        <span className="text-gray-900  hidden md:block font-semibold">
                            Welcome back,{" "}
                            <span className="text-blue-700 font-semibold">
                                {user.firstName || ""}
                            </span>
                        </span>

                        {/* Avatar */}
                        <div className="relative" ref={wrapperRef}>
                            <CircleUser
                                size={30}
                                className="cursor-pointer text-gray-600 hover:text-blue-600 transition"
                                onClick={() => setIsRightbarOpen((prev) => !prev)}
                            />

                            {isRightbarOpen && (
                                <div className="absolute right-0 top-12 z-50">
                                    <Rightbar />
                                </div>
                            )}
                        </div>

                    </div>
                )}
            </div>

        </header>
    );
};

export default Header;


