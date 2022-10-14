import { DndItem } from "./DndItem";
import { Container } from "./Container/Container.js";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Nav } from "./Nav/Nav";
import { Button, IconButton } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from "react";
import AddCircleOutline from "@mui/icons-material/AddCircleOutline";



export const Main = ({ ...props }) => {
    const { onDeleteCon, onSave, onLogOut, userInfo, disableDrag, handleAddContainer, containers, conTitle, setConTitle, handleDragItem, setDisableDrag, setContainers, selectId, options, handleChangeSelect, token } = props
    const [isInputOpen, setIsInputOpen] = useState(false)

    useEffect(() => {
        window.addEventListener('click', handleInputClose)

        return () => {
            window.removeEventListener('click', handleInputClose)
        }
    }, [])

    useEffect(() => {
        if (containers?.length > 0) {
            setIsInputOpen(false)
        }
    }, [containers?.length])

    const handleInputClose = (e) => {

        setIsInputOpen(false)

    }


    return (
        <div className="w-full h-full flex flex-col justify-between">
            <Nav onSave={onSave} onLogOut={onLogOut} userInfo={userInfo} />


            <div className="container-wrapper">
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
                                />
                            </DndItem>
                        );
                    })}
                <div className="container container_type_add " style={{ opacity: isInputOpen && 1, cursor: isInputOpen && 'default' }}>
                    {
                        isInputOpen ? <form onSubmit={handleAddContainer} onClick={(e) => e.stopPropagation()} className="form container-form">
                            <TextField
                                name="container-title"
                                className="container-title"
                                type="text"
                                label='Title'
                                required
                                value={conTitle}
                                onChange={(e) => setConTitle((e.target.value).toUpperCase())}
                            />
                            {/* <Button type="submit" className="add-container-btn">
                                Add Container
                            </Button> */}

                            <IconButton type="submit" >
                                < AddCircleOutline />
                            </IconButton>

                        </form> :

                            <IconButton className='add-container-btn' onClick={(e) => { e.stopPropagation(); setIsInputOpen(true) }}>
                                <AddIcon style={{ width: 50, height: 50, fill: "lightskyblue" }} />
                            </IconButton>

                    }


                </div>
            </div>

        </div >

    )





}