const getUser = async (SERVER, AUTHTOKEN) => {
    try {
        const response = await fetch(`${SERVER}/api/user`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "auth-token": AUTHTOKEN
            }
        });

        const data = await response.json();
        if (!data.success) {
            alert(data.message);
            return;
        }
        return data.user;
    } catch (err) {
        console.log(err);
    }
}

const getProjects = async (SERVER, AUTHTOKEN) => {
    try {
        const response = await fetch(`${SERVER}/project/projects`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "auth-token": AUTHTOKEN
            }
        });

        const data = await response.json();
        if (!data.success) {
            alert(data.message);
            return;
        }
        return data.projects;
    } catch (err) {
        console.log(err);
    }
}

export { getUser, getProjects };