import './Input.css'
import { ThemeProvider } from "@emotion/react";
import { useState } from 'react';
import TextField from "@mui/material/TextField";
import { IconButton } from "@mui/material";
import AddCircleOutline from "@mui/icons-material/AddCircleOutline";
import { useForm } from '../utils/useForm';
import { Typography } from '@mui/material';


export const Input = ({ inputStyles, color, onAdd, setIsInputOpen, boardId }) => {
    const [value, setValue] = useState('')
    const { values, handleChange, resetForm, isValid, errors } = useForm()

    const handleSubmit = (e) => {
        e.preventDefault()
        onAdd(values?.title?.toUpperCase(), boardId);
        resetForm()
        setIsInputOpen(false);
    }

    return (

        <form className=" flex flex-col justify-center items-center w-full mt-6 " onSubmit={handleSubmit}>
            <div className='flex flex-row items-center'>
                <ThemeProvider theme={inputStyles}>
                    <TextField
                        inputProps={{ minLength: 2, maxLength: 30 }}
                        value={values?.title?.toUpperCase() || ''}
                        onChange={handleChange}
                        className="task_type_add-input"
                        type='text'
                        name='title'
                        label='Title'
                        required
                    ></TextField>
                </ThemeProvider>

                <IconButton disabled={!isValid} type='submit' className='add-btn' >
                    < AddCircleOutline style={{ fill: color, opacity: !isValid && 0.5 }} />
                </IconButton>
            </div>
            <div className='px-4  self-start w-5/6 text-center'>
                {
                    errors?.title ?
                        <Typography className='error-text' color='error' variant="body2" > {errors.title}</Typography>
                        :
                        <div style={{ height: 20 }}></div>
                }
            </div>

        </form>

    )
}