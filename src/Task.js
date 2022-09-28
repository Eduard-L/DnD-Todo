import DragHandleIcon from "@mui/icons-material/DragHandle";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
export const Task = ({ text, setDisableDrag, t, onDelete, id }) => {
    // console.log(t)
    return (
        <div className="task">
            <div className="task-icons-con">
                <IconButton
                    onMouseDown={() => setDisableDrag(false)}
                    style={{ cursor: "grab", height: 30, width: 30 }}
                >
                    <DragHandleIcon />
                </IconButton>
                <p className="task-text">{text}</p>
            </div>
            <IconButton onClick={() => onDelete(id)} style={{ cursor: "pointer" }}>
                <DeleteIcon />
            </IconButton>
        </div>
    );
};
