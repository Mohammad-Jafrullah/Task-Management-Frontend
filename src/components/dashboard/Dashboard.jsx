import { Route, Routes } from "react-router-dom";
import CreateProject from "./CreateProject";
import Header from "./Header";
import Sidebar from "./Sidebar";
import ProjectListing from "./ProjectListing";
import ProjectSummary from "./ProjectSummary";

export default function Dashboard() {

    const renderComponent = () => {
        return (
            <Routes>
                <Route path="/" element={<CreateProject />} />
                <Route path="/edit/:projectId" element={<CreateProject />} />
                <Route path="/projects" element={<ProjectListing />} />
                <Route path="/projects/:projectId" element={<ProjectSummary />} />
                <Route path="*" element={<p className="text-xl font-bold text-left text-gray-700">404 Not Found!</p>} />
            </Routes>
        )
    }

    return (
        <>
            <div className="w-[100vw] h-[100vh] p-10 flex gap-5">
                <Sidebar />
                <div className="flex-1 flex flex-col gap-5">
                    <Header />
                    {renderComponent()}
                </div>
            </div>
        </>
    )
}