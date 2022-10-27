import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { Button, TextField } from '@mui/material';

import './PopupWithForm.css'

export const PopupWithForm = ({ isPopupOpen, setIsPopupOpen, formTitle, values, setValues, onSubmit }) => {

    const handleClose = () => {
        setIsPopupOpen(false)
    }


    return (
        <Dialog
            open={isPopupOpen}
            onClose={handleClose}

        >
            <div className='p-10 flex flex-col' style={{ width: 500 }}>
                <DialogTitle className='p-0' id="alert-dialog-title">
                    {formTitle}
                </DialogTitle>
                <DialogContent className='p-0 mt-5' >
                    {/* <DialogContentText id="alert-dialog-description"> */}
                    <form className='popup__form flex flex-col' onSubmit={(e) => { onSubmit(e, values.id, values.title, [], handleClose) }}>

                        <TextField
                            type='text'
                            label='Title'
                            className='mt-2'
                            value={values.title || ''}
                            onChange={(e) => { setValues({ ...values, title: e.target.value }) }}
                        ></TextField>

                        <Button type="submit" className='w-full mt-10' variant='outlined' onClick={() => { }} autoFocus>
                            Save
                        </Button>
                    </form>
                    {/* </DialogContentText> */}
                </DialogContent>
                {/* <DialogActions className='flex items-center justify-center p-0 mt-10'>

                </DialogActions> */}
            </div>
        </Dialog >

    )
}