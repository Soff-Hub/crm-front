import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from 'src/@core/utils/api'
import ceoConfigs from 'src/configs/ceo'
import { IGroupDetailsState } from 'src/types/apps/groupDetailsTypes'

export const getGroupById = createAsyncThunk('groupDetailss/fetchDetails', async (id: any) => {
  const resp = await api.get(ceoConfigs.groups_detail + id)
  return resp.data
})

const initialState: IGroupDetailsState = {
  groupData: null,
  isGettingGroupDetails: false
}

export const groupDetailsSlice = createSlice({
  name: 'groupDetails',
  initialState,
  reducers: {
    handleOpenEdit: (state, action) => {
      state.groupData = action.payload
    }
  },

  extraReducers: builder => {
    builder.addCase(getGroupById.pending, state => {
      state.isGettingGroupDetails = true
    })
    builder.addCase(getGroupById.fulfilled, (state, action) => {
      state.groupData = action.payload
      state.isGettingGroupDetails = false
    })
    builder.addCase(getGroupById.rejected, state => {
      state.isGettingGroupDetails = false
    })
  }
})

export const { handleOpenEdit } = groupDetailsSlice.actions
export default groupDetailsSlice.reducer
