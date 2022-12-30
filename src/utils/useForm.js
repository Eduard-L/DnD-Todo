import { useState } from "react"
import { useCallback } from "react"

export const useForm = () => {
    const [values, setValues] = useState({
        name: "",
        email: "",
        password: "",
        confirm: ""
    })

    const [errors, setErrors] = useState({})

    const [isValid, setIsValid] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target

        if (name === 'title') {
            setValues({ ...values, [name]: value.toUpperCase() })
        } else {
            setValues({ ...values, [name]: value })
        }

        setErrors({
            ...errors,
            [name]: e.target.validationMessage
        })
        setIsValid(e.target.closest('form').checkValidity())
    }
    const resetForm = useCallback(
        (newValues = {}, newErrors = {}, newIsValid = false) => {
            setValues({
                name: "",
                email: "",
                password: "",
                confirm: ""
            });
            setErrors(newErrors);
            setIsValid(newIsValid);


        },
        [setValues, setErrors, setIsValid]);

    return { values, handleChange, resetForm, isValid, errors, setValues, setIsValid, setErrors }
};