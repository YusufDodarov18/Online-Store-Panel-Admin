import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosRequest from "../../utils/axiosRequest";
import { toast } from "react-toastify";

const initialState={
    loading:false,
    products:[],
    error:null
}

export const getProducts=createAsyncThunk("Products/getProducts",async()=>{
    try {   
        const {data}=await axiosRequest.get(`/Products/get-products?PageSize=${100}`)
        return data.data
    } catch (error) {
        console.error(error)
        throw new Error("not found")
    }
})

export const addProduct = createAsyncThunk("Products/addProduct", async(formData,{rejectWithValue})=>{
    try {
        const {data} = await axiosRequest.post(`/Products/add-product`,formData)
        toast.success('Product added successfully',{ autoClose: 2000 })
        return data.data
    } catch (error) {
        console.error(error)
        toast.error('Here Something Incorrect', { autoClose: 1000 })
        return rejectWithValue(error.response?.data || "Error adding product")
    }
})

export const updateProduct = createAsyncThunk("Products/updateProduct", async({formData,productId},{rejectWithValue})=>{
    try {
        formData.append("productId", productId);

        const { data } = await axiosRequest.put('/Products/update-product', formData)
        toast.success('Product updated successfully', { autoClose: 2000 })
       
        return data.data
    } catch (error) {
        console.error(error)
        toast.error('Here Something Incorrect', { autoClose: 1000 })
        return rejectWithValue(error.response?.data || "Error updating");
    }
})

export const deleteProduct = createAsyncThunk("Products/deleteProduct", async(id, {rejectWithValue})=>{
    try {
        await axiosRequest.delete(`/Products/delete-product?productId=${id}`)
        toast.success('Product delete successfully', { autoClose: 2000 })
        return id
    } catch (error) {
        console.error(error)
        toast.error('Here Something Incorrect', { autoClose: 1000 })
        return rejectWithValue(error.response?.data || "Error deleting product")
    }
})

export const addImageToProduct=createAsyncThunk("Product/addImageToProduct", async({productId,images}, {rejectWithValue})=>{
    try {
        const formData = new FormData();
        formData.append("productId", productId);
        images.forEach((img) => formData.append("images", img));

        const {data}= await axiosRequest.post(
            `/Products/add-image-to-product`, formData
        )

        toast.success("Image added to List!",{autoClose:2000})
        
        return {productId, images:data.data}
    } catch (error) {
        console.error(error)
        return rejectWithValue(error.response?.data || "Error adding image");
    }
})

export const deleteImageFromProduct=createAsyncThunk("Product/deleteImageFromProduct", async({productId,imageId},{rejectWithValue})=>{
    try {
        await axiosRequest.post(`/Products/delete-image-from-product`,
            {productId,imageId}
        )
        toast.success("Image deleted Successfully!", {autoClose:2000})
        return {imageId,productId}
    } catch (error) {
        console.error(error)
        return rejectWithValue(error.response?.data || "Error deleting image");
    }
})

export const productSlice = createSlice({
    name:"product", 
    initialState:initialState,
    reducers:{},
    extraReducers:builder=> {
        builder.addCase(getProducts.pending, (state)=>{
            state.loading=true
        }).addCase(getProducts.rejected,(state,action)=>{
            state.loading = false
            state.error=action.payload || action?.error?.message
        }).addCase(getProducts.fulfilled, (state,action)=>{
            state.products=action.payload
            state.loading = false
            state.error=null
        }).addCase(addProduct.fulfilled,(state,action)=>{
            state.products.push(action.payload)
        }).addCase(addProduct.rejected,(state,action)=>{
            state.error=action.error.message
        }).addCase(deleteProduct.rejected,(state,action)=>{
            state.error=action.error.message
        }).addCase(deleteProduct.fulfilled,(state,action)=>{
            state.products=state.products.filter((elem)=>
                elem.productId!==action.payload
            )
        }).addCase(updateProduct.rejected, (state,action)=>{
            state.error=action.error.message
        }).addCase(updateProduct.fulfilled,(state,action)=>{
            const index=state.products.findIndex((elem)=>elem.productId===action.payload.productId)
            if(index!==-1){
                state.products[index]=action.payload
            }
        }).addCase(addImageToProduct.fulfilled,(state,action)=>{
            const product=state.products.find((elem)=>elem.productId===action.payload.productId)
            if(product){
              if(!product.images) {
                product.images = [];
              }
              product.images.push(...action.payload.images); 
            }
        }).addCase(deleteImageFromProduct.fulfilled,(state,action)=>{
            const product=state.products.find((elem)=>elem.productId==action.payload.productId)
            if(product){
                product.images=product.images.filter(img=>img.id!==action.payload.imageId)
            }
        })
    }
})

export default productSlice.reducer