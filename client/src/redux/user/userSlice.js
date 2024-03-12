import { createSlice } from '@reduxjs/toolkit'

const initialState={
    currentUser:null,
    error:null,
    loading:false,
}
const userSlice=createSlice({
    name:"user",
    initialState,
    reducers:{
        signInStart:(state)=>{
            state.error=true;
            state.loading=true;

        },
        signInSuccess:(state,action)=>{
            state.error=false,
            state.loading=false,
            state.currentUser=action.payload
        },
        signInFailure:(state,action)=>{
            state.error=action.payload,
            state.loading=false

        }
    }
})
export const {signInFailure, signInSuccess,signInStart}=userSlice.actions
export default userSlice.reducer