import DragHandleIcon from "@mui/icons-material/DragHandle";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { DndItem } from "./DndItem.js";
import { Task } from "./Task.js";
import { useState } from "react";
import React from "react";
import { Api } from "./utils/myApi.js";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Button, TextField } from "@mui/material";
import { getCookie } from "./utils/handleCookies.js";
import { useSelector } from "react-redux";

export const Container = ({
    title,
    tasks,
    onDisableDrag,
    id,
    containers,
    setContainers,
    // token,
    onDelete
}) => {
    const [disableDrag, setDisableDrag] = useState(true);
    const [isInputOpen, setIsInputOpen] = useState(false)
    const [taskName, setTaskName] = useState('');
    const { token } = getCookie('token')
    const userInfo = useSelector(state => state.userInfo)
    const { name, email } = userInfo



    const handleDragTask = (dragIndex, hoverIndex) => {

        const dTask = tasks[dragIndex];
        const newTasks = [...tasks];
        // console.log(dTask)
        // console.log(id)
        newTasks.splice(dragIndex, 1);
        newTasks.splice(hoverIndex, 0, dTask);

        const newCon = containers.map((c) => {
            if (c._id === id) {
                return { ...c, tasks: newTasks };
            }
            return c;
        });

        setContainers(newCon);
    };

    const handleDragTaskToDiffCon = (dragItem, tCon, hoveredTaskId) => {
        // console.log(dragItem)
        if (!dragItem || !tCon) return
        let newCons = [...containers];
        let targetCon = newCons.find((c) => c._id === tCon)
        let dTaskId = dragItem._id;
        const t = targetCon.tasks.find((t) => t._id === dTaskId)
        if (t) {
            return
        }
        const hoverT = targetCon.tasks.find((t) => t._id === hoveredTaskId)
        const hIndex = targetCon.tasks.indexOf(hoverT)

        let rootCon = newCons.find((c) => c._id === dragItem.container)
        console.log(rootCon.tasks)
        let newRootTasks = rootCon.tasks.filter((c) => c._id !== dragItem._id)
        rootCon = { ...rootCon, tasks: newRootTasks }

        let dragI = { _id: dragItem._id, title: dragItem.title, container: tCon }
        let newTargetTasks = [...targetCon.tasks]
        console.log(targetCon.tasks)
        // newTasks.splice(dragIndex, 1);
        newTargetTasks.splice(hIndex, 0, dragI);
        console.log(newTargetTasks)
        // newTargetTasks.push()
        targetCon = { ...targetCon, tasks: newTargetTasks }

        newCons = newCons.map((c) => {
            if (c._id === rootCon._id) {
                return rootCon
            }
            else if (c._id === targetCon._id) {
                return targetCon
            }
            else {
                return c
            }

        })

        setContainers(newCons)

    }

    const handleDeleteTask = (_id) => {
        console.log(_id)
        let newContainers = [...containers];
        let index;
        let containerId
        newContainers.map((c, i) => {
            if (c?._id === id) {
                index = i
                containerId = c._id
            }
        });

        Api.handleDeleteTasK(token, containerId, _id).then((task) => {
            if (task) {
                newContainers = newContainers.map((c) => {
                    if (c._id === containerId) {
                        let tasks = c.tasks.filter((t) => t._id !== _id)
                        return { ...c, tasks: tasks }
                    }
                    return c
                })
                Api.handleUpdateUserInfo(token, name, email, newContainers).then((info) => {
                    if (info) {
                        setContainers(newContainers)
                    }
                })
            }
            else {

            }
        }).catch((e) => console.log(e))



    }

    const handleContainerClick = (e) => {

        if (!e.target.classList.contains('container-input') && isInputOpen) {
            setIsInputOpen(false)
        }
    }

    const handleAddTask = () => {

        let newContainers = [...containers]

        let index;
        newContainers.map((c, i) => {
            if (c?._id === id) {
                index = i
            }
        });

        Api.handleAddNewTasK(token, id, taskName).then((task) => {
            if (task) {

                let tasks = [...newContainers[index].tasks]
                tasks = [...tasks, task]
                console.log(tasks)
                newContainers = newContainers.map((c, i) => {
                    if (i === index) {
                        return { ...c, tasks: tasks }
                    }
                    return c
                })

                // newContainers[index].tasks = tasks
                // console.log(newContainers)

                Api.handleUpdateUserInfo(token, name, email, newContainers).then((info) => {
                    if (info) {
                        setContainers(newContainers)
                        setTaskName('')
                    }
                })
                console.log(task)

            }
        }).catch((e) => alert(e))


    }


    return (
        <div onClick={() => setIsInputOpen(false)} className="container">
            <div className="icons-container">
                <IconButton
                    onMouseDown={() => onDisableDrag(false)}
                    style={{ cursor: "grab" }}
                >
                    <DragHandleIcon />
                </IconButton>
                <IconButton
                    onClick={() => onDelete(id)}
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
                                key={t?._id}
                                _id={t?._id}
                                index={i}
                                onHover={handleDragTask}
                                task={t}
                                container={t?.container}
                                onDragToDiffCon={handleDragTaskToDiffCon}
                                title={t?.title}

                            >
                                <Task setDisableDrag={setDisableDrag} task={t} text={t?.title} id={t?._id} onDelete={handleDeleteTask} />
                            </DndItem>
                        );
                    })}
            </div>

            {
                isInputOpen ?
                    <div onClick={(e) => e.stopPropagation()} className=" flex flex-row w-full justify-between absolute bottom-0 container-input">
                        <TextField value={taskName || ''} onChange={(e) => { setTaskName(e.target.value) }} className="container-input" label="task name" type='text' name='task-name'></TextField>
                        <Button onClick={handleAddTask} variant="contained" >Add</Button>
                    </div>
                    :
                    <div className="absolute bottom-0 right-0" style={{ cursor: "pointer" }}>
                        <IconButton onClick={(e) => { e.stopPropagation(); setIsInputOpen(true) }}>
                            <AddCircleOutlineIcon />
                        </IconButton>
                    </div>
            }

        </div>
    );
};
