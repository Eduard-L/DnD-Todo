import { Button, TextField, Typography } from "@mui/material"
import { useState } from "react"
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link } from "react-router-dom";
import { useForm } from '../utils/useForm'
import Lottie from "lottie-react";
import lottieSrc from '../assets/lottie/95434-history.json'
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { InputAdornment } from '@mui/material';
import { IconButton } from "@mui/material";
import { useSelector } from "react-redux";
import { DARK, darkColor, lightColor } from "../utils/constants";
import { PreLoader } from "../PreLoader/PreLoader";
import { handleInputStyles } from '../utils/materialCustomStyles'


export const Register = ({ text, btnText, handleSubmit, isRegisterFormOpen, subtitleText, path }) => {

    const visibilityMode = useSelector((state) => state.mode)
    const isLoading = useSelector((state) => state.isLoading)
    const { values, handleChange, resetForm, isValid, errors } = useForm()
    const [isPasswordVisible, setIsPassword] = useState(false)
    const [isConfirmVisible, setIsConfirmVisible] = useState(false)


    const color = (visibilityMode === DARK) ? darkColor : lightColor;

    const themeForInput = handleInputStyles(color)

    return (
        <>
            <Lottie className='lottie-animation' animationData={lottieSrc} loop={true} />
            <form onSubmit={(e) => handleSubmit(e, values)} className="flex flex-col register-form p-6 rounded-xl " style={{ backgroundColor: (visibilityMode !== DARK) && 'rgba(0,0,0,.1)' }}>

                <Typography color={color} className="text-center" variant="h2">{text}</Typography>
                <div className="flex flex-col mt-4">
                    <ThemeProvider theme={themeForInput}>
                        {
                            isRegisterFormOpen &&
                            <TextField InputProps={{ minLength: 2, maxLength: 30 }} className='mt-2' value={values.name} onChange={handleChange} name="name" type='text' label="Name" required inputProps={{ minLength: 2 }}></TextField>
                        }
                        {
                            errors.name && isRegisterFormOpen &&
                            <Typography color='error' className="" variant="subtitle1" > {errors.name}</Typography>
                        }


                        <TextField value={values.email} onChange={handleChange} name="email" className="mt-4" type="email" label="Email" required inputProps={{ minLength: 6 }}></TextField>
                        {
                            errors.email &&
                            <Typography color='error' className="" variant="subtitle1" > {errors.email}</Typography>
                        }
                        <TextField InputProps={{

                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton

                                        onClick={() => setIsPassword(!isPasswordVisible)}
                                    >
                                        {isPasswordVisible ? <Visibility style={{ fill: 'white' }} /> : <VisibilityOff style={{ fill: 'white' }} />}
                                    </IconButton>
                                </InputAdornment>
                            )


                        }} value={values.password} inputProps={{ minLength: 8 }} onChange={handleChange} name="password" className="mt-4" type={!isPasswordVisible ? 'password' : 'text'} label="Password" required ></TextField>
                        {
                            errors.password &&
                            <Typography color='error' className="" variant="subtitle1" > {errors.password}</Typography>
                        }

                        {


                            isRegisterFormOpen &&
                            <TextField InputProps={{

                                endadornment: (
                                    <InputAdornment position="end">
                                        <IconButton

                                            onClick={() => setIsConfirmVisible(!isConfirmVisible)}
                                        >
                                            {isConfirmVisible ? <Visibility style={{ fill: 'white' }} /> : <VisibilityOff style={{ fill: 'white' }} />}
                                        </IconButton>
                                    </InputAdornment>
                                )


                            }} inputProps={{ minLength: 8 }} style={{ color: color }} value={values.confirm} onChange={handleChange} name="confirm" className="mt-4" type={!isConfirmVisible ? 'password' : 'text'} label="Confirm" required ></TextField>


                        }
                        {
                            errors.confirm && isRegisterFormOpen &&
                            <Typography color='error' className="" variant="subtitle1" > {errors.confirm}</Typography>
                        }
                    </ThemeProvider>
                    <Button disabled={!isValid} className="mt-8 login-btn " type="submit" variant="contained" style={{ border: `1px solid  ${color}`, height: 55 }}>
                        {
                            isLoading ? <PreLoader /> : <Typography color={color} className="text-center font-bold" variant="subtitle1" > {btnText}</Typography>
                        }

                    </Button>

                    <Link onClick={() => resetForm()} to={path} style={{ cursor: 'pointer', fontSize: 12, color: color }} className="text-center mt-4 login-subtitle " variant="subtitle1" required> {subtitleText}</Link>

                </div>
            </form >
        </>
    )
}