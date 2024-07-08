import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from 'src/@core/utils/api'
import { IMentorsState } from 'src/types/apps/mentorsTypes'

const initialState: { open: boolean } = {
  open: false
}

export const pageSlice = createSlice({
  name: 'page',
  initialState,
  reducers: {
    disablePage: (state, action) => {
      if (action.payload) {
        const overlay: any = document.getElementById('full-page-overlay');
        overlay.style.display = 'block';
      } else {
        const overlay: any = document.getElementById('full-page-overlay');
        overlay.style.display = 'none';
      }
      state.open = action.payload
    }
  }
})

export const { disablePage } = pageSlice.actions

export default pageSlice.reducer
