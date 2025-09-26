import { useContext } from "react"
import { GlobalContext } from "../context/Store"

export default function Header() {

    const { LOGO, user } = useContext(GlobalContext);

    return (
        <>
            <div className="bg-gray-50 p-4 rounded-xl w-full flex items-center justify-between">
                <img className="max-w-50" src={LOGO} alt="Sofrik Logo" />
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