import { useContext, useState } from "react"
import { GlobalContext } from "../context/Store"
import { button, h2, input } from "../common/Theme";
import { Link } from "react-router-dom";
import LoadingButton from "../loaders/LoadingButton";

export default function Login() {

    const { LOGO, SERVER } = useContext(GlobalContext);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({
        email: "",
        password: ""
    })

    const handleUser = (e) => {
        const { name, value } = e.target;

        setUser(prev => ({
            ...prev, [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`${SERVER}/api/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(user)
            })
            const data = await response.json();

            if (!data.success) {
                alert(data.message);
                return;
            }
            localStorage.setItem("authtoken", data.authtoken);
            window.location.href = "/";
        } catch (err) {
            alert("Server error!");
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div className="w-[100vw] h-[100vh] bg-gray-50 flex justify-center items-center">
                <div className="w-[90%] max-w-100 flex flex-col items-center">
                    <img className="max-w-50 mb-10" src={LOGO} alt="Sofrik Logo" />
                    <form onSubmit={handleSubmit} className="bg-white w-full border border-gray-200 p-5 rounded-xl flex flex-col gap-4">
                        <h2 className={`${h2} text-center`}>Login</h2>
                        <input name="email" value={user.email} type="email" className={`${input}`} placeholder="Email" onChange={handleUser} required />
                        <input name="password" value={user.password} type="password" className={`${input}`} placeholder="Enter Password" onChange={handleUser} required />
                        {loading ? <LoadingButton /> : <button type="submit" className={`${button}`}>Login</button>}
                        <p className="text-sm text-center">
                            Don't have an account.
                            <Link to={"/signup"} className="text-[#005568] font-semibold ml-2">
                                Signup
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </>
    )

}
