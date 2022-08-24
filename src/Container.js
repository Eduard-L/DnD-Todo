import DragHandleIcon from "@mui/icons-material/DragHandle";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { DndItem } from "./DndItem.js";
import { Task } from "./Task.js";
import { useState } from "react";
import React from "react";

export const Container = ({
    title,
    tasks,
    onDisableDrag,
    id,
    containers,
    setContainers
}) => {
    const [disableDrag, setDisableDrag] = useState(true);

    const handleDragTask = (dragIndex, hoverIndex) => {
        const dTask = tasks[dragIndex];
        const newTasks = [...tasks];
        newTasks.splice(dragIndex, 1);
        newTasks.splice(hoverIndex, 0, dTask);
        console.log(newTasks);
        const newCon = containers.map((c) => {
            if (c.id === id) {
                return { ...c, tasks: newTasks };
            }
            return c;
        });

        setContainers(newCon);
    };

    const handleDeleteTask=()=>{
        
    }

    const handleDeleteContainer = () => {
        const newCon = containers.filter((c) => c.id !== id);
        setContainers(newCon);
    };

    return (
        <div className="container">
            <div className="icons-container">
                <IconButton
                    onMouseDown={() => onDisableDrag(false)}
                    style={{ cursor: "grab" }}
                >
                    <DragHandleIcon />
                </IconButton>
                <IconButton
                    onClick={handleDeleteContainer}
                    style={{ cursor: "pointer" }}
                >
                    <DeleteIcon />
                </IconButton>
            </div>
            <h1 className="con__title">{title}</h1>
            <div className="tasks-wrapper">
                {tasks &&
                    tasks.map((t, i) => {
                        return (
                            <DndItem
                                Component="div"
                                type="task"
                                disAbleDrag={disableDrag}
                                setDisbaleDrag={setDisableDrag}
                                key={t.id}
                                id={t.id}
                                index={i}
                                onHover={handleDragTask}
                            >
                                <Task setDisableDrag={setDisableDrag} task={t} text={t.text} />
                            </DndItem>
                        );
                    })}
            </div>
        </div>
    );
};
