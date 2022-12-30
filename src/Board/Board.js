import { Card, CardContent, Typography, CardMedia, IconButton, Divider } from "@mui/material"
import DragHandleIcon from "@mui/icons-material/DragHandle";
import EditIcon from '@mui/icons-material/Edit';
import { DARK, darkColor, lightColor, darkContainerColor } from "../utils/constants";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSelector } from "react-redux";
import "./Board.css"
import { useNavigate } from "react-router-dom";

export const Board = ({ setDisableDrag, title, id, setBoardId, setIsDeletePopOpen, setIsPopupWithFormOpen, img }) => {
    const visibilityMode = useSelector((state) => state.mode)
    const color = (visibilityMode === DARK) ? darkColor : lightColor;
    const boxShadowColor = (visibilityMode === DARK) ? darkContainerColor : lightColor;
    const navigate = useNavigate()
    return (
        <Card onClick={() => navigate(`/boards/${id}/containers`)} className="board p-2" style={{ border: `2px solid ${color}  `, boxShadow: `8px 8px 8px ${boxShadowColor}` }}>


            <CardContent className="p-0 flex flex-col h-full " style={{ padding: 0 }}>
                <div className="flex flex-row w-full justify-between items-center">
                    <div className="flex flex-row items-center">
                        <IconButton
                            onMouseDown={() => setDisableDrag(false)}

                            style={{ cursor: "grab", height: 40, width: 40 }}
                        >
                            <DragHandleIcon className='drag-btn' style={{ fill: color }} />
                        </IconButton>


                        <Typography className="text-center m-0 board__title" color={color} gutterBottom variant="h5" component="div">
                            {title.toUpperCase()}
                        </Typography>
                    </div>
                    <div className="flex flex-row">
                        <IconButton onClick={(e) => { e.stopPropagation(); setIsDeletePopOpen(true); setBoardId(id); }} className="p-1" style={{ cursor: "pointer" }}>
                            <DeleteIcon className='delete-icon' style={{ fill: color }} />
                        </IconButton>
                        <IconButton onClick={(e) => { e.stopPropagation(); setIsPopupWithFormOpen(true); setBoardId(id) }} className="p-1" style={{ cursor: "pointer" }}>
                            <EditIcon className="edit-icon" style={{ fill: color }} />
                        </IconButton>



                    </div>


                </div>
                <Divider className="w-full mb-2" style={{ backgroundColor: color }} />
                <CardMedia
                    style={{ height: '90%' }}
                    className="object-cover rounded"
                    component="img"
                    image={img}
                    alt="board img"
                />
            </CardContent>

        </Card >
    )
}