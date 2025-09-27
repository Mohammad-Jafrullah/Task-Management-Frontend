import { useContext } from "react"
import { GlobalContext } from "../context/Store"
import { useNavigate } from "react-router-dom";

export default function Header() {

    const { LOGO, user } = useContext(GlobalContext);
    const navigate = useNavigate();

    return (
        <>
            <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl w-full flex items-center justify-between">
                <img onClick={() => navigate("/")} className="max-w-50 max-md:max-w-30" src={LOGO} alt="Sofrik Logo" />
                {
                    user ?
                        <div className="flex gap-2 items-center">
                            <span className="bg-[#005568] text-white inline-flex justify-center items-center text-xl font-semibold w-10 h-10 rounded-xl">{user.name[0]}</span>
                            <div>
                                <p className="text-sm uppercase font-semibold">{user.name}</p>
                                <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                        </div>
                        :
                        <span>Loading...</span>
                }
            </div>
        </>
    )
}