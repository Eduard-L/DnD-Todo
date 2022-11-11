import AccountCircle from '@mui/icons-material/AccountCircle';
import IconButton from '@mui/material/IconButton';
import './Nav.css'
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useEffect, useState } from 'react';
import Divider from '@mui/material/Divider';
import { Button, Typography } from "@mui/material"
import { useSelector } from "react-redux"
import { DARK } from '../utils/constants';
import LogoutIcon from '@mui/icons-material/Logout';
import EditIcon from '@mui/icons-material/Edit';
import { PopupWithForm } from '../PopupWithForm/PopupWithForm';
import { TextField } from '@mui/material';
import { darkColor, lightColor } from "../utils/constants";
import { useForm } from '../utils/useForm';
import { useNavigate } from 'react-router-dom';

export const Nav = ({ onSave, onLogOut, onUpdateProfile, boards, onUpdateUser }) => {
    const userInfo = useSelector(state => state.userInfo)
    const visibilityMode = useSelector(state => state.mode)
    const navigate = useNavigate()
    const isDark = visibilityMode === DARK;
    const color = (visibilityMode === DARK) ? darkColor : lightColor;
    const [anchorEl, setAnchorEl] = useState(null);
    const [isPopupWithFormOpen, setIsPopupWithFormOpen] = useState(false);
    // const [formValues, setFormValues] = useState({})
    const [isOpen, setIsOpen] = useState(false)
    const { values, handleChange, resetForm, isValid, errors, setValues, setIsValid, setErrors } = useForm()

    const handleUserIconClick = (event) => {
        setAnchorEl(event.currentTarget);
        setIsOpen(true)
    };
    const handleMenuClose = () => {
        setIsOpen(false)
        setAnchorEl(null)
    };

    useEffect(() => {
        if (userInfo?.name && userInfo?.email && isPopupWithFormOpen) {
            setValues({
                name: userInfo?.name,
                email: userInfo?.email
            })
            setIsValid(true)
            setErrors()
        }
    }, [userInfo, isPopupWithFormOpen])

    return (
        <div className="w-full flex flex-row  " style={{ height: '5%', maxHeight: 40 }}>
            <IconButton onClick={handleUserIconClick} className='navbar__user-btn'><AccountCircle className='nav__user-icon' style={{ fill: `${isDark ? 'white' : 'black'}` }} /></IconButton>
            {/* <Button style={{ color: color, border: `2px solid ${color}` }} className='nav__save-btn ml-4' onClick={onSave} variant="outlined">Save Changes</Button> */}
            <Button style={{ color: color, border: `2px solid ${color}` }} className='nav__save-btn ml-4' onClick={() => navigate('/boards')} variant="outlined">Back To Boards</Button>
            <Menu
                id="demo-positioned-menu"
                style={{ backgroundColor: 'rgba(1,1,1,0.5)' }}
                aria-labelledby="demo-positioned-button"
                anchorEl={anchorEl}
                open={isOpen}
                onClose={handleMenuClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >

                <MenuItem disabled style={{ cursor: 'default', opacity: 1 }} >{`Welcome, ${userInfo.name}`}</MenuItem>
                <Divider />
                <MenuItem className='flex flex-row justify-between' onClick={() => setIsPopupWithFormOpen(true)}>
                    <Typography>Edit Profile</Typography>
                    <EditIcon />
                </MenuItem>
                {/* <MenuItem onClick={onSave}>Save Changes</MenuItem> */}
                <MenuItem className='flex flex-row justify-between' onClick={onLogOut}>
                    <Typography>Logout</Typography>
                    <LogoutIcon />

                </MenuItem>
            </Menu>



            <PopupWithForm isValid={isValid} closeProfileMenu={handleMenuClose} elements={boards} values={values} onSubmit={onUpdateUser} isPopupOpen={isPopupWithFormOpen} setIsPopupOpen={setIsPopupWithFormOpen} formTitle='Edit Profile' >
                <TextField
                    // type='name'
                    name='name'
                    required
                    label='name'
                    className='title-input mt-1'
                    value={values?.name || ''}
                    onChange={handleChange}
                    inputProps={{ minLength: 2, maxLength: 30 }}
                ></TextField>
                {
                    errors?.name &&
                    <Typography color='error' className="" variant="subtitle1" > {errors.name}</Typography>
                }
                <TextField
                    required
                    name="email"
                    type='email'
                    label='email'
                    className='mt-4 title-input'
                    value={values?.email || ''}
                    onChange={handleChange}
                ></TextField>
                {
                    errors?.email &&
                    <Typography color='error' className="" variant="subtitle1" > {errors.email}</Typography>
                }



            </PopupWithForm>
            {/* <div className="flex flex-row w-1/4 justify-between">
                <Button onClick={onLogOut} variant="contained">Log Out</Button>
                
            </div>
            <Typography color='primary' variant='h5'>{userInfo?.name}</Typography> */}
        </div >

    )
}