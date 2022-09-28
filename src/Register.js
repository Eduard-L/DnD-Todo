import { Button, TextField, Typography } from "@mui/material"
import { useState } from "react"

export const Register = ({ text, btnText, handleSubmit, isRegisterFormOpen }) => {

    const [values, setValues] = useState({
        name: "",
        email: "",
        password: "",
        confirm: ""
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setValues({ ...values, [name]: value })
    }



    return (
        <form onSubmit={(e) => handleSubmit(e, values)} className="flex flex-col ">
            <Typography className="text-center" variant="h2">{text}</Typography>

            {
                isRegisterFormOpen &&
                <TextField value={values.name} onChange={handleChange} name="name" className="mt-2" type='text' label="* Name"></TextField>

            }


            <TextField value={values.email} onChange={handleChange} name="email" className="mt-2" type="email" label="* Email"></TextField>
            <TextField value={values.password} onChange={handleChange} name="password" className="mt-2" type="password" label="* Password"></TextField>
            {


                isRegisterFormOpen &&
                <TextField value={values.confirm} onChange={handleChange} name="confirm" className="mt-2" type="password" label="* Confirm"></TextField>


            }

            <Button type="submit" variant="contained">{btnText}</Button>


        </form>
    )
}