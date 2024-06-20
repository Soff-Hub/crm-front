// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import api from 'src/@core/utils/api'
import { CreateDepartmentUser, CreatesDepartmentState, ILeadsState, LeadsQueryParamsTypes } from 'src/types/apps/leadsTypes'


// ** Fetch All Departments
export const fetchDepartmentList = createAsyncThunk('appChat/fetchDepartmentList', async (params?: LeadsQueryParamsTypes | undefined) => {
    const resp = await api.get(`leads/department/list/?`, { params })
    console.log(resp.data);
    console.log(params);


    if (params && params?.search !== "") {
        console.log(...resp.data.map((el: any) => el?.children.filter((item: any) => item?.student_count > 0)));
        
        return resp.data
    } else {
        return resp.data
    }
})

// ** Fetch All Sources
export const fetchSources = createAsyncThunk('appChat/fetchSources', async () => {
    return (await api.get(`leads/source/`)).data.results
})

// ** Create Departments
export const createDepartment = createAsyncThunk('appChat/createDepartment', async (values: CreatesDepartmentState) => {
    return (await api.post(`leads/department/create/`, values)).data
})

// ** Create Departments
export const editDepartment = createAsyncThunk('appChat/editDepartment', async (values: { name?: string, id: any, is_active?: boolean }) => {
    return (await api.patch(`leads/department-update/${values.id}`, values)).data
})

// ** Create Department Item
export const createDepartmentItem = createAsyncThunk('appChat/createDepartmentItem', async (values: CreatesDepartmentState) => {
    return (await api.post(`leads/department/create/`, values)).data
})

// ** Create Department User
export const createDepartmentStudent = createAsyncThunk('appChat/createDepartmentStudent', async (values: CreatesDepartmentState) => {
    return (await api.post(`leads/department-user-create/`, values)).data
})

// ** Create Department User
// export const getDepartmentStudent = createAsyncThunk('appChat/getDepartmentStudent', async (values: { parent: number, params: LeadsQueryParamsTypes }) => {
//     return (await api.get(`leads/department-user-list/${values.parent}/`, { params: values?.params })).data
// })

// ** Create Department User
// export const editDepartmentStudent = createAsyncThunk('appChat/editDepartmentStudent', async (values: CreateDepartmentUser) => {
//     return (await api.patch(`leads/department-user-list/${values.id}/`, values)).data
// })


const initialState: ILeadsState = {
    sourceData: [],
    leadData: [],
    open: null,
    openItem: null,
    openLid: null,
    addSource: false,
    loading: false,
    search: '',
    queryParams: {
        search: '',
        is_active: true
    },
    openActionModal: null,
    bigLoader: false
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
        setAddSource: (state, action) => {
            state.addSource = action.payload
        },
        updateLeadParams: (state, action) => {
            state.queryParams = { ...state.queryParams, ...action.payload }
        },
        setOpenActionModal: (state, action) => {
            state.openActionModal = action.payload
        },
        setPageLoader: (state, action) => {
            state.bigLoader = action.payload
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchDepartmentList.pending, (state) => {
                state.bigLoader = true
            })
            .addCase(fetchDepartmentList.fulfilled, (state, action) => {
                state.leadData = action.payload
                state.bigLoader = false
            })
            .addCase(fetchDepartmentList.rejected, (state) => {
                state.bigLoader = false
            })
            .addCase(createDepartment.pending, (state) => {
                state.loading = true
            })
            .addCase(createDepartment.fulfilled, (state, action) => {
                state.leadData.push({ ...action.payload, children: [] })
                state.loading = false
                state.open = null
            })
            .addCase(createDepartment.rejected, (state) => {
                state.loading = false
            })
            .addCase(fetchSources.fulfilled, (state, action) => {
                state.sourceData = action.payload
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

            .addCase(editDepartment.pending, (state) => {
                state.loading = true
            })
            .addCase(editDepartment.fulfilled, (state) => {
                state.loading = false
            })
            .addCase(editDepartment.rejected, (state) => {
                state.loading = false
            })
    }
})

export const {
    setLoading,
    setOpen,
    setOpenItem,
    setOpenLid,
    setAddSource,
    updateLeadParams,
    setOpenActionModal,
    setPageLoader
} = appLeadsSlice.actions


export default appLeadsSlice.reducer
