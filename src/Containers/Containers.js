import './Containers.css'
import { useEffect, useState } from 'react'
import { DndItem } from '../DndItem/DndItem'
import { Container } from '../Container/Container'
import { TextField } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import { IconButton } from '@mui/material'
import { handleInputStyles } from '../utils/materialCustomStyles';
import { DARK, darkColor, lightColor } from "../utils/constants";
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { PopupWithQuestion } from '../PopupWithQuestion/PopupWithQuestion'
import { PopupWithForm } from '../PopupWithForm/PopupWithForm'
import { Api } from '../utils/myApi'
import { setUserInfo } from '../redux/userInfoSlice'
import { Input } from '../Input/Input'
import { useForm } from '../utils/useForm'
import { Typography } from "@mui/material";
import { setIsLoading } from '../redux/isLoadingSlice'





export const Containers = ({ handleAddContainer, handleDragItem, container, token, onDeleteCon, ...props }) => {
    const { onSave, onAddContainer, boards, setBoards, handleServerMessages } = props

    const [containers, setContainers] = useState([])
    const [isInputOpen, setIsInputOpen] = useState(false)
    const [conId, setConId] = useState()
    const [isDeletePopOpen, setIsDeletePopOpen] = useState(false)
    const [isPopupWithFormOpen, setIsPopupWithFormOpen] = useState(false);
    const visibilityMode = useSelector((state) => state.mode)
    const color = (visibilityMode === DARK) ? darkColor : lightColor;
    // const color = 'green'
    const inputStyles = handleInputStyles(color)
    const { boardId } = useParams()
    const userInfo = useSelector((state) => state.userInfo)
    const dispatch = useDispatch()
    const [disableDrag, setDisableDrag] = useState(true)
    const { values, handleChange, resetForm, isValid, errors, setValues, setIsValid, setErrors } = useForm();

    useEffect(() => {
        localStorage.setItem('location', window.location.pathname)
    }, [])

    useEffect(() => {
        if (boards && boardId) {
            setContainers(() => {
                const board = boards.find((b) => b._id === boardId)

                return board.containers
            })
        }
    }, [boards])

    useEffect(() => {
        window.addEventListener('click', handleCloseInput)

        return () => {
            window.removeEventListener('click', handleCloseInput)
        }
    }, [])

    useEffect(() => {
        if (!isDeletePopOpen && !isPopupWithFormOpen) {
            setConId()
        }
    }, [isDeletePopOpen, isPopupWithFormOpen])

    useEffect(() => {
        if (isPopupWithFormOpen) {
            const title = containers.find((c) => c._id === conId).title
            setValues({
                title: title
            })
            setIsValid(true)
            setErrors()
        }


    }, [isPopupWithFormOpen])



    const handleDragContainers = (dragIndex, hoverIndex) => { // think how not to dublitae app.js handler

        const newContainers = [...containers];
        const dragItem = containers[dragIndex];
        if (!dragItem) return


        newContainers.splice(dragIndex, 1);
        newContainers.splice(hoverIndex, 0, dragItem);

        setContainers(newContainers)

        const newBoards = [...boards].map((b) => {
            if (b._id === boardId) {
                return { ...b, containers: newContainers }
            }
            return b
        })

        setBoards(newBoards)

    }

    const handleChangeConTitle = (e, values, postSubmitCallBack) => {
        e.preventDefault();
        dispatch(setIsLoading(true))

        const newCons = [...containers].map((c) => {
            if (c._id === conId) {
                return { ...c, title: values.title }
            }
            return c
        })

        const newBoards = [...boards].map((b) => {
            if (b._id === boardId) {
                return { ...b, containers: newCons }
            }
            return b

        })

        Promise.all([Api.handleUpdateCon(token, conId, values), Api.handleUpdateUserInfo(token, userInfo.name, userInfo.email, newBoards)]).then((data) => {
            if (data) {
                dispatch(setUserInfo(data[1]))
                handleServerMessages('200')
                setBoards(newBoards);
                postSubmitCallBack()
            }
        }).catch((e) => handleServerMessages(e.message))
            .finally(() => dispatch(setIsLoading(false)))



    }



    const handleCloseInput = () => {
        setIsInputOpen(false)
    }



    return (
        <div className="container-wrapper mt-6">
            <PopupWithForm isValid={isValid} onSubmit={handleChangeConTitle} isPopupOpen={isPopupWithFormOpen} setIsPopupOpen={setIsPopupWithFormOpen} values={values} formTitle="Edit title" >
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
                    errors?.title &&
                    <Typography color='error' className="" variant="subtitle1" > {errors.title}</Typography>
                }
            </PopupWithForm>
            <PopupWithQuestion dialogTitle="Are you sure you want to delete this container?" onAgree={onDeleteCon} idToDelete={conId} isPopupOpen={isDeletePopOpen} setIsPopupOpen={setIsDeletePopOpen} boardId={boardId} />
            {containers.length > 0 &&
                containers?.map((c, index) => {
                    return (
                        <DndItem
                            onDrag={handleDragContainers}
                            disableDrag={disableDrag}
                            setDisableDrag={setDisableDrag}
                            items={containers}
                            setItems={setContainers}
                            Component="div"
                            key={c?._id}
                            _id={c?._id}
                            index={index}
                            tasks={c?.tasks}
                            disAbleDrag={disableDrag}
                            setDisbaleDrag={setDisableDrag}
                            type="container"
                            onDrop={onSave}
                        >
                            <Container
                                setConId={setConId}
                                setIsDeletePopOpen={setIsDeletePopOpen}
                                setIsPopupWithFormOpen={setIsPopupWithFormOpen}
                                container={c}
                                onDisableDrag={setDisableDrag}
                                title={c?.title}
                                tasks={c?.tasks}
                                key={c?._id}
                                id={c?._id}
                                containers={containers}
                                setContainers={setContainers}
                                token={token}
                                onDelete={onDeleteCon}
                                handleServerMessages={handleServerMessages}
                                boardId={boardId}
                                boards={boards}
                                setBoards={setBoards}
                                setDisableDrag={setDisableDrag}
                                onSave={onSave}

                            />
                        </DndItem>
                    );
                })}
            <div className="container container_type_add " onClick={(e) => { e.stopPropagation(); setIsInputOpen(true) }} style={{ opacity: isInputOpen && 1, cursor: isInputOpen && 'default', border: `2px dashed ${color}` }}>
                {
                    isInputOpen ?

                        <div className='w-full'>
                            <Input inputStyles={inputStyles} color={color} onAdd={onAddContainer} setIsInputOpen={setIsInputOpen} boardId={boardId} />

                        </div>


                        :

                        <IconButton className='add-container-btn' >
                            <AddIcon style={{ width: 50, height: 50, fill: color }} />
                        </IconButton>

                }


            </div>
        </div >

    )
}