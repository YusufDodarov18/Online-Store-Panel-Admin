import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosRequest from "../../utils/axiosRequest";
import { toast } from "react-toastify";

export const getCategories=createAsyncThunk('Category/getCategories',async ()=>{
    try {
        const {data}= await axiosRequest.get("/Category/get-categories")
        return data.data       
    } catch (error) {
        console.error(error)
        return []
    }
})

export const addCategory=createAsyncThunk('Category/addCategory',async ({formData})=>{
    try {
        const {data}=await axiosRequest.post('/Category/add-category',formData)
		toast.success('Add Category Successfully', { autoClose: 1000 })
        return data.data
    } catch (error) {
        console.error(error)
        toast.error('Here Something Incorrect', { autoClose: 1000 })
    }
})

export const updateCategory=createAsyncThunk('Category/updateCategory',async ({formData})=>{
    try {
        const {data}=await axiosRequest.put('/Category/update-category',formData)
        toast.success('Category updated successfully', { autoClose: 1000 });
        return data.data
    } catch (error) {
        console.error(error)
        toast.error('Here Something Incorrect', { autoClose: 1000 })
    }
})

export const deleteCategory=createAsyncThunk('Category/deleteCategory',async ({id})=>{
    try {
        await axiosRequest.delete(`/Category/delete-category?categoryId=${id}`)
        toast.success('Category removed Successfully', { autoClose: 1000 })
        return id
    } catch (error) {
        console.error(error)
        toast.error('Here Something Incorrect', { autoClose: 1000 })
    }
})

export const category=createSlice({
    name:"category",
    initialState:{
        loading:false,
        categories:[],
        errors:null
    },
    reducers:{},
    extraReducers:builder=>{
        builder.addCase(getCategories.pending,(state)=>{
            state.loading=true
        }).addCase(getCategories.rejected,(state,action)=>{
            state.errors = action.error.message
            state.loading = false
        }).addCase(getCategories.fulfilled,(state,action)=>{
            state.categories=action.payload
        }).addCase(deleteCategory.fulfilled,(state,action)=>{
            state.categories=state.categories.filter((elem)=>elem.categoryId!==action.payload)
        }).addCase(addCategory.fulfilled,(state,action)=>{
            state.categories.push(action.payload)
        }).addCase(updateCategory.fulfilled,(state,action)=>{
            const findIndex=state.categories.findIndex((el)=>
                el.categoryid===action.payload.categoryid
            )
            if(findIndex!==-1){
                state.categories[findIndex]=action.payload
            }
        })
    }
})

export default category.reducer