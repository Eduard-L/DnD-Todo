import { Button, Typography } from "@mui/material"
import { useSelector } from "react-redux"

export const Nav = ({ onSave, onLogOut }) => {
    const userInfo = useSelector(state => state.userInfo)

    return (
        <div className="w-full flex flex-row justify-between items-center " style={{ height: '5%' }}>
            <div className="flex flex-row w-1/4 justify-between">
                <Button onClick={onLogOut} variant="contained">Log Out</Button>
                <Button onClick={onSave} variant="contained">Save</Button>
            </div>
            <Typography color='primary' variant='h5'>{userInfo?.name}</Typography>
        </div>

    )
}