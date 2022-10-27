import './Input.css'
import { ThemeProvider } from "@emotion/react";
import { useState } from 'react';
import TextField from "@mui/material/TextField";
import { IconButton } from "@mui/material";
import AddCircleOutline from "@mui/icons-material/AddCircleOutline";


export const Input = ({ inputStyles, color, onAdd, setIsInputOpen }) => {
    const [value, setValue] = useState('')

    return (

        <div className=" flex flex-row justify-center items-center  w-full ">
            <ThemeProvider theme={inputStyles}>
                <TextField inputProps={{
                    style: {
                        padding: 5
                    }
                }} value={value || ''} onChange={(e) => { setValue(e.target.value) }} className="task_type_add-input" type='text' name='task-name'></TextField>
            </ThemeProvider>
            {/* <Button  variant="contained" >Add</Button> */}
            <IconButton onClick={(e) => { e.stopPropagation(); onAdd(value); setValue(''); setIsInputOpen(false); }} className='add-btn' >
                < AddCircleOutline style={{ fill: color }} />
            </IconButton>

        </div>

    )
}