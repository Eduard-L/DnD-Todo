import DragHandleIcon from "@mui/icons-material/DragHandle";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { DndItem } from "../DndItem.js";
import { Task } from "../Task/Task.js";
import { useEffect, useState } from "react";
import React from "react";
import { Api } from "../utils/myApi.js";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Button, TextField } from "@mui/material";
import { getCookie } from "../utils/handleCookies.js";
import { useSelector } from "react-redux";
import './Container.css'
import AddIcon from '@mui/icons-material/Add';
import { AddCircleOutline } from "@mui/icons-material";

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

    useEffect(() => {
        window.addEventListener('click', handleInputClose)

        return () => {
            window.removeEventListener('click', handleInputClose)
        }
    }, [])




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

    const handleInputClose = (e) => {


        setIsInputOpen(false)

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
        <div className="container">
            <div className="icons-container">
                <IconButton
                    onMouseDown={() => onDisableDrag(false)}
                    style={{ cursor: "grab" }}
                >
                    <DragHandleIcon className="drag-btn" style={{ fill: 'lightskyblue' }} />
                </IconButton>
                <IconButton
                    onClick={() => onDelete(id)}
                    style={{ cursor: "pointer" }}
                >
                    <DeleteIcon className="delete-icon" style={{ fill: 'lightskyblue' }} />
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
                <div onClick={(e) => { e.stopPropagation(); setIsInputOpen(true) }} className="task task_type_add flex flex-col items-center justify-center relative" style={{ justifyContent: 'center', alignItems: "center", opacity: isInputOpen && 1 }}>
                    {
                        isInputOpen ?
                            <div className=" flex flex-row  w-full container-input">
                                <TextField value={taskName || ''} onChange={(e) => { setTaskName(e.target.value) }} className="container-input" type='text' name='task-name'></TextField>
                                {/* <Button  variant="contained" >Add</Button> */}
                                <IconButton onClick={handleAddTask}>
                                    < AddCircleOutline />
                                </IconButton>

                            </div>
                            :

                            <IconButton className='add-btn' >
                                <AddIcon style={{ fill: 'white' }} />
                            </IconButton>
                    }

                </div>
            </div >



        </div >
    );
};
