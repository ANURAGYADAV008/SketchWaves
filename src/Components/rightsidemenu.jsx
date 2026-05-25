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
      const res = await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      localStorage.removeItem("token");
      dispatch(setUser(null));
      navigate("/");

    } catch (error) {
      console.error(error.message)
    }

  }

  return (
    <>
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

