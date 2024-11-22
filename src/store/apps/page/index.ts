import { createSlice } from '@reduxjs/toolkit'

const initialState: { isPageDisabled: boolean ,isModalOpen:boolean,soffBotStatus:number,currentDate: string
soffBotText:any} = {
  isPageDisabled: false,
  isModalOpen: false,
  soffBotStatus: 0,
  currentDate: '',
  soffBotText:{}
   

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
    },
    toggleModal: (state, action) => {
      state.isModalOpen = action.payload
    },
    toggleBotStatus: (state, action) => {
      state.soffBotStatus = action.payload
    },
    setCurrentDate: (state,action) => {
      state.currentDate = action.payload
    }, setSoffBotText: (state, action) => {
      state.soffBotText = action.payload
    }
  }
})

export const { disablePage ,toggleModal,toggleBotStatus,setCurrentDate,setSoffBotText} = pageSlice.actions

export default pageSlice.reducer
