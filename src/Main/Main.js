import { DndItem } from "../DndItem";
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
import './Main.css'
import { Board } from "../Board/Board";
import { Input } from "../Input/Input";
import { PopupWithQuestion } from "../PopupWithQuestion/PopupWithQuestion";
import { PopupWithForm } from "../PopupWithForm/PopupWithForm";



export const Main = ({ ...props }) => {
    const { onUpdate, onDelete, handleDragItems, onAddBoard, setBoards, boards, onSave, onLogOut, userInfo } = props
    const [isInputOpen, setIsInputOpen] = useState(false)
    const visibilityMode = useSelector((state) => state.mode)
    const color = (visibilityMode === DARK) ? darkColor : lightColor;
    const inputStyles = handleInputStyles(color, 0);
    const [boardId, setBoardId] = useState()
    const [isDeletePopOpen, setIsDeletePopOpen] = useState(false)
    const [isPopupWithFormOpen, setIsPopupWithFormOpen] = useState(false);
    const [formValues, setFormValues] = useState({})

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
            setFormValues({
                title: board.title,
                id: board._id
            })
            console.log(formValues)
        }

    }, [boardId, isPopupWithFormOpen])


    const handleInputClose = (e) => {

        setIsInputOpen(false)

    }





    return (
        <div className="w-full h-full flex flex-col justify-between">
            <Nav onSave={onSave} onLogOut={onLogOut} userInfo={userInfo} />

            <div className="boards ">

                {
                    boards.length > 0 && boards.map((board, index) => {
                        return (
                            <DndItem type='board' Component='div' key={board._id} onDrag={handleDragItems} id={board._id} index={index} items={boards} setItems={setBoards} >
                                <Board setIsPopupWithFormOpen={setIsPopupWithFormOpen} setIsDeletePopOpen={setIsDeletePopOpen} setBoardId={setBoardId} id={board._id} title={board.title} onDelete={onDelete} />
                            </DndItem>
                        )
                    })
                }

                <div className="board p-2 justify-center flex items-center" onClick={(e) => { e.stopPropagation(); setIsInputOpen(true) }} style={{ border: `2px dashed ${color} ` }}>
                    {
                        isInputOpen ?
                            <Input setIsInputOpen={setIsInputOpen} inputStyles={inputStyles} color={color} onAdd={onAddBoard} /> :
                            <IconButton style={{ height: 70 }} >
                                <AddIcon style={{ fill: color, width: 50, height: 50 }} />
                            </IconButton>
                    }
                </div>

            </div>

            <PopupWithQuestion dialogTitle="Are you sure you want to delete this board?" onAgree={onDelete} idToDelete={boardId} isPopupOpen={isDeletePopOpen} setIsPopupOpen={setIsDeletePopOpen} />
            <PopupWithForm onSubmit={onUpdate} values={formValues} setValues={setFormValues} isPopupOpen={isPopupWithFormOpen} setIsPopupOpen={setIsPopupWithFormOpen} formTitle='Edit Board' >

            </PopupWithForm>
        </div >

    )





}



{/* <div className="container-wrapper">
                {containers &&
                    containers?.map((c, index) => {
                        return (
                            <DndItem
                                onHover={handleDragItem}
                                Component="div"
                                key={c?._id}
                                id={c?._id}
                                index={index}
                                tasks={c?.tasks}
                                disAbleDrag={disableDrag}
                                setDisbaleDrag={setDisableDrag}
                                type="container"
                            >
                                <Container
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
                                />
                            </DndItem>
                        );
                    })}
                <div className="container container_type_add " onClick={(e) => { e.stopPropagation(); setIsInputOpen(true) }} style={{ opacity: isInputOpen && 1, cursor: isInputOpen && 'default' }}>
                    {
                        isInputOpen ? <form onSubmit={handleAddContainer} onClick={(e) => e.stopPropagation()} className="form container-form">
                            <ThemeProvider theme={inputStyles}>
                                <TextField
                                    name="container-title"
                                    className="container-title"
                                    type="text"
                                    label='Title'
                                    required
                                    value={conTitle}
                                    onChange={(e) => setConTitle((e.target.value).toUpperCase())}
                                />
                            </ThemeProvider>
                            {/* <Button type="submit" className="add-container-btn">
                                Add Container
                            </Button> */}

            //                 <IconButton className="add-btn" type="submit" >
            //                     < AddCircleOutline style={{ fill: color }} />
            //                 </IconButton>

            //             </form> :

            //                 <IconButton className='add-container-btn' >
            //                     <AddIcon style={{ width: 50, height: 50, fill: "white" }} />
            //                 </IconButton>

            //         }


            //     </div>
            // </div> */}