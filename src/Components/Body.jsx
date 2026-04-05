import { useEffect } from "react"
import Header from "./header"
import Main from "./main"
import axios from "axios"
import { BASE_URL } from "../Utils/constant"
import { setUser } from "../Utils/user"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
const Body = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const fetchUser = async () => {
        try {

            const res = await axios.get(BASE_URL + "/getuser", {
                withCredentials: true
            });

            dispatch(setUser(res.data.message));

        } catch (error) {

            console.log(error.response?.data);

            if (error.response?.status === 400) {
                navigate("/signup");
            }

        }
    };
    useEffect(() => {
        fetchUser();

    }, [])
    return (
        <div>
            <Header />
            <Main />
        </div>
    )
}
export default Body