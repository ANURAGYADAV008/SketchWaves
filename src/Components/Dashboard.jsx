import { Search, Settings, Plus, LayoutGrid, LayoutTemplate, Users, Trash2, FileEdit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../Utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { setScene, setCurrboard } from "../Utils/user";
import JoinBox from "./joinboard";
import sketchwaveImage from "../images/sketchwaves (27).png";
import dashboardImage from "../images/Screenshot (441).png"

export default function Dashboard() {
    const [boards, setBoards] = useState([]);
    const [openJoin, setOpenJoin] = useState(false);
    const [activeNav, setActiveNav] = useState("shared");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const fetchBoards = async () => {
        try {
            const res = await axios.get(BASE_URL + "/getallBoards", { withCredentials: true });
            setBoards(res?.data?.boards);
        } catch (error) {
            console.log(error);
        }
    };

    const getBoardData = async (id) => {
        try {
            const res = await axios.get(`${BASE_URL}/getBoards/${id}`, { withCredentials: true });
            const elements = res?.data?.scene?.elements;
            const boardid = res?.data?.board?._id;
            dispatch(setScene(elements));
            dispatch(setCurrboard(boardid));
            navigate(`/canvas/${boardid}`);
        } catch (error) {
            console.log(error);
        }
    };

    const handlecreateBoard = async () => {
        try {
            const res = await axios.post(BASE_URL + "/createBoard", {}, { withCredentials: true });
            //console.log(res?.message)
            const boardid = res?.data?.data?.id;
            dispatch(setCurrboard(boardid));
            // console.log("New Created Board", boardid)
            if (!boardid) return;
            dispatch(setScene(null));

            navigate(`/canvas/${boardid}`);
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteBoard = async (_id) => {
        try {
            await axios.delete(BASE_URL + "/deleteBoard" + `/${_id}`, { withCredentials: true });
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    };

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    };

    useEffect(() => {
        fetchBoards();
    }, []);

    const userName = boards[0]?.admin?.firstName || "User";
    const initials = userName.slice(0, 2).toUpperCase();

    return (
        <div className="flex h-screen bg-gray-50 text-gray-800 font-sans">

            {/* Join Modal */}
            {openJoin && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 backdrop-blur-sm">
                    <div className="relative bg-white rounded-2xl shadow-xl p-6 min-w-[340px]">
                        <JoinBox />
                        <button
                            onClick={() => setOpenJoin(false)}
                            className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 text-sm"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}

            {/* Sidebar */}
            <aside className="w-56 shrink-0 bg-#F8FAFC  border-gray-950 flex flex-col py-5 px-3">
                {/* Logo */}
                <div className="flex items-center gap-2 px-3 mb-7">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center">
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                            <path d="M3 13 Q8 3 13 13" stroke="white" strokeWidth="2" strokeLinecap="round" />
                            <path d="M5 10 Q8 6 11 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
                        </svg>
                    </div>
                    <span className="font-semibold text-sm text-gray-800 tracking-tight">Sketchwave</span>
                </div>

                {/* Nav */}
                <nav className="flex flex-col gap-0.5 flex-1">
                    {/* New Board */}
                    <div
                        className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer group"
                        onClick={handlecreateBoard}
                    >
                        <div className="flex items-center gap-2.5">
                            <LayoutGrid size={15} className="text-gray-400" />
                            <span className="text-sm text-gray-600 group-hover:text-gray-900">New board</span>
                        </div>
                        <button
                            className="w-5 h-5 flex items-center justify-center rounded border border-gray-200 text-gray-400 hover:border-gray-400 hover:text-gray-600"
                            onClick={(e) => { e.stopPropagation(); handlecreateBoard(); }}
                        >
                            <Plus size={11} />
                        </button>
                    </div>

                    {/* Join Board */}
                    <div
                        className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer group"
                        onClick={() => setOpenJoin(true)}
                    >
                        <div className="flex items-center gap-2.5">
                            <FileEdit size={15} className="text-gray-400" />
                            <span className="text-sm text-gray-600 group-hover:text-gray-900">Join board</span>
                        </div>
                        <button className="w-5 h-5 flex items-center justify-center rounded border border-gray-200 text-gray-400 hover:border-gray-400 hover:text-gray-600">
                            <Plus size={11} />
                        </button>
                    </div>

                    {/* Shared with you */}
                    <button
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-left w-full ${activeNav === "shared" ? "bg-gray-100 text-gray-900 font-medium" : "text-gray-600 hover:bg-gray-50"}`}
                        onClick={() => setActiveNav("shared")}
                    >
                        <Users size={15} className={activeNav === "shared" ? "text-emerald-600" : "text-gray-400"} />
                        <span className="text-sm">Shared with you</span>
                    </button>

                    {/* Templates */}
                    <button
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-left w-full ${activeNav === "templates" ? "bg-gray-100 text-gray-900 font-medium" : "text-gray-600 hover:bg-gray-50"}`}
                        onClick={() => setActiveNav("templates")}
                    >
                        <LayoutTemplate size={15} className={activeNav === "templates" ? "text-emerald-600" : "text-gray-400"} />
                        <span className="text-sm">Templates</span>
                    </button>
                </nav>

                {/* Bottom user hint */}
                <div className="px-3 pt-4 border-t border-gray-100 mt-2">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-[10px] font-semibold text-emerald-700">
                            {initials}
                        </div>
                        <span className="text-xs text-gray-500 truncate">{userName}</span>
                    </div>
                </div>
            </aside>

            {/* Main */}
            <main className="flex-1 flex flex-col overflow-hidden">

                {/* Topbar */}
                <header className="flex justify-between items-center bg-white border-b border-gray-100 px-7 py-3.5 shrink-0">
                    <h1 className="text-base font-semibold text-gray-800">Dashboard</h1>
                    <div className="flex items-center gap-3">
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50">
                            <Search size={14} className="text-gray-500" />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50">
                            <Settings size={14} className="text-gray-500" />
                        </button>
                        <div className="flex items-center gap-2 pl-2 border-l border-gray-100">
                            <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-[11px] font-semibold text-emerald-700">
                                {initials}
                            </div>
                            <span className="text-sm font-medium text-emerald-600">{userName}</span>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-7">

                    {/* Section label */}
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-4">
                        Shared with you
                    </p>

                    {/* Board grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">

                        {boards.map((item) => (
                            <div
                                key={item._id}
                                className="group bg-white border shadow-gray-400 rounded-xl overflow-hidden hover:border-gray-300 hover:shadow-sm transition-all duration-150 "
                            >
                                {/* Thumbnail */}
                                <div
                                    className="h-32 bg-gray-50 flex items-center justify-center cursor-pointer relative overflow-hidden"
                                    onClick={() => getBoardData(item._id)}
                                >
                                    {/* Placeholder canvas preview */}
                                    <img src={dashboardImage}
                                        className="w-fit mt-10"
                                    >
                                    </img>
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
                                        <span className="opacity-0 group-hover:opacity-100 text-xs font-medium text-gray-600 bg-white/90 px-3 py-1 rounded-full border border-gray-200 transition-opacity">
                                            Open
                                        </span>
                                    </div>
                                </div>

                                {/* Card footer */}
                                <div className="px-3.5 py-3 flex items-center justify-between border-t border-gray-100">
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-gray-800 truncate">{item.title || "Untitled Board"}</p>
                                        <p className="text-[11px] text-gray-400 mt-0.5">{formatDate(item.createdAt)}</p>
                                    </div>
                                    <button
                                        className="w-7 h-7 shrink-0 flex items-center justify-center rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors ml-2"
                                        onClick={() => handleDeleteBoard(item._id)}
                                    >
                                        <Trash2 size={13} />
                                    </button>
                                </div>
                            </div>
                        ))}

                        {/* New board card */}
                        <div
                            className="border border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-2 h-[180px] cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/40 transition-all group"
                            onClick={() => handlecreateBoard()}
                        >
                            <div className="w-8 h-8 rounded-full border border-gray-300 group-hover:border-emerald-400 flex items-center justify-center text-gray-400 group-hover:text-emerald-600 transition-colors">
                                <Plus size={16} />
                            </div>
                            <span className="text-xs text-gray-400 group-hover:text-emerald-600 transition-colors">New board</span>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}