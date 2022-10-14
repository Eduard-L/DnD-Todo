import { createSlice } from '@reduxjs/toolkit'

export const message = createSlice({
    name: ' message',
    initialState: {
        message: '',
        isOpen: false,
        severity: "success"
    },
    reducers: {
        setPopupMessage: (state, action) => {
            state.message = action.payload.message
            state.isOpen = action.payload.isOpen
            state.severity = action.payload.severity
        },

    }
})

// Action creators are generated for each case reducer function
export const { setPopupMessage } = message.actions

export default message.reducer