import { Card, CardContent, Typography, CardMedia, IconButton } from "@mui/material"
import DragHandleIcon from "@mui/icons-material/DragHandle";
import EditIcon from '@mui/icons-material/Edit';


import DeleteIcon from "@mui/icons-material/Delete";
import "./Board.css"

export const Board = ({ title, id, setBoardId, setIsDeletePopOpen, setIsPopupWithFormOpen }) => {


    return (
        <Card className="board p-2" style={{ border: `2px solid #03e9f4 ` }}>


            <CardContent className="p-0 flex flex-col h-full ">
                <div className="flex flex-row w-full justify-between items-center">
                    <div className="flex flex-row items-center">
                        <IconButton
                            style={{ cursor: "grab", height: 40, width: 40 }}
                        >
                            <DragHandleIcon className='drag-btn' style={{ fill: '#03e9f4' }} />
                        </IconButton>


                        <Typography className="text-center m-0 board__title" color="#03e9f4" gutterBottom variant="h5" component="div">
                            {title.toUpperCase()}
                        </Typography>
                    </div>
                    <div className="flex flex-row">
                        <IconButton onClick={() => { setIsDeletePopOpen(true); setBoardId(id); }} className="p-1" style={{ cursor: "pointer" }}>
                            <DeleteIcon className='delete-icon' style={{ fill: '#03e9f4' }} />
                        </IconButton>
                        <IconButton onClick={() => { setIsPopupWithFormOpen(true); setBoardId(id) }} className="p-1" style={{ cursor: "pointer" }}>
                            <EditIcon className="edit-icon" style={{ fill: '#03e9f4' }} />
                        </IconButton>



                    </div>


                </div>
                <CardMedia
                    style={{ height: '90%' }}
                    className="object-cover rounded"
                    component="img"
                    image="https://images.unsplash.com/photo-1662581871625-7dbd3ac1ca18?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1886&q=80"
                    alt="board img"
                />
            </CardContent>

        </Card >
    )
}