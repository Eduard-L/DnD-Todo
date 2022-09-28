import { configureStore } from '@reduxjs/toolkit'
import userInfoReducer from './slice'

export default configureStore({
    reducer: {
        userInfo: userInfoReducer
    }
})
