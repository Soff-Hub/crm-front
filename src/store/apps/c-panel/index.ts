import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from 'src/@core/utils/api'
import { CPanelTypes, TariffType } from 'src/types/apps/cpanelTypes'

export const fetchTariffs = createAsyncThunk('dashboard/fetchTariffs', async () => {
  const response = await api.get('owner/tariffs/')
  return response.data
})

export const createTariff = createAsyncThunk(
  'createTariff',
  async (values: Partial<TariffType>, { rejectWithValue }) => {
    try {
      const response = await api.post('/owner/tariff/create/', values)
      return response.data
    } catch (err: any) {
      if (err.response) {
        return rejectWithValue(err.response.data)
      }
      return rejectWithValue(err.message)
    }
  }
)
export const updateTariff = createAsyncThunk(
  'updateTariff',
  async (values: Partial<TariffType>, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/owner/tariff/update/${values.id}/`, values)
      return response.data
    } catch (err: any) {
      if (err.response) {
        return rejectWithValue(err.response.data)
      }
      return rejectWithValue(err.message)
    }
  }
)

const initialState: CPanelTypes = {
  tariffs: [],
  editedMonthlyPlan: null,
  isOpenMonthlyModal: false,
  isGettingTariffs: false
}

export const cPanelSlice = createSlice({
  name: 'cpanel',
  initialState,
  reducers: {
    handleMonthlyModalOpen: (state, action) => {
      state.isOpenMonthlyModal = action.payload
    },
    handleEditMonthlyPlan: (state, action) => {
      state.editedMonthlyPlan = action.payload
    }
  },

  extraReducers: builder => {
    builder.addCase(fetchTariffs.pending, state => {
      state.isGettingTariffs = true
    })
    builder.addCase(fetchTariffs.fulfilled, (state, action) => {
      state.tariffs = action.payload
      state.isGettingTariffs = false
    })
    builder.addCase(fetchTariffs.rejected, (state, action) => {
      state.isGettingTariffs = false
    })
  }
})

export const { handleMonthlyModalOpen, handleEditMonthlyPlan } = cPanelSlice.actions
export default cPanelSlice.reducer
