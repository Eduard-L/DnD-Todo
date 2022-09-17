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
        // console.log(dTask)
        // console.log(id)
        newTasks.splice(dragIndex, 1);
        newTasks.splice(hoverIndex, 0, dTask);

        const newCon = containers.map((c) => {
            if (c.id === id) {
                return { ...c, tasks: newTasks };
            }
            return c;
        });

        setContainers(newCon);
    };

    const handleDragTaskToDiffCon = (dragItem, tCon, hoveredTaskId) => {
        // let newCons = [...containers]
        // let rootCon = newCons.find((c) => c.id === dragItem.conId)
        // let targetCon = newCons.find((c) => c.id === tCon)
        // const rootIndex = rootCon.tasks.indexOf(dragItem)
        // const hoverT = targetCon.tasks.find((t) => t.id === hoveredTaskId)
        // const hIndex = targetCon.tasks.indexOf(hoverT)
        // const t = targetCon.tasks.find((t) => t.id === dragItem.id)

        // if (t) return


        // rootCon.tasks.splice(rootIndex, 1)
        // dragItem = { ...dragItem, conId: tCon }
        // targetCon.tasks.splice(hIndex, 0, dragItem)

        // setContainers(() => {
        //     newCons = newCons.map((c) => {
        //         if (c.id === rootCon.id) {
        //             return rootCon
        //         }
        //         else if (c.id === targetCon.id) {
        //             return targetCon
        //         }
        //         else {
        //             return c
        //         }

        //     })

        //     return newCons

        // })


        if (!dragItem || !tCon) return
        let newCons = [...containers];
        let targetCon = newCons.find((c) => c.id === tCon)
        let dTaskId = dragItem.id;
        const t = targetCon.tasks.find((t) => t.id === dTaskId)
        const hoverT = targetCon.tasks.find((t) => t.id === hoveredTaskId)
        const hIndex = targetCon.tasks.indexOf(hoverT)
        console.log(hIndex)
        // console.log(t)
        if (t) {
            const index = targetCon.tasks.indexOf(t)
            const hIndex = targetCon.tasks.indexOf(hoverT)


            return
        }

        let rootCon = newCons.find((c) => c.id === dragItem.conId)
        let newRootTasks = rootCon.tasks.filter((c) => c.id !== dragItem.id)
        rootCon = { ...rootCon, tasks: newRootTasks }

        let dragI = { id: dragItem.id, text: dragItem.text, conId: tCon }
        let newTargetTasks = [...targetCon.tasks]
        console.log(targetCon.tasks)
        // newTasks.splice(dragIndex, 1);
        newTargetTasks.splice(hIndex, 0, dragI);
        console.log(newTargetTasks)
        // newTargetTasks.push()
        targetCon = { ...targetCon, tasks: newTargetTasks }

        newCons = newCons.map((c) => {
            if (c.id === rootCon.id) {
                return rootCon
            }
            else if (c.id === targetCon.id) {
                return targetCon
            }
            else {
                return c
            }

        })

        setContainers(newCons)

    }

    const handleDeleteTask = () => {

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
                                key={t?.id}
                                id={t?.id}
                                index={i}
                                onHover={handleDragTask}
                                task={t}
                                conId={t?.conId}
                                onDragToDiffCon={handleDragTaskToDiffCon}
                                text={t?.text}
                            >
                                <Task setDisableDrag={setDisableDrag} task={t} text={t?.text} />
                            </DndItem>
                        );
                    })}
            </div>
        </div>
    );
};
