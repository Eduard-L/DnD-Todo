import { createSlice } from '@reduxjs/toolkit'

export const isLoading = createSlice({
    name: 'isLoading',
    initialState: false,
    reducers: {
        setIsLoading: (state, action) => {

            state = action.payload

            return state
        }
    }
})

// Action creators are generated for each case reducer function
export const { setIsLoading } = isLoading.actions

export default isLoading.reducer