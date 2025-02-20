import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from 'src/@core/utils/api'
import { CPanelTypes, SMSTariff, TariffType } from 'src/types/apps/cpanelTypes'

export const fetchClientSideTariffs = createAsyncThunk('dashboard/fetchClientSideTariff', async () => {
  const response = await api.get('owner/tariffs/')
  return response.data
})

export const fetchTariffs = createAsyncThunk('dashboard/fetchTariffs', async () => {
  const response = await api.get('owner/tariffs/')
  return response.data
})

export const fetchSMSTariffs = createAsyncThunk('dashboard/fetchSMSTariffs', async () => {
  const response = await api.get('owner/sms-tariffs/')
  return response.data
})

export const fetchCRMPayments = createAsyncThunk('dashboard/fetchCRMPayments', async (queryString?: any) => {
  const response = await api.get('owner/orders/?' + queryString)
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
export const createSMSTariff = createAsyncThunk(
  'createSMSTariff',
  async (values: Partial<SMSTariff>, { rejectWithValue }) => {
    try {
      const response = await api.post('/owner/sms-tariff/create/', values)
      return response.data
    } catch (err: any) {
      if (err.response) {
        return rejectWithValue(err.response.data)
      }
      return rejectWithValue(err.message)
    }
  }
)
export const createClientPayment = createAsyncThunk(
  'createClientPayment',
  async (values: Partial<any>, { rejectWithValue }) => {
    try {
      const response = await api.post('/owner/order/create/', values)
      return response.data
    } catch (err: any) {
      if (err.response) {
        return rejectWithValue(err.response.data)
      }
      return rejectWithValue(err.message)
    }
  }
)
export const updateSMSTariff = createAsyncThunk(
  'updateSMSTariff',
  async (values: Partial<SMSTariff>, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/owner/sms-tariff/update/${values.id}/`, values)
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
export const updatePaymentModal = createAsyncThunk(
  'updatePaymentModal',
  async ({ id, formData }: { id: number | undefined } & Partial<any>, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/owner/order/update/${id}/`, formData)
      return response.data
    } catch (err: any) {
      if (err.response) {
        return rejectWithValue(err.response.data)
      }
      return rejectWithValue(err.message)
    }
  }
)
export const deleteCRMPayment = createAsyncThunk(
  'deleteCRMPayment',
  async (id: number | string, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/owner/order/delete/${id}/`)
      return response.data
    } catch (err: any) {
      if (err.response) {
        return rejectWithValue(err.response.data)
      }
      return rejectWithValue(err.message)
    }
  }
)

export const deleteCRM = createAsyncThunk(
  'deleteCRM',
  async (id: number | string, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/owner/client/${id}/`)
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
  smsTariffs: [],
  clientOwnPayments: null,
  clientSideTariffs: [],
  editedMonthlyPlan: null,
  editedSMSTariff: null,
  open: null,
  isGettingSMSTariffs: false,
  isOpenMonthlyModal: false,
  isOpenClientModal: false,
  isGettingTariffs: false,
  isOpenCreateSMSTariff: false,
  isGettingOwnPayments: false,
  isOpenClientSMSModal: false,
  editClientPayment: null,
  queryParams:{page:"1",paid:'true'},
  clientQueryParams: { page: 1 }
}

export const cPanelSlice = createSlice({
  name: 'cpanel',
  initialState,
  reducers: {
    setOpenModal: (state, action) => {
      state.open = action.payload
    },
    handleMonthlyModalOpen: (state, action) => {
      state.isOpenMonthlyModal = action.payload
    },
    handleOpenClientModal: (state, action) => {
      state.isOpenClientModal = action.payload
    },
    handleOpenClientSMSModal: (state, action) => {
      state.isOpenClientSMSModal = action.payload
    },
    handleOpenSMSModal: (state, action) => {
      state.isOpenCreateSMSTariff = action.payload
    },
    handleEditMonthlyPlan: (state, action) => {
      state.editedMonthlyPlan = action.payload
    },
    handleEditSMSTariff: (state, action) => {
      state.editedSMSTariff = action.payload
    },
    handleEditClientPayment: (state, action) => {
      state.editClientPayment = action.payload
    },
    updateClientParams: (state, action) => {
      state.clientQueryParams = { ...state.clientQueryParams, ...action.payload }
    },
    updateParams: (state, action) => {
      state.queryParams = { ...state.queryParams, ...action.payload }
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
    builder.addCase(fetchCRMPayments.pending, state => {
      state.isGettingOwnPayments = true
    })
    builder.addCase(fetchCRMPayments.fulfilled, (state, action) => {
      state.clientOwnPayments = action.payload
      state.isGettingOwnPayments = false
    })
    builder.addCase(fetchCRMPayments.rejected, (state, action) => {
      state.isGettingOwnPayments = false
    })
    builder.addCase(fetchSMSTariffs.pending, state => {
      state.isGettingSMSTariffs = true
    })
    builder.addCase(fetchSMSTariffs.fulfilled, (state, action) => {
      state.smsTariffs = action.payload
      state.isGettingSMSTariffs = false
    })
    builder.addCase(fetchSMSTariffs.rejected, (state, action) => {
      state.isGettingSMSTariffs = false
    })
    builder.addCase(fetchClientSideTariffs.fulfilled, (state, action) => {
      state.clientSideTariffs = action.payload
    })
  }
})

export const {
  handleMonthlyModalOpen,
  handleEditClientPayment,
  handleOpenClientModal,
  updateClientParams,
  handleEditMonthlyPlan,
  handleOpenClientSMSModal,
  updateParams,
  setOpenModal,
  handleOpenSMSModal,
  handleEditSMSTariff
} = cPanelSlice.actions
export default cPanelSlice.reducer
