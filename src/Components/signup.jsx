import axios from "axios";
import { useState } from "react";
import { BASE_URL } from "../Utils/constant";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../Utils/user";

const Signup = () => {

    const [isSignup, setIsSignup] = useState(false);
    const [firstName, setFirstname] = useState("");
    const [lastName, setLastname] = useState("");
    const [emailId, setEmailId] = useState("jaysinganurag321@gmail.com");
    const [password, setPassword] = useState("Anurag123@#$");

    const navigate = useNavigate();
    const dispatch = useDispatch();

    // SIGN IN
    const handleSignIn = async () => {
        try {

            const res = await axios.post(
                BASE_URL + "/login",
                { "emailId": emailId, "password": password },
                { withCredentials: true }
            );

            console.log(res.data);

            dispatch(setUser(res.data.user));

            navigate("/");

        } catch (error) {
            console.log(error.response?.data || error.message);
        }
    };

    // SIGN UP
    const handleSignUp = async () => {
        try {

            const res = await axios.post(
                BASE_URL + "/signup",
                {
                    firstName,
                    lastName,
                    emailId,
                    password
                },
                { withCredentials: true }
            );

            console.log(res.data);

            dispatch(setUser(res.data.user));

            navigate("/");

        } catch (error) {
            console.log(error.response?.data || error.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">

            <div className="w-[450px] bg-white p-10 rounded-2xl shadow-xl">

                <h2 className="text-3xl font-semibold text-center mb-2">
                    {isSignup ? "Sign Up" : "Sign In"}
                </h2>

                <p className="text-gray-500 text-center mb-8">
                    Enter your credentials
                </p>

                {isSignup && (
                    <div className="flex gap-3 mb-5">

                        <input
                            type="text"
                            placeholder="First Name"
                            value={firstName}
                            onChange={(e) => setFirstname(e.target.value)}
                            className="w-1/2 border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />

                        <input
                            type="text"
                            placeholder="Last Name"
                            value={lastName}
                            onChange={(e) => setLastname(e.target.value)}
                            className="w-1/2 border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />

                    </div>
                )}

                <input
                    type="email"
                    placeholder="Email Address"
                    value={emailId}
                    onChange={(e) => setEmailId(e.target.value)}
                    className="w-full border rounded-lg px-4 py-3 mb-5 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border rounded-lg px-4 py-3 mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />

                <button
                    onClick={() => isSignup ? handleSignUp() : handleSignIn()}
                    className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-lg text-lg transition"
                >
                    {isSignup ? "Sign Up" : "Sign In"}
                </button>

                <p
                    className="text-center text-indigo-500 mt-6 cursor-pointer"
                    onClick={() => setIsSignup(!isSignup)}
                >
                    {isSignup
                        ? "Already have an account? Sign in"
                        : "Don't have an account? Sign up"}
                </p>

            </div>
        </div>
    );
};

export default Signup;