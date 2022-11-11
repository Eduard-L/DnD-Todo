import { DndItem } from "../DndItem/DndItem";
// import { Container } from "../Container/Container.js";
// import TextField from "@mui/material/TextField";
// import Autocomplete from "@mui/material/Autocomplete";
import { Nav } from "../Nav/Nav";
import { IconButton } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from "react";
// import AddCircleOutline from "@mui/icons-material/AddCircleOutline";
import { DARK, darkColor, lightColor } from "../utils/constants";
import { handleInputStyles } from '../utils/materialCustomStyles'
import { useSelector } from "react-redux";
// import { ThemeProvider } from "@emotion/react";
import './Boards.css'
import { Board } from "../Board/Board";
import { Input } from "../Input/Input";
import { PopupWithQuestion } from "../PopupWithQuestion/PopupWithQuestion";
import { PopupWithForm } from "../PopupWithForm/PopupWithForm";
import { TextField } from '@mui/material';
import { useForm } from "../utils/useForm";
import { Typography } from "@mui/material";



export const Boards = ({ ...props }) => {
    const { onUpdateUser, onUpdate, onDelete, handleDragItems, onAddBoard, setBoards, boards } = props
    const [isInputOpen, setIsInputOpen] = useState(false)
    const visibilityMode = useSelector((state) => state.mode)
    const color = (visibilityMode === DARK) ? darkColor : lightColor;
    const inputStyles = handleInputStyles(color, 0);
    const [boardId, setBoardId] = useState()
    const [isDeletePopOpen, setIsDeletePopOpen] = useState(false)
    const [isPopupWithFormOpen, setIsPopupWithFormOpen] = useState(false);
    const [formValues, setFormValues] = useState({})
    const [disableDrag, setDisableDrag] = useState(true)
    const { values, handleChange, resetForm, isValid, errors, setValues, setIsValid, setErrors } = useForm()

    useEffect(() => {
        window.addEventListener('click', handleInputClose)


        return () => {
            window.removeEventListener('click', handleInputClose)
        }
    }, [])

    useEffect(() => {
        if (!isPopupWithFormOpen && !isDeletePopOpen) {
            setBoardId(null)
        }

    }, [isDeletePopOpen, isPopupWithFormOpen])



    useEffect(() => {

        if (boardId && isPopupWithFormOpen) {
            const board = boards.find((b) => b._id === boardId)
            setValues({
                title: board.title,
                id: board._id
            })
            setIsValid(true)
            setErrors()

        }

    }, [boardId, isPopupWithFormOpen])


    const handleInputClose = (e) => {

        setIsInputOpen(false)

    }







    return (
        <div className="w-full h-full flex flex-col justify-between">
            {/* <Nav boards={boards} onUpdateUser={onUpdateUser} onSave={onSave} onLogOut={onLogOut} userInfo={userInfo} /> */}

            <div className="boards ">

                {
                    boards.length > 0 && boards.map((board, index) => {
                        return (
                            <DndItem onDrop={onUpdateUser} setDisableDrag={setDisableDrag} disableDrag={disableDrag} type='board' Component='div' key={board._id} onDrag={handleDragItems} _id={board._id} index={index} items={boards} setItems={setBoards} >
                                <Board setDisableDrag={setDisableDrag} setIsPopupWithFormOpen={setIsPopupWithFormOpen} setIsDeletePopOpen={setIsDeletePopOpen} setBoardId={setBoardId} id={board._id} title={board.title} onDelete={onDelete} />
                            </DndItem>
                        )
                    })
                }

                <div className="board board_type_add p-2 justify-center flex items-center" onClick={(e) => { e.stopPropagation(); setIsInputOpen(true) }} style={{ border: `2px dashed ${color} ` }}>
                    {
                        isInputOpen ?
                            <Input setIsInputOpen={setIsInputOpen} inputStyles={inputStyles} color={color} onAdd={onAddBoard} /> :
                            <IconButton className="btn_type_show-input" style={{ height: 70 }} >
                                <AddIcon style={{ fill: color, width: 50, height: 50 }} />
                            </IconButton>
                    }
                </div>

            </div>

            <PopupWithQuestion dialogTitle="Are you sure you want to delete this board?" onAgree={onDelete} idToDelete={boardId} isPopupOpen={isDeletePopOpen} setIsPopupOpen={setIsDeletePopOpen} />
            <PopupWithForm isValid={isValid} onSubmit={onUpdate} values={values} setValues={setValues} isPopupOpen={isPopupWithFormOpen} setIsPopupOpen={setIsPopupWithFormOpen} formTitle='Edit Board' >

                <TextField
                    type='text'
                    name='title'
                    required
                    label='Title'
                    className='mt-2 title-input'
                    value={values.title || ''}
                    onChange={handleChange}
                    inputProps={{
                        minLength: 2
                    }}

                ></TextField>
                {
                    errors?.title &&
                    <Typography color='error' className="" variant="subtitle1" > {errors.title}</Typography>
                }

            </PopupWithForm>
        </div >

    )





}



