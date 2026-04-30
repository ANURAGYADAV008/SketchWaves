import { Share2 } from "lucide-react";
import { useState } from "react";

function LinkBox({ roomId }) {
    const [copied, setCopied] = useState(false);
    const link = `${window.location.origin}/room/${roomId}`;


    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(link);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Copy failed", err);
        }
    };

    return (
        <div className="absolute top-0 -m-3 flex items-center mt-15 bg-white">
            <input
                type="text"
                value={link}
                readOnly
                className="flex-1 px-2 py-1 border rounded text-sm"
            />
            <button
                onClick={handleCopy}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition ml-1"
            >
                {copied ? "Copied!" : "Copy"}
            </button>
        </div>
    );


}

export default function ShareBtn({ roomId }) {
    const [open, setOpen] = useState(false);


    return (
        <div className="relative">
            <button
                onClick={() => setOpen(prev => !prev)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 transition"
            >
                <Share2 size={18} />
                <span>Share</span>
            </button>

            {open && <LinkBox roomId={roomId} />}
        </div>
    );


}
