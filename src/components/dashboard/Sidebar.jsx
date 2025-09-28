import { NavLink } from "react-router-dom"

export default function Sidebar() {

    const menuItems = [
        {
            path: "/",
            icon: "fa-regular fa-rectangle-history-circle-plus",
            name: "Create"
        },
        {
            path: "/projects",
            icon: "fa-regular fa-rectangle-history",
            name: "Projects"
        }
    ]

    return (
        <>
            <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl min-w-50 flex flex-col justify-between gap-3 lg:min-h-80 lg:sticky lg:top-2 max-xl:min-w-auto max-md:flex-row max-md:fixed max-md:w-[calc(100vw-40px)] max-md:h-auto max-md:bottom-5 z-50 max-md:left-5">
                <div className="flex flex-col gap-3 max-md:flex-row">
                    {menuItems.map((menu, index) => {
                        const { path, icon, name } = menu;
                        return (
                            <NavLink key={index} to={path} className={({ isActive }) =>
                                isActive ? "flex gap-2 items-center bg-[#005568] text-white text-sm py-2 px-4 rounded-sm max-xl:p-4 max-xl:justify-center"
                                    : "flex gap-2 items-center bg-gray-200 text-sm py-2 px-4 rounded-sm max-xl:p-4 max-xl:justify-center"}>
                                <i className={icon}></i>
                                <span className="max-xl:hidden">
                                    {name}
                                </span>
                            </NavLink>
                        )
                    })}
                </div>

                <button className="flex gap-2 justify-baseline items-center text-red-700 cursor-pointer hover:opacity-90" onClick={() => {
                    localStorage.removeItem("authtoken");
                    window.location.href = "/";
                }}>
                    <i className="fa-regular fa-right-from-bracket translate-y-[1px]"></i>
                    <span className="max-sm:hidden">Logout</span>
                </button>
            </div>
        </>
    )
}