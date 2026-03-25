import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosRequest from '../../utils/axiosRequest'
import { toast } from "react-toastify";

export const getBrands=createAsyncThunk('Brands/getBrands',async ()=>{
    try {
        const {data}= await axiosRequest.get("/Brand/get-brands")
        return data.data
    } catch (error) {
        console.error(error)
        return []
    }
})

export const addBrand =createAsyncThunk("Brands/addBrand",async (newBrand,{dispatch})=>{
    try {
        await axiosRequest.post(`/Brand/add-brand?brandName=${newBrand}`)
        dispatch(getBrands())
        toast.success('Add Brands Successfully', { autoClose: 1000 })
    } catch (error) {
        console.error(error)
		toast.error('Here Something Incorrect', { autoClose: 1000 })
    }
})

export const deleteBrand=createAsyncThunk("Brands/removeBrand", async(id,{dispatch})=>{
    try {
        await axiosRequest.delete(`/Brand/delete-brand?brandId=${id}`)
        dispatch(getBrands())
        toast.success('Brands removed Successfully', { autoClose: 1000 })
        return id
    } catch (error) {
        console.error(error)
		toast.error('Here Something Incorrect', { autoClose: 1000 })   
    }
})

export const updateBrand=createAsyncThunk("Brands/updateBrand", async(brand,{dispatch})=>{
    try {
        await axiosRequest.put('/Brand/update-brand/',brand)
        dispatch(getBrands())
        toast.success("Edit Brand Successfully",{autoClose:3000})
    } catch (error) {
        console.error(error)
		toast.error('Here Something Incorrect', { autoClose: 1000 })   
    }
})

export const brandSlice=createSlice({
    name:"brands",
    initialState:{brands:[]},
    reducers:{},
    extraReducers:builder=>{
        builder.addCase(getBrands.fulfilled,(state,action)=>{
            state.brands=action.payload
        })
    }
})

export default brandSlice.reducer