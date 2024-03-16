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
            state.error=null;
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

        },
        updateStart:(state)=>{
            state.error=null;
            state.loading=true;

        },
        updateSuccess:(state,action)=>{
            state.error=null,
            state.loading=false,
            state.currentUser=action.payload
        },
        updateFailure:(state,action)=>{
            state.error=action.payload,
            state.loading=null

        },
        deleteStart:(state)=>{
            state.error=null;
            state.loading=true;

    },
    deleteSuccess:(state)=>{
        state.error=null,
        state.loading=false,
        state.currentUser=null
    },
    deleteFailure:(state,action)=>{
        state.error=action.payload,
        state.loading=null
    },
    },
})
export const {signInFailure, signInSuccess,signInStart, updateFailure,
    updateSuccess, updateStart,deleteFailure,deleteSuccess,deleteStart}=userSlice.actions
export default userSlice.reducer