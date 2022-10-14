import './Task.css'
import DragHandleIcon from "@mui/icons-material/DragHandle";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
export const Task = ({ text, setDisableDrag, t, onDelete, id }) => {
    // console.log(t)
    return (
        <div className="task flex flex-row justify-between">
            {/* <div className="task-icons-con"> */}
            <IconButton
                onMouseDown={() => setDisableDrag(false)}
                style={{ cursor: "grab", height: 30, width: 30 }}
            >
                <DragHandleIcon className='drag-btn' style={{ fill: '#03e9f4' }} />
            </IconButton>
            <p className="task-text text-center">{text}</p>
            {/* </div> */}
            <IconButton onClick={() => onDelete(id)} style={{ cursor: "pointer" }}>
                <DeleteIcon className='delete-icon' style={{ fill: '#03e9f4' }} />
            </IconButton>
        </div>
    );
};
