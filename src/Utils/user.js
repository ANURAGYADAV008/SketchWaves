import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        user: null,
        scene: null,
        currboard: null,
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setScene: (state, action) => {
            state.scene = action.payload
        },
        setCurrboard: (state, action) => {
            state.currboard = action.payload
        }
    }
})

export const { setUser, setScene, setCurrboard } = userSlice.actions;
export default userSlice.reducer;
