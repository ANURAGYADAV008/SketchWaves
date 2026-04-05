import { Search, Settings, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Canvas from "./canvas";
import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../Utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { setScene } from "../Utils/user";

export default function Dashboard() {
    const [boards, setBoards] = useState([])
    const scene = useSelector((store) => store.user.scene)
    const dispatch = useDispatch()
    const fetchBoards = async () => {
        try {
            const res = await axios.get(BASE_URL + "/getallBoards", { withCredentials: true });
            setBoards(res?.data?.boards);
        } catch (error) {
            console.log(error);

        }

    }

    const getBoardData = async (id) => {
        try {
            const res = await axios.get(`${BASE_URL}/getBoards/${id}`, {
                withCredentials: true
            });
            const elements = res?.data?.scene?.elements;
            dispatch(setScene(elements));
            console.log(elements);

            setTimeout(() => {
                navigate("/canvas");
            }, 4000)

        } catch (error) {
            console.log(error);

        }

    }

    useEffect(() => {
        fetchBoards()

    }, [])
    const navigate = useNavigate();
    return (
        <div className="flex h-screen bg-white text-gray-800">

            {/* Sidebar */}
            <aside className="w-64 border-r border-gray-200 p-5">
                <h2 className="text-xl font-semibold mb-6">Your boards</h2>

                <nav className="space-y-4">
                    <button className="flex items-center gap-2 text-blue-800 hover:text-green-700 font font-bold" onClick={() => navigate("/canvas")}>
                        NewBoard
                        <Plus size={25}></Plus>
                    </button>

                    <div className="space-y-2 mt-6">
                        <p className="font-medium text-blue-600">Dashboard</p>
                        <p className="text-gray-600 hover:text-black cursor-pointer">Recents</p>
                        <p className="text-gray-600 hover:text-black cursor-pointer">Shared with you</p>
                        <p className="text-gray-600 hover:text-black cursor-pointer">Templates</p>
                    </div>
                </nav>
            </aside>

            {/* Main Section */}
            <main className="flex-1 flex flex-col">

                {/* Header */}
                <header className="flex justify-between items-center border-b border-gray-200 px-8 py-4">
                    <h1 className="text-lg font-semibold">Dashboard</h1>

                    <div className="flex items-center gap-6">
                        <Search className="w-5 h-5 cursor-pointer" />
                        <Settings className="w-5 h-5 cursor-pointer" />
                        <div className="flex items-center gap-2">
                            <img
                                src="https://i.pravatar.cc/40"
                                className="w-8 h-8 rounded-full"
                            />
                            <span className="text-2xl font-mono text-blue-700">{boards[0]?.admin?.firstName || " "}</span>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <div className="p-8">

                    {/* Shared Section */}
                    <h2 className="text-lg font-semibold mb-4">Shared with you</h2>

                    <div className="grid grid-cols-3 gap-6 mb-10">
                        {boards.map((item) => (
                            <div key={item._id} className="w-64 border border-gray-200 rounded-lg overflow-hidden shadow-sm" onClick={() => getBoardData(item._id)}>
                                <div className="h-32 bg-black"></div>

                                <div className="p-4">
                                    <p className="font-medium">{item.title}</p>
                                    <p className="text-sm text-gray-500">
                                        {"created: " + item.createdAt}
                                    </p>
                                </div>


                            </div>
                        ))}
                    </div>
                </div>

                {/* Floating Button */}
                <button className="fixed bottom-8 right-8 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600" onClick={() => navigate("/canvas")}>
                    <Plus size={20} />
                </button>

            </main>
        </div>
    );
}