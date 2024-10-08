import { createSlice } from '@reduxjs/toolkit'

const initialState: { isPageDisabled: boolean } = {
  isPageDisabled: false
}

export const pageSlice = createSlice({
  name: 'page',
  initialState,
  reducers: {
    disablePage: (state, action) => {
      // if (action.payload) {
      //   const overlay: any = document.getElementById('full-page-overlay')
      //   overlay.style.display = 'block'
      // } else {
      //   const overlay: any = document.getElementById('full-page-overlay')
      //   overlay.style.display = 'none'
      // }
      state.isPageDisabled = action.payload
    }
  }
})

export const { disablePage } = pageSlice.actions

export default pageSlice.reducer
