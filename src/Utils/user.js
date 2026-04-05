import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        user: null,
        scene: null
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setScene: (state, action) => {
            state.scene = action.payload
        }
    }
})

export const { setUser, setScene } = userSlice.actions;
export default userSlice.reducer;
