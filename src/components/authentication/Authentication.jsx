import Login from "./Login";
import Signup from "./Signup";
import { Routes, Route } from "react-router-dom";

export default function Authentication() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="*" element={<p className="text-xl font-bold text-left p-4 text-gray-700">404 Page not found!</p>} />   
            </Routes>
        </>
    )
}