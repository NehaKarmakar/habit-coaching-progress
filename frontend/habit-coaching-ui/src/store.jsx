import { configureStore } from "@reduxjs/toolkit";
import groupReducer from "./slices/groupSlice"

const store = configureStore( {
    reducer: {
        groups: groupReducer
    }
})

export default store