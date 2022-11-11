import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { handleInputStyles } from '../utils/materialCustomStyles';
import { ThemeProvider } from "@emotion/react";

import { Button } from '@mui/material';

import './PopupWithForm.css'

export const PopupWithForm = ({ isPopupOpen, setIsPopupOpen, formTitle, values, onSubmit, children, closeProfileMenu, isValid }) => {

    const inputStyles = handleInputStyles('black')

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
                    <form className='popup__form flex flex-col' onSubmit={(e) => { onSubmit(e, values); handleClose(); closeProfileMenu && closeProfileMenu(false) }}>
                        <ThemeProvider theme={inputStyles}>
                            {children}

                            <Button style={{ height: 50 }} type="submit" className={`w-full mt-10 save-btn ${!isValid && 'save-btn_type_disabled'} `} variant='outlined' autoFocus>
                                Save
                            </Button>
                        </ThemeProvider>
                    </form>
                </DialogContent>
                {/* <DialogActions className='flex items-center justify-center p-0 mt-10'>

                </DialogActions> */}
            </div>
        </Dialog >

    )
}