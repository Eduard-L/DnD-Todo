import { configureStore } from '@reduxjs/toolkit'
import userInfoReducer from './userInfoSlice'
import message from './popupMessageSlice'
import visibilityMode from './visibilityModeSlice'
import isLoadingSlice from './isLoadingSlice'


export default configureStore({
    reducer: {
        userInfo: userInfoReducer,
        message: message,
        mode: visibilityMode,
        isLoading: isLoadingSlice,

    }
})
