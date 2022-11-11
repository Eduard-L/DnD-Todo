import { Typography } from "@mui/material";
import Lottie from "lottie-react";
import lottieSrc from '../assets/lottie/data.json'
import './Footer.css'
export const Foooter = ({ color }) => {

    const title = `© ${new Date().getFullYear()} Eduard Loktev`
    return (
        <div className="footer w-full self-end realtive items-center flex flex-row justify-center">
            <Typography className="opacity-50" color='whitesmoke' variant='h5'>{title}</Typography>
            {/* <Lottie className='lottie' animationData={lottieSrc} loop={true} /> */}
        </div>

    )
}