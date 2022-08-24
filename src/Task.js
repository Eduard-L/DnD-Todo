import DragHandleIcon from "@mui/icons-material/DragHandle";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
export const Task = ({ text, setDisableDrag }) => {
    return (
        <div className="task">
            <div className="task-icons-con">
                <IconButton
                    onMouseDown={() => setDisableDrag(false)}
                    style={{ cursor: "grab", height: 30, width: 30 }}
                >
                    <DragHandleIcon />
                </IconButton>
                <p>{text}</p>
            </div>
            <IconButton style={{ cursor: "pointer" }}>
                <DeleteIcon />
            </IconButton>
        </div>
    );
};
