import { Navigate } from "react-router-dom"

export const ProtectedComponent = ({ Component, isLoggedIn, ...props }) => {

    return (
        isLoggedIn ? <Component {...props} /> : <Navigate to='/' />
    )
}