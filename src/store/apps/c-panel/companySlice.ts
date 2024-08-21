import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from 'src/@core/utils/api'
import { CompanyDetailsPageTypes, TariffType } from 'src/types/apps/cpanelTypes'

export const fetchCompanyDetails = createAsyncThunk('fetchClientSideTariff', async (slug: number) => {
  const response = await api.get(`owner/client/${slug}/`)
  return response.data
})

export const fetchSMSHistory = createAsyncThunk('fetchSMSHistory', async (id: number) => {
  const response = await api.get(`owner/sms-history/${id}/`)
  return response.data
})

export const fetchClientPayments = createAsyncThunk('fetchClientPayments', async (id: number) => {
  const response = await api.get(`owner/orders/?client=${id}`)
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

export const updateClient = createAsyncThunk('updateClient', async (values: Partial<any>, { rejectWithValue }) => {
  try {
    const response = await api.patch(`owner/client/${values.id}/`, values.formData)
    return response.data
  } catch (err: any) {
    if (err.response) {
      return rejectWithValue(err.response.data)
    }
    return rejectWithValue(err.message)
  }
})

export const fetchLogs = createAsyncThunk('fetchHistory', async (id: number | undefined) => {
  const response = await api.get(`owner/client/logs/${id}/`)
  return response.data
})

const initialState: CompanyDetailsPageTypes = {
  sms: [],
  logs: null,
  payments: null,
  details: null,
  isLoading: false,
  isGettingSMS: false,
  isGettingLogs: false,
  isGettingPayments: false
}

export const companyDetails = createSlice({
  name: 'companyDetails',
  initialState,
  reducers: {
    setOpenModal: (state, action) => {}
  },

  extraReducers: builder => {
    builder.addCase(fetchCompanyDetails.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(fetchCompanyDetails.fulfilled, (state, action) => {
      state.details = action.payload
      state.isLoading = false
    })
    builder.addCase(fetchCompanyDetails.rejected, (state, action) => {
      state.isLoading = false
    })
    builder.addCase(fetchSMSHistory.pending, (state, action) => {
      state.isGettingSMS = true
    })
    builder.addCase(fetchSMSHistory.fulfilled, (state, action) => {
      state.sms = action.payload
      state.isGettingSMS = false
    })
    builder.addCase(fetchSMSHistory.rejected, (state, action) => {
      state.isGettingSMS = false
    })
    builder.addCase(fetchClientPayments.pending, (state, action) => {
      state.isGettingPayments = true
    })
    builder.addCase(fetchClientPayments.fulfilled, (state, action) => {
      state.payments = action.payload
      state.isGettingPayments = false
    })
    builder.addCase(fetchClientPayments.rejected, (state, action) => {
      state.isGettingPayments = false
    })
    builder.addCase(fetchLogs.pending, (state, action) => {
      state.isGettingLogs = true
    })
    builder.addCase(fetchLogs.fulfilled, (state, action) => {
      state.logs = action.payload
      state.isGettingLogs = false
    })
  }
})

export const { setOpenModal } = companyDetails.actions
export default companyDetails.reducer
