import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { handleInputStyles } from '../utils/materialCustomStyles';
import { ThemeProvider } from "@emotion/react";
import { useSelector } from 'react-redux'

import { Button } from '@mui/material';

import './PopupWithForm.css'
import { PreLoader } from '../PreLoader/PreLoader';

export const PopupWithForm = ({ isPopupOpen, setIsPopupOpen, formTitle, values, onSubmit, children, closeProfileMenu, isValid }) => {

    const inputStyles = handleInputStyles('black');
    const isLoading = useSelector(state => state.isLoading);

    const handleClose = () => {
        setIsPopupOpen(false)
    }

    const handleAfterSubmit = () => {

        handleClose();
        closeProfileMenu && closeProfileMenu(false)
    }


    return (
        <Dialog
            open={isPopupOpen}
            onClose={handleClose}

        >
            <div className='p-10 flex flex-col popup-with-form'>
                <DialogTitle className='p-0' id="alert-dialog-title">
                    {formTitle}
                </DialogTitle>
                <DialogContent className='p-0 mt-5' >
                    <form className='popup__form flex flex-col' onSubmit={(e) => { onSubmit(e, values, handleAfterSubmit); }}>
                        <ThemeProvider theme={inputStyles}>
                            {children}

                            <Button style={{ height: 50, backgroundColor: isLoading && 'black' }} type="submit" className={`w-full mt-10 save-btn ${!isValid && 'save-btn_type_disabled'} `} variant='outlined' autoFocus>
                                {
                                    isLoading ? <PreLoader /> : "Save"
                                }
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