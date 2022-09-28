import { createSlice } from '@reduxjs/toolkit'

export const userInfo = createSlice({
    name: 'userInfo',
    initialState: {},
    reducers: {
        setUserInfo: (state, action) => {

            state = action.payload

            return state
        }
    }
})

// Action creators are generated for each case reducer function
export const { setUserInfo } = userInfo.actions

export default userInfo.reducer