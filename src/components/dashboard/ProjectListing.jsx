import { useContext, useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { GlobalContext } from "../context/Store";
import { button, h2, input } from "../common/Theme";
import Pagination from "../common/Pagination";

export default function ProjectListing() {

    const { projects, SERVER, AUTHTOKEN } = useContext(GlobalContext);
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = parseInt(searchParams.get("page")) || 1;
    const itemsPerPage = 5;
    const [isOpen, setIsOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");

    const filteredProjects = projects ? projects.filter(project => {
        const statusMatch = selectedStatus === "All" || project.status?.toLowerCase() === selectedStatus.toLowerCase();
        const searchMatch =
            project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.description?.toLowerCase().includes(searchTerm.toLowerCase());
        return statusMatch && searchMatch;
    }) : null;

    const totalProjects = filteredProjects?.length || 0;
    const paginatedProjects = filteredProjects?.slice(
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

    const handlePageChange = (page) => {
        setSearchParams({ page });
    };

    return (
        <>
            <div className="text-sm text-gray-800">
                {/* Header */}
                <div className="flex justify-between items-center mb-6 gap-3">
                    <h2 className={`${h2}`}>All Projects</h2>
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

                {/* Table (hidden on mobile) */}
                <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden font-[inter] max-md:border-none max-md:bg-transparent max-md:rounded-none">
                    <div className="bg-gray-100 border-b border-gray-200 py-4 px-6 flex gap-4 justify-between items-center max-md:hidden">
                        {["Project", "Date posted", "Status", "Mode"].map((head, i) => (
                            <span key={i} className="w-1/4 font-[Montserrat] text-sm font-semibold text-black">{head}</span>
                        ))}
                    </div>
                    {paginatedProjects ?
                        paginatedProjects.length ? paginatedProjects.reverse().map(project => {
                            const { _id, title, description, status, publishedDate } = project;

                            return (
                                <>
                                    <div onClick={() => navigate(`/projects/${_id}`)} key={_id} className="cursor-pointer bg-white py-4 px-6 flex gap-4 justify-between items-center odd:bg-gray-50 hover:bg-gray-50 max-md:flex-col max-md:border max-md:border-gray-200 max-md:rounded-2xl max-md:mb-6 last:mb-0">
                                        <div className="w-1/4 flex gap-2 items-start max-md:w-full">
                                            <i className="fa-solid fa-suitcase translate-y-[4px]"></i>
                                            <div>
                                                <h4 className="text-sm font-[Montserrat] font-[700]">{title}</h4>
                                                <p className="text-sm text-gray-500 font-[Inter]">{description}</p>
                                            </div>
                                        </div>
                                        <div className="w-1/4 flex gap-2 items-start max-md:w-full">
                                            <i className="fa-solid fa-calendar-days translate-y-[3px]"></i>
                                            <h4 className="text-sm font-[Montserrat] font-[700]">{publishedDate}</h4>
                                        </div>
                                        <div className="w-1/4 flex gap-2 items-center max-md:w-full">
                                            <span className={`w-5 h-5 ${status === "active" ? "bg-green-600 border-green-100" : "bg-gray-600 border-gray-100"} border-6 rounded-full translate-y-0.5`}></span>
                                            <h4 className="text-sm font-[Montserrat] font-[700]">{status}</h4>
                                        </div>
                                        <div className="w-1/4 flex gap-2 items-start max-md:w-full">
                                            <button className={`${button} flex items-center gap-2`} onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/edit/${_id}`);
                                            }}>
                                                <i className="fa-light fa-pen"></i>
                                                Edit
                                            </button>
                                            <button className={`${button} flex items-center gap-2 !bg-red-700`} onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(_id);
                                            }}>
                                                <i className="fa-light fa-trash"></i>
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )
                        }) : (
                            <p className="text-xl font-bold text-left p-4 text-gray-700">No project found!</p>
                        ) : <p className="text-xl font-bold text-left p-4 text-gray-700">Loading...</p>
                    }
                </div>
                <Pagination
                    totalItems={totalProjects}
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    onPageChange={handlePageChange}
                />
            </div>
        </>
    );
};