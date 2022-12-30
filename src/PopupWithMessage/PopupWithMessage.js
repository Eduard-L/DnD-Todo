import { Snackbar, Alert, IconButton } from "@mui/material"
import { useSelector, useDispatch } from "react-redux"
import { setIsOpen, setPopupMessage } from "../redux/popupMessageSlice";


export const PopupWithMessage = ({ isOpen, message, severity }) => {

    const dispatch = useDispatch()

    const handleClose = () => {
        dispatch(setPopupMessage({ message: '', isOpen: false, severity: "success" }))
    }


    return (
        <div className="w-full absolute top-10 flex flex-row justify-center">
            <Snackbar style={{ height: 50, position: 'unset' }} open={isOpen} autoHideDuration={3000} onClose={handleClose}>
                <Alert style={{ minWidth: 320 }} severity={severity}>{message}</Alert>
                {/* <IconButton></IconButton> */}
            </Snackbar>
        </div>

    )
}