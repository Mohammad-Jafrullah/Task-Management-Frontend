import { createContext, useEffect, useState } from "react";
import { getProjects, getUser } from "./API";

export const GlobalContext = createContext(null);

const Store = ({ children }) => {
    const LOGO = "https://www.sofrik.com/wp-content/uploads/2024/06/Sofrik-Logo.png";
    const SERVER = "http://localhost:5000";
    const AUTHTOKEN = localStorage.getItem("authtoken");
    const [user, setUser] = useState(null);
    const [projects, setProjects] = useState(null);

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