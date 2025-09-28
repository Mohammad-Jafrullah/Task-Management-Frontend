import { useContext, useEffect, useState } from "react";
import { button, h2, input, textarea } from "../common/Theme";
import { GlobalContext } from "../context/Store";
import { useParams } from "react-router-dom";
import LoadingButton from "../loaders/LoadingButton";

export default function CreateProject() {

    const { SERVER, AUTHTOKEN } = useContext(GlobalContext);
    const projectId = useParams().projectId;
    const [loading, setLoading] = useState(false);

    const [project, setProject] = useState({
        title: "",
        description: "",
        status: "active"
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProject(prev => ({
            ...prev, [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`${SERVER}/project/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": AUTHTOKEN
                },
                body: JSON.stringify({ ...project, projectId })
            })
            const data = await response.json();

            if (!data.success) {
                alert(data.message);
                return;
            }
            window.location.href = "/projects";
        } catch (err) {
            alert("Server error!");
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const getProject = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${SERVER}/project/${projectId}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": AUTHTOKEN
                    }
                })
                const data = await response.json();

                if (!data.success) {
                    window.location.href = "/";
                    alert(data.message);
                    return;
                }
                setProject(data.project);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        }

        if (projectId) getProject();
    }, [projectId])

    return (
        <>
            <div className="max-w-100">
                <h2 className={`${h2} mb-4`}>{projectId ? "Update Project" : "Create a Project"}</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input name="title" type="text" className={`${input}`} placeholder="Title" value={project.title} onChange={handleChange} required />
                    <textarea className={`${textarea}`} name="description" placeholder="Description" value={project.description} onChange={handleChange} maxLength={120}></textarea>
                    <div>
                        <input
                            id="cp-active"
                            type="radio"
                            name="status"
                            value="active"
                            checked={project.status === "active"}
                            onChange={handleChange}
                        />
                        <label className="ml-2 cursor-pointer" htmlFor="cp-active">Active</label>
                        <br />
                        <input
                            id="cp-completed"
                            type="radio"
                            name="status"
                            value="completed"
                            checked={project.status === "completed"}
                            onChange={handleChange}
                        />
                        <label className="ml-2 cursor-pointer" htmlFor="cp-completed">Completed</label>
                    </div>
                    {loading ? <LoadingButton /> : <button type="submit" className={`${button}`}>{projectId ? "Update" : "Create"}</button>}
                </form>
            </div>
        </>
    )
}