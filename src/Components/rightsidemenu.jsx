import React, { useState } from "react";
import { LayoutDashboard, LogOut, ChevronRight, User, Store } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../Utils/constant";
import { setUser } from "../Utils/user";
import { useDispatch, useSelector } from "react-redux";

const Rightbar = () => {
  const [active, setActive] = useState("canvas");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((Store) => Store.user.user);
  const { firstName } = user
  const handleLogOut = async () => {
    try {
      const res = await axios.post(BASE_URL + "/logout", { withCredentials: true });
      dispatch(setUser(null));
      navigate("/");

    } catch (error) {
      console.error(error.message)
    }

  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

        .rb-wrap {
          font-family: 'Inter', sans-serif;
          width: 210px;
          background: #ffffff;
          border: 1px solid #ececec;
          border-radius: 14px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.10), 0 1.5px 4px rgba(0,0,0,0.04);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: rb-in 0.18s cubic-bezier(0.16,1,0.3,1);
          transform-origin: top right;
        }

        @keyframes rb-in {
          from { opacity: 0; transform: scale(0.95) translateY(-6px); }
          to   { opacity: 1; transform: scale(1)    translateY(0); }
        }

        /* ── Profile strip ── */
        .rb-profile {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 14px 12px;
        }

        .rb-avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6d28d9, #db2777);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: #fff;
        }

        .rb-name {
          font-size: 0.82rem;
          font-weight: 600;
          color: #111;
          line-height: 1.2;
        }

        .rb-email {
          font-size: 0.72rem;
          color: #9ca3af;
          line-height: 1.2;
        }

        /* ── Divider ── */
        .rb-divider {
          height: 1px;
          background: #f3f4f6;
          margin: 0;
        }

        /* ── Menu ── */
        .rb-menu {
          padding: 6px;
          display: flex;
          flex-direction: column;
          gap: 1px;
        }

        .rb-item {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 8px 10px;
          border-radius: 9px;
          border: none;
          background: transparent;
          cursor: pointer;
          width: 100%;
          font-family: 'Inter', sans-serif;
          font-size: 0.82rem;
          font-weight: 500;
          color: #374151;
          transition: background 0.15s ease, color 0.15s ease;
          text-align: left;
        }

        .rb-item.active {
          background: #f3f0ff;
          color: #6d28d9;
        }

        .rb-item:not(.active):hover {
          background: #f9fafb;
          color: #111;
        }

        .rb-chevron {
          margin-left: auto;
          color: #6d28d9;
          opacity: 0;
          transition: opacity 0.15s ease, transform 0.15s ease;
          flex-shrink: 0;
        }

        .rb-item.active .rb-chevron,
        .rb-item:hover .rb-chevron {
          opacity: 1;
          transform: translateX(2px);
        }

        /* ── Footer ── */
        .rb-footer {
          padding: 6px;
          padding-top: 0;
        }

        .rb-logout {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 8px 10px;
          border-radius: 9px;
          border: none;
          background: transparent;
          cursor: pointer;
          width: 100%;
          font-family: 'Inter', sans-serif;
          font-size: 0.82rem;
          font-weight: 500;
          color: #9ca3af;
          transition: background 0.15s ease, color 0.15s ease;
          text-align: left;
        }

        .rb-logout:hover {
          background: #fff1f2;
          color: #ef4444;
        }
      `}</style>

      <div className="rb-wrap">

        {/* Profile */}
        <div className="rb-profile">
          <div className="rb-avatar">
            <User size={16} />
          </div>
          <div>
            <div className="rb-name">My Account</div>
            <div className="rb-email">{firstName || " "}</div>
          </div>
        </div>

        <div className="rb-divider" />

        {/* Menu */}
        <div className="rb-menu">
          <button
            className={`rb-item ${active === "canvas" ? "active" : ""}`}
            onClick={() => navigate("/dashboard")}
          >
            <LayoutDashboard size={15} />
            Dashboard
            <ChevronRight size={13} className="rb-chevron" />
          </button>
        </div>


        <div className="rb-divider" />

        {/* Logout */}
        <div className="rb-footer">
          <button className="rb-logout" onClick={() => handleLogOut()}>
            <LogOut size={15} />
            Log out
          </button>
        </div>

      </div >
    </>
  );
};

export default Rightbar;