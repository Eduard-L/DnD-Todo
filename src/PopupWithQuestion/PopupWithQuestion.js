import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '@mui/material';

import './PopupWithQuestion.css'

export const PopupWithQuestion = ({ onAgree, idToDelete, dialogTitle, isPopupOpen, setIsPopupOpen }) => {

    const handleClose = () => {
        setIsPopupOpen(false)
    }


    return (
        <Dialog
            open={isPopupOpen}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {dialogTitle}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">

                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button variant='outlined' onClick={handleClose}>Cancel</Button>
                <Button variant='outlined' onClick={() => { onAgree(idToDelete, handleClose) }} autoFocus>
                    Ok
                </Button>
            </DialogActions>
        </Dialog >

    )
}