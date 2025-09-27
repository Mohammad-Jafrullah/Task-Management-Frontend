import { useContext, useEffect, useState } from "react";
import { button, h4, input, textarea } from "../common/Theme";
import { GlobalContext } from "../context/Store";

export default function CreateTask({ projectId, editTask }) {

    const { AUTHTOKEN, SERVER } = useContext(GlobalContext);

    const [task, setTask] = useState({
        title: "",
        description: "",
        dueDate: "",
        status: "todo"
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTask(prev => ({
            ...prev, [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${SERVER}/task/create/${projectId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": AUTHTOKEN
                },
                body: JSON.stringify(task)
            })
            const data = await response.json();

            if (!data.success) {
                alert(data.message);
                return;
            }
            window.location.reload();
        } catch (err) {
            alert("Server error!");
            console.log(err);
        }
    }

    useEffect(() => {
        if (editTask) {
            setTask(editTask);
            console.log(editTask)
        }
    }, [editTask])

    return (
        <>
            <div className="max-w-80 bg-gray-100 p-4 rounded-md" id="createTask">
                <h4 className={`${h4} mb-3`}>{editTask ? "Update Task" : "Create a Task"}</h4>
                <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
                    <input name="title" type="text" value={task.title} className={`${input}`} placeholder="Title" onChange={handleChange} required />
                    <input type="date" name="dueDate" value={task.dueDate} className={`${input}`} onChange={handleChange} required />
                    <textarea className={`${textarea}`} value={task.description} name="description" placeholder="Description" maxLength={120} onChange={handleChange}></textarea>
                    <div>
                        <input
                            id="cp-todo"
                            type="radio"
                            name="status"
                            value="todo"
                            checked={task.status === "todo"}
                            onChange={handleChange}
                        />
                        <label className="ml-2 cursor-pointer" htmlFor="cp-todo">Todo</label>
                        <br />
                        <input
                            id="cp-in-progress"
                            type="radio"
                            name="status"
                            value="in-progress"
                            checked={task.status === "in-progress"}
                            onChange={handleChange}
                        />
                        <label className="ml-2 cursor-pointer" htmlFor="cp-in-progress">In-progress</label>
                        <br />
                        <input
                            id="cp-done"
                            type="radio"
                            name="status"
                            value="done"
                            checked={task.status === "done"}
                            onChange={handleChange}
                        />
                        <label className="ml-2 cursor-pointer" htmlFor="cp-done">Done</label>
                    </div>
                    <button className={`${button}`}>{editTask ? "Update" : "Create"}</button>
                </form>
            </div>
        </>
    )
}