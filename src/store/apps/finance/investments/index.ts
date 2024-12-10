import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    isEditId: null,
    queryParams: { page: 1, date_year: `${new Date().getFullYear()}-01-01`, date_month: '' },
   
    
}

export const investmentSlice = createSlice({
    name: 'finance',
    initialState,
    reducers: {
        setOpenEdit: (state, action) => {
            state.isEditId = action.payload
        },
       
        updateParams: (state, action) => {
            state.queryParams = { ...state.queryParams, ...action.payload }
        },
    }
    
})
export const {
    updateParams,
    setOpenEdit
} = investmentSlice.actions

export default investmentSlice.reducer