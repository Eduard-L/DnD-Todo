import './Task.css'
import DragHandleIcon from "@mui/icons-material/DragHandle";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSelector } from 'react-redux';
import { DARK, darkColor, lightColor } from "../utils/constants";
import { Typography } from '@mui/material';

export const Task = ({ setIsFormOpen, text, setDisableDrag, id, setTaskId, setIsPopupOpen }) => {
    // console.log(t)
    const visibilityMode = useSelector((state) => state.mode)
    const color = (visibilityMode === DARK) ? 'white' : lightColor;
    return (
        <div onClick={() => { setTaskId(id); setIsFormOpen(true) }} className="task flex flex-row justify-between" style={{ border: `2px solid ${color}` }}>
            {/* <div className="task-icons-con"> */}
            <IconButton
                onMouseDown={() => setDisableDrag(false)}
                style={{ cursor: "grab", height: 30, width: 30 }}
            >
                <DragHandleIcon className='drag-btn' style={{ fill: color }} />
            </IconButton>
            <Typography variant='h6' className='task-text' color={color}>{text}</Typography>
            {/* </div> */}
            <IconButton onClick={(e) => { e.stopPropagation(); setTaskId(id); setIsPopupOpen(true) }} style={{ cursor: "pointer" }}>
                <DeleteIcon className='delete-icon' style={{ fill: color }} />
            </IconButton>
        </div >
    );
};
