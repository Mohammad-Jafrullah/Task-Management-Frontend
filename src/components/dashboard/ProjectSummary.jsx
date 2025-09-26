import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { GlobalContext } from "../context/Store";
import { button, h2, h4, input, textarea } from "../common/Theme";

export default function ProjectSummary() {

    const { projects, SERVER, AUTHTOKEN } = useContext(GlobalContext);
    const navigate = useNavigate();
    const projectId = useParams().projectId;

    const [isOpen, setIsOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentProject, setCurrentProject] = useState(null);

    // const filteredProjects = projects ? projects.filter(project => {
    //     const statusMatch = selectedStatus === "All" || project.status.toLowerCase() === selectedStatus.toLowerCase();
    //     const searchMatch =
    //         project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    //     return statusMatch && searchMatch;
    // }) : null;

    const StatusFilter = () => (
        <div className="relative">
            <div
                onClick={() => setIsOpen(prev => !prev)}
                className="flex items-center gap-2 px-5 py-2 bg-white border border-gray-200 rounded-md font-medium cursor-pointer text-[#3A3546]"
            >
                <span>{selectedStatus}</span><i className="fa-solid fa-chevron-down"></i>
            </div>
            {isOpen && (
                <div className="absolute flex flex-col gap-2 mt-2 bg-white shadow-lg rounded-md z-10 w-40 p-2">
                    {["All", "Active", "Completed"].map(status => (
                        <div
                            key={status}
                            onClick={() => { setSelectedStatus(status); setIsOpen(false); }}
                            className={`px-4 py-2 hover:bg-gray-200 cursor-pointer rounded-md font-[inter] ${selectedStatus === status && '!bg-[#005568] text-white'}`}
                        >
                            {status}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    // DELETE THE PROJECT
    const handleDelete = async (_id) => {
        // Show confirmation dialog
        const confirmed = window.confirm("Are you sure you want to delete this project?");
        if (!confirmed) {
            return;
        }

        try {
            const response = await fetch(`${SERVER}/project/delete/${_id}`, {
                method: "DELETE",
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
            window.location.reload();
        } catch (error) {
            console.error("Error fetching job data:", error);
        }
    }

    useEffect(() => {
        const getProject = async () => {
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
                    window.location.href = "/projects";
                    alert(data.message);
                    return;
                }
                setCurrentProject(data.project);
            } catch (err) {
                console.log(err);
            }
        }

        if (projectId) getProject();
    }, [projectId])

    return (
        <>
            <div className="p-4 md:p-6 text-sm text-gray-800 max-md:p-0">
                {/* Header */}
                <div className="flex justify-between items-center mb-6 gap-3">
                    <div>
                        <h2 className={`${h2}`}>{currentProject?.title}</h2>
                        <p className="text-sm text-gray-500">{currentProject?.description}</p>
                    </div>
                    <button onClick={() => navigate("/")} className={`${button}`}>Create a Project</button>
                </div>

                {/* Filter + Search */}
                <div className="flex gap-4 mb-6 max-md:justify-between max-md:gap-4">
                    <StatusFilter />
                    <input
                        type="text"
                        placeholder="Search Project..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className={`${input} max-w-60`}
                    />
                </div>
                <div>
                    <div className="max-w-80 bg-gray-100 p-4 rounded-md">
                        <h4 className={`${h4} mb-3`}>Create a Task</h4>
                        <form className="flex flex-col gap-2">
                            <input name="title" type="text" className={`${input}`} placeholder="Title" required />
                            <div className={`${input} flex justify-between items-center cursor-pointer`}>
                                Due date
                                <i className="fa-solid fa-calendar-days"></i>
                            </div>
                            <textarea className={`${textarea}`} name="description" placeholder="Description" maxLength={120}></textarea>
                            <div>
                                <input
                                    id="cp-todo"
                                    type="radio"
                                    name="status"
                                    value="active"
                                />
                                <label className="ml-2 cursor-pointer" htmlFor="cp-todo">Todo</label>
                                <br />
                                <input
                                    id="cp-in-progress"
                                    type="radio"
                                    name="status"
                                    value="in-progress"
                                />
                                <label className="ml-2 cursor-pointer" htmlFor="cp-in-progress">In-progress</label>
                                <br />
                                <input
                                    id="cp-done"
                                    type="radio"
                                    name="status"
                                    value="done"
                                />
                                <label className="ml-2 cursor-pointer" htmlFor="cp-done">Done</label>
                            </div>
                            <button className={`${button}`}>Create</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};