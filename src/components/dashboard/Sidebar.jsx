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
            <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl min-w-50 flex flex-col gap-3 h-full max-xl:min-w-auto max-md:fixed max-md:flex-row max-md:w-[calc(100vw-40px)] max-md:h-auto max-md:bottom-5 z-50 max-md:left-5">
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
        </>
    )
}