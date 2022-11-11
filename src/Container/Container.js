import DragHandleIcon from "@mui/icons-material/DragHandle";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { DndItem } from "../DndItem/DndItem.js";
import { Task } from "../Task/Task.js";
import { useEffect, useState } from "react";
import React from "react";
import { Api } from "../utils/myApi.js";
import { Button, Divider, TextField, Typography } from "@mui/material";
import { getCookie } from "../utils/handleCookies.js";
import { useSelector } from "react-redux";
import './Container.css'
import AddIcon from '@mui/icons-material/Add';
import { handleInputStyles } from "../utils/materialCustomStyles.js";
import { DARK, darkColor, darkContainerColor, lightColor } from "../utils/constants";
import { Input } from "../Input/Input.js";
import EditIcon from '@mui/icons-material/Edit';
import { setUserInfo } from "../redux/userInfoSlice.js";
import { useDispatch } from "react-redux";
import { PopupWithMessage } from "../PopupWithMessage/PopupWithMessage.js";
import { PopupWithQuestion } from "../PopupWithQuestion/PopupWithQuestion.js";
import { useForm } from "../utils/useForm.js";
import { PopupWithForm } from "../PopupWithForm/PopupWithForm.js";


export const Container = ({
    title,
    tasks,
    id,
    containers,
    setContainers,
    boards,
    onDelete,
    handleServerMessages,
    setIsDeletePopOpen,
    setConId,
    setIsPopupWithFormOpen,
    boardId,
    container,
    setBoards,
    setDisableDrag,
    onSave

}) => {

    const [isInputOpen, setIsInputOpen] = useState(false)
    const [taskName, setTaskName] = useState('');
    const { token } = getCookie('token')
    const userInfo = useSelector(state => state.userInfo)
    const { name, email } = userInfo
    const visibilityMode = useSelector((state) => state.mode)
    const color = (visibilityMode === DARK) ? darkColor : lightColor;
    const conShadow = (visibilityMode === DARK) ? darkContainerColor : lightColor;
    const taskColor = (visibilityMode === DARK) ? 'white' : lightColor;
    const inputStyles = handleInputStyles(taskColor, 0);
    const [taskId, setTaskId] = useState()
    const [isPopupOpen, setIsPopupOpen] = useState(false)
    const [disableTaskDrag, setDisableTaskDrag] = useState(true)
    const dispatch = useDispatch()
    const [isFormOpen, setIsFormOpen] = useState(false)
    const { values, handleChange, resetForm, isValid, errors, setValues, setIsValid, setErrors } = useForm()

    useEffect(() => {
        window.addEventListener('click', handleInputClose)

        return () => {
            window.removeEventListener('click', handleInputClose)
        }
    }, [])

    useEffect(() => {
        if (!isFormOpen && !isPopupOpen) {
            setTaskId()
        }

    }, [isFormOpen, isPopupOpen])

    useEffect(() => {
        if (isFormOpen) {
            const task = container.tasks.find((t) => t._id === taskId)
            setValues({
                title: task.title,
                description: task.description
            })
            setIsValid(true)
            setErrors()
        }

    }, [isFormOpen])


    const handleDragTask = (dragIndex, hoverIndex) => {

        const dTask = tasks[dragIndex];
        const newTasks = [...tasks];

        newTasks.splice(dragIndex, 1);
        newTasks.splice(hoverIndex, 0, dTask);

        const newCons = containers.map((c) => {
            if (c._id === id) {
                return { ...c, tasks: newTasks };
            }
            return c;
        });
        const newBoards = [...boards].map((b) => {
            if (b._id === boardId) {
                return { ...b, containers: newCons }
            }
            return b
        })
        setBoards(newBoards)

        setContainers(newCons)
    };

    const handleDragTaskToDiffCon = (dragIndex, hoverIndex, item, conId) => {


        const con = containers.find((c) => c._id === conId);
        const draggedTask = { ...item }
        const sourceCon = draggedTask.container;
        const tasks = [...con.tasks];
        draggedTask.container = conId;
        tasks.splice(hoverIndex, 0, draggedTask);

        const newContainers = [...containers].map((c) => {
            if (c._id === conId) {
                return { ...c, tasks: tasks };
            }
            else if (c._id === sourceCon) {
                const newTasks = [...c.tasks].filter(
                    (t) => t._id !== item._id
                );
                return { ...c, tasks: newTasks };
            }
            return c;
        });

        const newBoards = [...boards].map((b) => {
            if (b._id === boardId) {
                return { ...b, containers: newContainers }
            }
            return b
        })
        setBoards(newBoards)

        setContainers(newContainers);


    }

    const handleDeleteTask = (taskid) => {

        const newTasks = [...container.tasks].filter((t) => t._id !== taskid)
        const newContainers = [...containers].map((c) => {
            if (c._id === id) {
                return { ...c, tasks: newTasks }
            }
            return c
        })

        const newBoards = [...boards].map((b) => {
            if (b._id === boardId) {
                return { ...b, containers: newContainers }
            }
            return b
        })


        Promise.all([Api.handleDeleteTasK(token, id, taskId), Api.handleUpdateUserInfo(token, name, email, newBoards)])
            .then((data) => {
                if (data) {
                    dispatch(setUserInfo(data[1]))
                    handleServerMessages('200')
                    setBoards(newBoards)

                }
            }).catch((e) => handleServerMessages(e.message))



    }

    const handleInputClose = (e) => {


        setIsInputOpen(false)

    }

    const handleAddTask = (title) => {

        Api.handleAddNewTasK(token, id, title).then((task) => {
            if (task) {
                // const newBoard = [...boards].find((b) => b._id === boardId);
                const newContainers = [...containers].map((c) => {
                    if (c._id === id) {
                        return { ...c, tasks: [...c.tasks, task] }
                    }
                    return c
                })

                const newBoards = [...boards].map((b) => {
                    if (b._id === boardId) {
                        return { ...b, containers: newContainers }
                    }
                    return b
                })


                Api.handleUpdateUserInfo(token, name, email, newBoards).then((data) => {
                    if (data) {
                        dispatch(setUserInfo(data))
                        handleServerMessages('200')
                        setBoards(newBoards)

                    }
                })


            }
        }).catch((e) => handleServerMessages(e.message))


    }

    const handleUpdateTask = (e, values) => {
        e.preventDefault()

        const newTasks = [...container.tasks].map((t) => {
            if (taskId === t._id) {
                return { ...t, title: values.title, description: values.description ? values.description : "" }

            }
            return t
        })
        const newCons = containers.map((c) => {
            if (c._id === id) {
                return { ...c, tasks: newTasks };
            }
            return c;
        });
        const newBoards = [...boards].map((b) => {
            if (b._id === boardId) {
                return { ...b, containers: newCons }
            }
            return b
        })


        Promise.all([Api.handleUpdateTask(token, values.title, values.description, id, taskId), Api.handleUpdateUserInfo(token, name, email, newBoards)]).then((data) => {
            if (data) {
                dispatch(setUserInfo(data[1]))
                handleServerMessages('200')
                setBoards(newBoards)
            }
        }).catch((e) => handleServerMessages(e.message))


    }


    return (
        <div className="container p-2" style={{ border: `2px solid ${color}`, boxShadow: `10px 10px 10px ${conShadow} ` }}>
            <PopupWithQuestion dialogTitle='Are you sure you want to delete this task?' idToDelete={taskId} onAgree={handleDeleteTask} isPopupOpen={isPopupOpen} setIsPopupOpen={setIsPopupOpen} />
            <PopupWithForm values={values} formTitle='Change Your Task' isValid={isValid} onSubmit={handleUpdateTask} isPopupOpen={isFormOpen} setIsPopupOpen={setIsFormOpen} >
                <TextField
                    type='text'
                    name='title'
                    required
                    label='Title'
                    className='mt-2 title-input'
                    value={values?.title || ''}
                    onChange={handleChange}
                    inputProps={{ minLength: 2 }}
                ></TextField>
                {
                    errors?.title ?
                        <Typography color='error' className="" variant="subtitle1" > {errors.title}</Typography>
                        : ""
                }
                <TextField
                    rows={4}
                    maxRows={8}
                    name='description'
                    label='Description (optional)'
                    multiline
                    className='mt-2 title-input'
                    value={values?.description || ''}
                    onChange={handleChange}


                ></TextField>

            </PopupWithForm>
            <div className="icons-container">
                <IconButton
                    onMouseDown={() => setDisableDrag(false)}
                    style={{ cursor: "grab" }}
                >
                    <DragHandleIcon className="drag-btn" style={{ fill: color }} />
                </IconButton>
                <div>

                    <IconButton onClick={(e) => { setIsPopupWithFormOpen(true); setConId(id) }} className="p-1" style={{ cursor: "pointer" }}>
                        <EditIcon className="edit-icon" style={{ fill: color }} />
                    </IconButton>
                    <IconButton
                        onClick={() => { setIsDeletePopOpen(true); setConId(id) }}
                        style={{ cursor: "pointer" }}
                    >
                        <DeleteIcon className="delete-icon" style={{ fill: color }} />
                    </IconButton>
                </div>
            </div>
            {/* <h1 className="con__title">{title}</h1> */}
            <Divider className="w-full mb-2" style={{ backgroundColor: color }} />
            <Typography variant='h4' className="con-title" color={color}>{title}</Typography>
            <Divider className="w-full mt-2" style={{ backgroundColor: color }} />
            <div className="tasks-wrapper">
                {tasks &&
                    tasks.map((t, i) => {
                        return (
                            <DndItem
                                Component="div"
                                type="task"
                                disableDrag={disableTaskDrag}
                                setDisableDrag={setDisableTaskDrag}
                                key={t?._id}
                                _id={t?._id}
                                description={t.description}
                                index={i}
                                onDrag={handleDragTask}
                                task={t}
                                container={t?.container}
                                onDragToDiffCon={handleDragTaskToDiffCon}
                                title={t?.title}
                                onDrop={onSave}

                            >
                                <Task setIsFormOpen={setIsFormOpen} setIsPopupOpen={setIsPopupOpen} setTaskId={setTaskId} setDisableDrag={setDisableTaskDrag} task={t} text={t?.title} id={t?._id} onDelete={handleDeleteTask} />
                            </DndItem>
                        );
                    })}
                <div onClick={(e) => { e.stopPropagation(); setIsInputOpen(true) }} className="task task_type_add flex flex-col items-center justify-center relative" style={{
                    opacity: isInputOpen && 1, border: `${!isInputOpen ? `2px dashed ${taskColor}` : "none"}`
                }}>
                    {
                        isInputOpen ?

                            <Input inputStyles={inputStyles} color={taskColor} onAdd={handleAddTask} setIsInputOpen={setIsDeletePopOpen} />
                            :

                            <IconButton className="add-btn" >
                                <AddIcon style={{ fill: taskColor }} />
                            </IconButton>
                    }

                </div>
            </div >



        </div >
    );
};
