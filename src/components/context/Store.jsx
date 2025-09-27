import { createContext, useEffect, useState } from "react";
import { getProjects, getUser } from "./API";

export const GlobalContext = createContext(null);

const Store = ({ children }) => {
    const LOGO = "https://www.sofrik.com/wp-content/uploads/2024/06/Sofrik-Logo.png";
    const SERVER = import.meta.env.VITE_SERVER;
    const AUTHTOKEN = localStorage.getItem("authtoken");
    const [user, setUser] = useState(null);
    const [projects, setProjects] = useState(null);

    useEffect(() => {
        const verifyUser = async () => {
            try {
                const response = await fetch(`${SERVER}/api/verify`, {
                    method: "POST",
                    headers: {
                        "auth-token": AUTHTOKEN
                    }
                })
                const data = await response.json();
                if (!data.success) {
                    localStorage.removeItem("authtoken");
                    window.location.href = "/";
                    alert(data.message);
                    return
                }
            } catch (err) {
                console.log(err);
            }
        }

        if (AUTHTOKEN) verifyUser();
    }, [AUTHTOKEN])

    useEffect(() => {
        const getDefaultData = async () => {
            try {
                const data = await getUser(SERVER, AUTHTOKEN);
                setUser(data);
                const data2 = await getProjects(SERVER, AUTHTOKEN);
                setProjects(data2);
            } catch (err) {
                console.log(err);
            }
        }

        if (AUTHTOKEN) getDefaultData();
    }, [AUTHTOKEN])

    return (
        <GlobalContext.Provider value={{ LOGO, SERVER, AUTHTOKEN, user, setUser, projects, setProjects }}>
            {children}
        </GlobalContext.Provider>
    )
}

export default Store;