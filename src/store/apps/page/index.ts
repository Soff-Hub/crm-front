import { createSlice } from '@reduxjs/toolkit'

const initialState: {
  isPageDisabled: boolean, isModalOpen: boolean,isAmoModalOpen:boolean, soffBotStatus: number, currentDate: string
  soffBotText: any,isQrCodeModalOpen:boolean,public_settings:any
} = {
  isPageDisabled: false,
  public_settings:{},
  isModalOpen: false,
  isAmoModalOpen:false,
  soffBotStatus: 0,
  currentDate: '',
  soffBotText: {},
  isQrCodeModalOpen:false
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
    setPublicSettings: (state, action) => {
      state.public_settings = action.payload
    },
    toggleModal: (state, action) => {
      state.isModalOpen = action.payload
    },
    toggleQrCodeModal: (state, action) => {
      state.isQrCodeModalOpen = action.payload
    },
    toggleAmoModal: (state, action) => {
      state.isAmoModalOpen = action.payload
    },
    toggleBotStatus: (state, action) => {
      state.soffBotStatus = action.payload
    },
    setCurrentDate: (state, action) => {
      state.currentDate = action.payload
    }, setSoffBotText: (state, action) => {
      state.soffBotText = action.payload
    }
  }
})

export const {setPublicSettings, disablePage,toggleAmoModal,toggleQrCodeModal ,toggleModal, toggleBotStatus, setCurrentDate, setSoffBotText } = pageSlice.actions

export default pageSlice.reducer
