import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { Button } from '@mui/material';

import './PopupWithQuestion.css'

export const PopupWithQuestion = ({ onAgree, idToDelete, dialogTitle, isPopupOpen, setIsPopupOpen, boardId }) => {

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
            <div className='p-5 text-center'>
                <DialogTitle id="alert-dialog-title">
                    {dialogTitle}
                </DialogTitle>

                <DialogActions className='flex justify-center flex-row mt-2'>
                    <Button className='cancel-btn' variant='outlined' onClick={handleClose}>Cancel</Button>
                    <Button className='ok-btn' variant='outlined' onClick={() => { onAgree(idToDelete, boardId); handleClose(); }} autoFocus>
                        Ok
                    </Button>
                </DialogActions>
            </div>
        </Dialog >

    )
}