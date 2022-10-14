import { createSlice } from '@reduxjs/toolkit'
import { DARK } from '../utils/constants'
export const visibilityMode = createSlice({
    name: 'visibilityMode',
    initialState: DARK,
    reducers: {
        setVisibilityMode: (state, action) => {
            console.log(state)
            state = action.payload
            return state
        }
    }
})

// Action creators are generated for each case reducer function
export const { setVisibilityMode } = visibilityMode.actions

export default visibilityMode.reducer