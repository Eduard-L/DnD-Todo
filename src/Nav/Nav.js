import AccountCircle from '@mui/icons-material/AccountCircle';
import IconButton from '@mui/material/IconButton';
import './Nav.css'
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';
import Divider from '@mui/material/Divider';
import { Button, Typography } from "@mui/material"
import { useSelector } from "react-redux"
import { DARK } from '../utils/constants';

export const Nav = ({ onSave, onLogOut }) => {
    const userInfo = useSelector(state => state.userInfo)
    const visibilityMode = useSelector(state => state.mode)
    const isDark = visibilityMode === DARK;
    const [anchorEl, setAnchorEl] = useState(null);
    // const isOpen = Boolean(anchorEl);
    const [isOpen, setIsOpen] = useState(false)

    const handleUserIconClick = (event) => {
        setAnchorEl(event.currentTarget);
        setIsOpen(true)
    };
    const handleMenuClose = () => {
        setIsOpen(false)
        setAnchorEl(null)
    };



    return (
        <div className="w-full flex flex-row justify-between " style={{ height: '5%', width: 200 }}>
            <IconButton onClick={handleUserIconClick} className='navbar__user-btn'><AccountCircle className='nav__user-icon' style={{ fill: `${isDark ? 'white' : 'black'}` }} /></IconButton>
            <Button className='nav__save-btn' onClick={onSave} variant="outlined">Save Changes</Button>
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
                <MenuItem onClick={handleMenuClose}>Edit Profile</MenuItem>
                {/* <MenuItem onClick={onSave}>Save Changes</MenuItem> */}
                <MenuItem onClick={onLogOut}>Logout</MenuItem>
            </Menu>
            {/* <div className="flex flex-row w-1/4 justify-between">
                <Button onClick={onLogOut} variant="contained">Log Out</Button>
                
            </div>
            <Typography color='primary' variant='h5'>{userInfo?.name}</Typography> */}
        </div >

    )
}