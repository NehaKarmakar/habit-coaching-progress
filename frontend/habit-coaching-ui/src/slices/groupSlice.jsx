import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../config/axios";
const initialState= {
   
    serverError: "",
    loading: false,
    editId: null,
    searchData:[],
    totalGroups:0,
    totalPages:1,
    currentPage:1
}



export const addGroup= createAsyncThunk("group/addGroup" , 
    async(args, thunkAPI) => {
        try{
            const response= await axios.post("/api/groups", args.formData,
                 {headers: {Authorization: localStorage.getItem("token")}})
            console.log(response.data)
            return response.data.data
           

            

        }
        catch (err) {
            console.log(err.response.data.message)
            return  thunkAPI.rejectWithValue(err.response.data.message)
    }
}
)

export const removeGroup = createAsyncThunk( "group/removeGroup" , 
    async(args, thunkAPI) => {
        try{
            const response= await axios.delete(`/api/groups/${args.id}` , {headers: {Authorization: localStorage.getItem("token")}})
            if(response.data.success){
                return args.id
            }
            

        }
        catch(err){
            console.log(err.response.data.message)
            return thunkAPI.rejectWithValue(err.response.data.message)
        }
    }
)

export const editGroup = createAsyncThunk( "groups/editGroup" , 
    async(args, thunkAPI) => {
        try{
            const  response= await axios.put(`/api/groups/${args.id}`, args.formData, {headers: {Authorization: localStorage.getItem("token")}})
            if(response.data.success){
                return response.data.data
            }

        }
        catch(err){
            console.log(err.response?.data?.message)
            return thunkAPI.rejectWithValue(err.response?.data?.message)
        }
    }
)

export const searchSortPagination = createAsyncThunk("group/searchSortPagination", 
    async(params, thunkAPI) => {
        try{
            const response= await axios.get("/api/groupAggregation", {params:
                {
                    search: params.search,
                    page: params.page,
                    limit: params.limit,
                    sort: params.sort,
                    order: params.order
                } ,
                headers: {Authorization: localStorage.getItem("token")}
        }, )
        console.log(params)
        console.log(response.data)

        return response.data
        }
        catch(err){
            console.log(err.response.data.message)
            return thunkAPI.rejectWithValue(err.response.data.message)
        }
    }
)
const groupSlice = createSlice( {
    name: "group",
    initialState,
    reducers: {
        assignedEditId: (state, action) => {
            state.editId = action.payload
        }
    
    
    },
    extraReducers: (builder) => {
        builder.addCase(addGroup.pending, (state,action) => {
            state.loading=true;
            state.serverError=null
        }),
        builder.addCase(addGroup.fulfilled, (state, action) => {
            state.loading= false;
           
            state.searchData.push(action.payload);

            state.serverError= null
        }),
        builder.addCase(addGroup.rejected, (state, action) => {
            
    
            state.loading=false;
            state.serverError= action.payload
        }),
        builder.addCase(removeGroup.pending, (state, action) => {
            state.loading= true;
            state.serverError= null
        }),
        builder.addCase(removeGroup.fulfilled, (state, action) => {
            state.loading=false;
            const index= state.searchData.findIndex( ele => ele._id === action.payload)
            if (index !== -1){
            state.searchData.splice(index, 1)
            }
            state.serverError= ""
        }),
         builder.addCase(removeGroup.rejected, (state, action) => {
            
    
            state.loading=false;
            state.serverError= action.payload
        }),

        builder.addCase(editGroup.pending , (state, action) => {
            state.loading= true;
            state.serverError= null
        }),
        builder.addCase(editGroup.fulfilled, (state, action) => {
            state.loading= false;
            const index= state.searchData.findIndex(ele => ele._id == action.payload._id)
            if (index !== -1){
            state.searchData[index] = action.payload
            }
            state.serverError=""
        }),
        builder.addCase(editGroup.rejected , (state, action) => {
            state.loading= false
            state.serverError= action.payload
        }),
        builder.addCase(searchSortPagination.pending, (state) => {
        state.loading = true
        state.serverError = null
        })
        builder.addCase(searchSortPagination.fulfilled, (state, action) => {
        state.loading = false

        state.searchData = action.payload.data
        state.totalGroups = action.payload.totalGroups
        state.currentPage = action.payload.currentPage
        state.totalPages = action.payload.totalPages

        state.serverError = null
       })

       builder.addCase(searchSortPagination.rejected, (state, action) => {
       state.loading = false
       state.serverError = action.payload
      })



    }
})
export const {assignedEditId} = groupSlice.actions
export default groupSlice.reducer