import Login from "./Login";
import Signup from "./Signup";
import { Routes, Route } from "react-router-dom";

export default function Authentication() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
            </Routes>
        </>
    )
}