// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import api from 'src/@core/utils/api'
import { CreatesDepartmentState, ILeadsState, LeadsQueryParamsTypes } from 'src/types/apps/leadsTypes'

// ** Fetch All Departments
export const fetchDepartmentList = createAsyncThunk(
  'appChat/fetchDepartmentList',
  async (params?: LeadsQueryParamsTypes | undefined) => {
    const resp = await api.get(`leads/department/list/?`, { params })

    if (params && params?.search !== '') {
      return resp.data
    } else {
      return resp.data
    }
  }
)

// ** Fetch All Sources
export const fetchSources = createAsyncThunk('appChat/fetchSources', async () => {
  return (await api.get(`leads/source/`)).data.results
})
export const fetchGroupCheckList = createAsyncThunk('fetchGroupCheckList', async () => {
  return (await api.get(`common/group-check-list/`)).data
})

// ** Create Departments
export const createDepartment = createAsyncThunk(
  'appChat/createDepartment',
  async (values: CreatesDepartmentState, { rejectWithValue }) => {
    try {
      const response = await api.post(`leads/department/create/`, values)
      return response.data
    } catch (err: any) {
      if (err.response) {
        return rejectWithValue(err.response.data)
      }
      return rejectWithValue(err.message)
    }
  }
)

// ** Create Departments
export const editDepartment = createAsyncThunk(
  'appChat/editDepartment',
  async (values: { name?: string; id: any; is_active?: boolean }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`leads/department-update/${values.id}`, values)
      return response.data
    } catch (err: any) {
      if (err.response) {
        return rejectWithValue(err.response.data)
      }
      return rejectWithValue(err.message)
    }
  }
)

// ** Create Department Item
export const createDepartmentItem = createAsyncThunk(
  'appChat/createDepartmentItem',
  async (values: CreatesDepartmentState) => {
    return (await api.post(`leads/department/create/`, values)).data
  }
)

export const createDepartmentStudent = createAsyncThunk(
  'appChat/createDepartmentStudent',
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await api.post(`leads/department-user-create/`, data)
      return response.data
    } catch (err: any) {
      if (err.response) {
        return rejectWithValue(err.response.data)
      }
      return rejectWithValue(err.message)
    }
  }
)

export const updateDepartmentStudent = createAsyncThunk(
  'appChat/updateDepartmentStudent',
  async (data: any, { rejectWithValue }) => {
    try {
      // const response = await api.patch(`leads/department-user-list/${data.id}/`, data)
      const response = await api.patch(`leads/anonim-user/update/${data.id}/`, data)
      return response.data
    } catch (err: any) {
      if (err.response) {
        return rejectWithValue(err.response.data)
      }
      return rejectWithValue(err.message)
    }
  }
)

const initialState: ILeadsState = {
  sourceData: [],
  groups: [],
  leadData: [],
  open: null,
  openItem: null,
  openLid: null,
  sectionId: null,
  addSource: false,
  loading: false,
  search: '',
  queryParams: {
    search: '',
    is_active: true
  },
  openActionModal: null,
  bigLoader: false,
  actionId: ''
}

export const appLeadsSlice = createSlice({
  name: 'leads',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setOpen: (state, action) => {
      state.open = action.payload
    },
    setOpenItem: (state, action) => {
      state.openItem = action.payload
    },
    setOpenLid: (state, action) => {
      state.openLid = action.payload
    },
    setSectionId: (state, action) => {
      state.sectionId = action.payload
    },
    setAddSource: (state, action) => {
      state.addSource = action.payload
    },
    updateLeadParams: (state, action) => {
      state.queryParams = { ...state.queryParams, ...action.payload }
    },
    setOpenActionModal: (state, action) => {
      state.actionId = action.payload?.id || ''
      state.openActionModal = action.payload?.open || null
    },
    setPageLoader: (state, action) => {
      state.bigLoader = action.payload
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchDepartmentList.pending, state => {
        state.bigLoader = true
      })
      .addCase(fetchDepartmentList.fulfilled, (state, action) => {
        state.leadData = action.payload
        state.bigLoader = false
      })
      .addCase(fetchDepartmentList.rejected, state => {
        state.bigLoader = false
      })
      .addCase(createDepartment.pending, state => {
        state.loading = true
      })
      .addCase(createDepartment.fulfilled, (state, action) => {
        state.leadData.push({ ...action.payload, children: [] })
        state.loading = false
        state.open = null
      })
      .addCase(createDepartment.rejected, state => {
        state.loading = false
      })
      .addCase(fetchSources.fulfilled, (state, action) => {
        state.sourceData = action.payload
      })
      .addCase(fetchGroupCheckList.fulfilled, (state, action) => {
        state.groups = action.payload
      })
      .addCase(createDepartmentItem.pending, state => {
        state.loading = true
      })
      .addCase(createDepartmentItem.fulfilled, state => {
        state.loading = false
        state.openItem = null
      })
      .addCase(createDepartmentItem.rejected, state => {
        state.loading = false
      })
      .addCase(createDepartmentStudent.pending, state => {
        state.loading = true
      })
      .addCase(createDepartmentStudent.fulfilled, state => {
        state.loading = false
        state.openLid = null
        state.addSource = false
      })
      .addCase(createDepartmentStudent.rejected, state => {
        state.loading = false
      })

      .addCase(updateDepartmentStudent.pending, state => {
        state.loading = true
      })
      .addCase(updateDepartmentStudent.fulfilled, state => {
        state.loading = false
      })
      .addCase(updateDepartmentStudent.rejected, state => {
        state.loading = false
      })

      .addCase(editDepartment.pending, state => {
        state.loading = true
      })
      .addCase(editDepartment.fulfilled, state => {
        state.loading = false
        state.openActionModal = null
      })
      .addCase(editDepartment.rejected, state => {
        state.loading = false
      })
  }
})

export const {
  setLoading,
  setOpen,
  setOpenItem,
  setOpenLid,
  setSectionId,
  setAddSource,
  updateLeadParams,
  setOpenActionModal,
  setPageLoader
} = appLeadsSlice.actions

export default appLeadsSlice.reducer
