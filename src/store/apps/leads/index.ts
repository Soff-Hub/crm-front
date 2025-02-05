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
export const fetchAmoCrmPipelines = createAsyncThunk(
  'appChat/fetchAmoCrmPipelines',
  async (queryParams: Record<string, any>, { rejectWithValue }) => {
    try {
      const response = await api.get('/amocrm/pipelines/', {
        params: queryParams
      })
      return response.data
    } catch (err: any) {
      if (err.response) {
        return rejectWithValue(err.response.data)
      }
      return rejectWithValue(err.message)
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
export const editAmoCrmData = createAsyncThunk(
  'appChat/editAmoCrmData',
  async (values: { data_id: any; is_delete: boolean; condition: string }, { rejectWithValue }) => {
    try {
      const response = await api.post(`amocrm/delete/`, values)
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
      let response


      if (data.is_amocrm) {
        response = await api.post(`amocrm/leads/export/`, data.data)
      } else {
        response = await api.patch(`leads/anonim-user/update/${data.id}/`, { department: data.data.department })
      }

      return response.data
    } catch (err: any) {
      console.error('Error:', err.response || err.message)
      if (err.response) {
        return rejectWithValue(err.response.data)
      }
      return rejectWithValue(err.message)
    }
  }
)

export const editDepartmentStudent = createAsyncThunk(
  'appChat/editDepartmentStudent',
  async (data: any, { rejectWithValue }) => {
    try {
      let response


      if (data.is_amocrm) {
        response = await api.post(`amocrm/leads/export/`, data.data)
      } else {
        response = await api.patch(`leads/anonim-user/update/${data.id}/`, { first_name:data.first_name,phone:data.phone })
      }

      return response.data
    } catch (err: any) {
      console.error('Error:', err.response || err.message)
      if (err.response) {
        return rejectWithValue(err.response.data)
      }
      return rejectWithValue(err.message)
    }
  }
)

export const updateAmoCrmStudent = createAsyncThunk(
  'appChat/updateAmoCrmStudent',
  async (data: any, { rejectWithValue }) => {
    try {
      let response

      console.log('Sending data:', data)

        response = await api.patch(`amocrm/lead/update/${data.id}/`, {status_id:data.data.department})

      return response.data
    } catch (err: any) {
      console.error('Error:', err.response || err.message)
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
  pipelines: [],
  leadData: [],
  departmentLoading: false,
  pipelinesLoading: false,
  open: null,
  openItem: null,
  openLid: null,
  sectionId: null,
  addSource: false,
  leadItems:null,
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
    setLeadItems: (state, action) => {
      state.leadItems = action.payload
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
        state.departmentLoading = true
        // state.bigLoader = true // Enable bigLoader when any action starts
      })
      .addCase(fetchDepartmentList.fulfilled, (state, action) => {
        state.leadData = action.payload
        state.departmentLoading = false
        // state.bigLoader = state.pipelinesLoading // Check if pipelines are still loading
      })
      .addCase(fetchDepartmentList.rejected, state => {
        state.departmentLoading = false
        // state.bigLoader = state.pipelinesLoading // Check if pipelines are still loading
      })
      .addCase(fetchAmoCrmPipelines.pending, state => {
        state.pipelinesLoading = true
        // state.bigLoader = true // Enable bigLoader when any action starts
      })
      .addCase(fetchAmoCrmPipelines.fulfilled, (state, action) => {
        state.pipelines = action.payload
        state.pipelinesLoading = false
        // state.bigLoader = state.departmentLoading // Check if department data is still loading
      })
      .addCase(fetchAmoCrmPipelines.rejected, state => {
        state.pipelinesLoading = false
        // state.bigLoader = state.departmentLoading // Check if department data is still loading
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
      .addCase(editAmoCrmData.pending, state => {
        state.loading = true
      })
      .addCase(editAmoCrmData.fulfilled, state => {
        state.loading = false
        state.openActionModal = null
      })
      .addCase(editAmoCrmData.rejected, state => {
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
  setPageLoader,
  setLeadItems
} = appLeadsSlice.actions

export default appLeadsSlice.reducer
