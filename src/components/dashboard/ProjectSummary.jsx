import React, { useContext, useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { GlobalContext } from "../context/Store";
import { button, h2, h4, input, textarea } from "../common/Theme";
import CreateTask from "./CreateTask";
import Pagination from "../common/Pagination";

export default function ProjectSummary() {

    const { SERVER, AUTHTOKEN } = useContext(GlobalContext);
    const projectId = useParams().projectId;
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = parseInt(searchParams.get("page")) || 1;
    const itemsPerPage = 8;

    const [isOpen, setIsOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentProject, setCurrentProject] = useState(null);
    const [tasks, setTasks] = useState(null);
    const [isEdit, setIsEdit] = useState(null);

    const filteredTasks = tasks ? tasks.reverse().filter(task => {
        const statusMatch = selectedStatus === "All" || task.status?.toLowerCase() === selectedStatus.toLowerCase();
        const searchMatch =
            task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.description?.toLowerCase().includes(searchTerm.toLowerCase());
        return statusMatch && searchMatch;
    }) : null;

    const totalTasks = filteredTasks?.length || 0;
    const paginatedTasks = filteredTasks?.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

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
                    {["All", "Todo", "In-progress", "Done"].map(status => (
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

    const checkStatus = (status) => {
        const value = status.toLowerCase();
        if (value === "todo") return "bg-green-600 border-green-100";
        if (value === "in-progress") return "bg-yellow-600 border-yellow-100";
        return "bg-gray-600 border-gray-100";
    }

    function checkDateStatus(dateString) {
        const indiaTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
        const today = new Date(indiaTime);
        today.setHours(0, 0, 0, 0);

        const inputDate = new Date(dateString);
        inputDate.setHours(0, 0, 0, 0);

        return today > inputDate ? "border-red-600 bg-red-100" : "border-green-600 bg-green-100";
    }

    // DELETE THE TASK
    const handleDelete = async (_id, projectId) => {
        // Show confirmation dialog
        const confirmed = window.confirm("Are you sure you want to delete this task?");
        if (!confirmed) {
            return;
        }

        try {
            const response = await fetch(`${SERVER}/task/delete/${_id}/${projectId}`, {
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

                const response2 = await fetch(`${SERVER}/task/tasks/${projectId}`, {
                    method: "POST",
                    headers: {
                        "auth-token": AUTHTOKEN
                    }
                })
                const data = await response.json();
                const data2 = await response2.json();

                if (!data.success || !data2.success) {
                    window.location.href = "/projects";
                    alert(data.message);
                    return;
                }

                setTasks(data2.tasks);
                setCurrentProject(data.project);
            } catch (err) {
                console.log(err);
            }
        }

        if (projectId) getProject();
    }, [projectId])

    const handlePageChange = (page) => {
        setSearchParams({ page });
    };

    return (
        <>
            <div className="text-sm text-gray-800">
                {/* Header */}
                <div className="flex justify-between items-center mb-6 gap-3">
                    <div>
                        <h2 className={`${h2}`}>{currentProject?.title}</h2>
                        <p className="text-sm text-gray-500 mb-2">{currentProject?.description}</p>
                        <div className="flex gap-2 items-center">
                            <span className={`w-5 h-5 ${currentProject?.status === "active" ? "bg-green-600 border-green-100" : "bg-gray-600 border-gray-100"} border-6 rounded-full translate-y-0.5`}></span>
                            <h4 className="text-sm font-[Montserrat] font-[700]">{currentProject?.status}</h4>
                        </div>
                    </div>
                    {currentProject?.status === "active" && <a href="#createTask" className={`${button}`}>Create a Task</a>}
                </div>

                {/* Filter + Search */}
                <div className="flex gap-4 mb-6 max-md:justify-between max-md:gap-4">
                    <StatusFilter />
                    <input
                        type="text"
                        placeholder="Search Task..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className={`${input} max-w-60`}
                    />
                </div>
                <div className="flex flex-wrap gap-4">
                    {
                        paginatedTasks ? paginatedTasks.length > 0 ? paginatedTasks.map(task => {
                            const { _id, projectId, title, dueDate, description, status } = task;

                            return (
                                <>
                                    {isEdit === _id ? <React.Fragment key={_id}><CreateTask projectId={projectId} editTask={task} /></React.Fragment>
                                        :
                                        <div key={_id} className="max-w-80 bg-gray-100 p-4 rounded-md">
                                            <h4 className={`${h4} mb-1`}>{title}</h4>
                                            <p className="text-sm text-gray-500 mb-3">{description}</p>
                                            <div className={`inline-flex gap-2 mb-3 border rounded-md py-2 px-3 ${checkDateStatus(dueDate)}`}>
                                                <i className="fa-solid fa-calendar-days translate-y-[3px]"></i>
                                                <span>{dueDate}</span>
                                            </div>
                                            <div className="flex gap-2 items-center mb-3">
                                                <span className={`w-5 h-5 ${checkStatus(status)} border-6 rounded-full translate-y-0.5`}></span>
                                                <h4 className="text-sm font-[Montserrat] font-[700]">{status}</h4>
                                            </div>
                                            <div className="flex gap-2 items-start">
                                                {
                                                    currentProject?.status === "active" &&
                                                    <button className={`${button} flex items-center gap-2`} onClick={() => setIsEdit(_id)}>
                                                        <i className="fa-light fa-pen"></i>
                                                        Edit
                                                    </button>
                                                }
                                                <button className={`${button} flex items-center gap-2 !bg-red-700`} onClick={() => handleDelete(_id, projectId)}>
                                                    <i className="fa-light fa-trash"></i>
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    }
                                </>
                            )
                        })
                            :
                            <p className="text-xl font-bold text-left text-gray-700">No Task Found!</p>
                            :
                            <p className="text-xl font-bold text-left text-gray-700">Loading...</p>
                    }
                    {currentProject?.status === "active" && <CreateTask projectId={projectId} />}
                </div>
                <Pagination
                    totalItems={totalTasks}
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    onPageChange={handlePageChange}
                />
            </div>
        </>
    );

};


