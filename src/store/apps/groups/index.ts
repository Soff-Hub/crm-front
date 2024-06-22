import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { toast } from 'react-hot-toast'
import api from 'src/@core/utils/api'
import ceoConfigs from 'src/configs/ceo'
import { IGroupsState } from 'src/types/apps/groupsTypes'
import { ParsedUrlQuery } from 'querystring'

export const deleteGroups = createAsyncThunk('groups/deleteGroups', async (id: number | string) => {
  const response = await api.delete(`common/group/delete/${id}`)
  return response
})

export const fetchGroups = createAsyncThunk(
  'groups/fetchGroups',
  async ({ query, status }: { query: ParsedUrlQuery; status: string | string[] | undefined }) => {
    const resp = await api.get(ceoConfigs.groups, {
      params: {
        ...query,
        status: status === undefined ? 'active' : status === 'all' ? '' : status
      }
    })
    return resp.data
  }
)

const initialState: IGroupsState = {
  groups: null,
  groupCount: 0,
  isOpenEdit: false,
  isDeleting: false,
  isLoading: false
}

export const groupsSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    handleOpenEdit: (state, action) => {
      state.isOpenEdit = action.payload
    }
  },

  extraReducers: builder => {
    builder.addCase(deleteGroups.pending, state => {
      state.isDeleting = true
    })
    builder.addCase(deleteGroups.fulfilled, state => {
      state.isDeleting = false
      toast.success("Guruhlar ro'yxatidan o'chirildi", { position: 'top-center' })
    })
    builder.addCase(deleteGroups.rejected, state => {
      state.isDeleting = false
      toast.error("Guruhni o'chirib bo'lmadi", { position: 'bottom-center' })
    })
    builder.addCase(fetchGroups.pending, state => {
      state.isLoading = true
    })
    builder.addCase(fetchGroups.fulfilled, (state, action) => {
      state.groups = action.payload.results
      state.groupCount = Math.ceil(action.payload.count / 10)
      state.isLoading = false
    })
    builder.addCase(fetchGroups.rejected, state => {
      state.isLoading = false
    })
  }
})

export const { handleOpenEdit } = groupsSlice.actions
export default groupsSlice.reducer
