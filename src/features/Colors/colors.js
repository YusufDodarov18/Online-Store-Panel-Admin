import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosRequest from "../../utils/axiosRequest";
import { toast } from "react-toastify";

export const getColors=createAsyncThunk("Colors/getColors",async()=>{
    try {
        const {data}=await axiosRequest.get("/Color/get-colors")
        return data
    } catch (error) {
        console.error(error)
        return []
    }
})

export const addColor=createAsyncThunk("Color/addColor", async(data,{dispatch})=> {
    try {
        await axiosRequest.post("/Color/add-color", data, {
          headers: {"Content-Type": "application/json"},
        });
		toast.success('Add Color Successfully', { autoClose: 1000 })
        dispatch(getColors())
    } catch (error) {
        console.error(error)
        toast.error('Here Something Incorrect', { autoClose: 1000 })
    }
})

export const deleteColor=createAsyncThunk("Color/deleteColor", async(id, {dispatch})=>{
    try {
        await axiosRequest.delete(`/Color/delete-color?colorId=${id}`)
        toast.success('Color removed Successfully', { autoClose: 1000 })
        dispatch(getColors())
    } catch (error) {
        console.error(error)
        toast.error('Here Something Incorrect', { autoClose: 1000 })
    }
})

export const colorSlice=createSlice({
    name:"color",
    initialState:{colors:[]},
    reducers:{},
    extraReducers:builder=>{
        builder.addCase(getColors.fulfilled,(state,action)=>{
            state.colors=action.payload
        })
    }
})
export default colorSlice.reducer