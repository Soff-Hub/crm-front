import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from 'src/@core/utils/api'
import { IStudentState, StudentsQueryParamsTypes } from 'src/types/apps/studentsTypes'

// ** Fetch All Departments
export const fetchStudentsList = createAsyncThunk(
    'students/fetchStudentsList',
    async (params?: StudentsQueryParamsTypes | undefined) => {
        return (await api.get(`auth/student/list/`, { params })).data
    }
)

export const fetchStudentDetail = createAsyncThunk(
    'students/fetchStudentDetail',
    async (id: number) => {
        return (await api.get(`auth/student/detail/${id}`)).data
    }
)

export const createStudent = createAsyncThunk(
    'students/createStudent',
    async (values: any, { rejectWithValue }) => {
        try {
            const response = await api.post(`auth/student-create/`, values);
            return response.data;
        } catch (err: any) {
            if (err.response) {
                return rejectWithValue(err.response.data);
            }
            return rejectWithValue(err.message);
        }
    }
);

export const updateStudent = createAsyncThunk(
    'students/updateStudent',
    async (valuess: any, { rejectWithValue }) => {
        try {
            const response = await api.patch(`auth/student/update/${valuess.id}`, valuess);
            return response.data;
        } catch (err: any) {
            if (err.response) {
                return rejectWithValue(err.response.data);
            }
            return rejectWithValue(err.message);
        }
    }
);

export const deleteStudent = createAsyncThunk(
    'students/deleteStudent',
    async (pk: number | any) => {
        return (await api.post(`auth/student-destroy/`, { pk })).data
    }
);

export const fetchStudentPayment = createAsyncThunk(
    'students/fetchStudentPayment',
    async (id: any) => {
        return (await api.get(`common/student-payment/list/${id}/`)).data
    }
)



const initialState: IStudentState = {
    openEdit: null,
    students: [],
    studentsCount: 0,
    studentData: null,
    isLoading: false,
    queryParams: { status: 'active', is_debtor: '', group_status: '' },
    payments: []
}

export const studentsSlice = createSlice({
    name: 'students',
    initialState,
    reducers: {
        setOpenEdit: (state, action) => {
            state.openEdit = action.payload
            state.studentData = null
        },
        setStudentData: (state, action) => {
            state.studentData = action.payload
        },
        updateStudentParams: (state, action) => {
            state.queryParams = { ...state.queryParams, ...action.payload }
        },
        clearStudentParams: (state, action) => {
            state.queryParams = { status: 'active' }
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchStudentsList.pending, (state) => {
                state.isLoading = true
            })
            .addCase(fetchStudentsList.fulfilled, (state, action) => {
                state.students = action.payload.results
                state.studentsCount = Math.ceil(action.payload.count)
                state.isLoading = false
            })
            .addCase(fetchStudentsList.rejected, (state) => {
                state.isLoading = false
            })
            .addCase(createStudent.fulfilled, (state) => {
                state.openEdit = null
            })
            .addCase(fetchStudentDetail.fulfilled, (state, action) => {
                state.studentData = action.payload
            })
            .addCase(fetchStudentPayment.pending, (state) => {
                state.isLoading = true
            })
            .addCase(fetchStudentPayment.fulfilled, (state, action) => {
                state.payments = action.payload
                state.isLoading = false
            })
    }
})

export const { setOpenEdit, setStudentData, updateStudentParams, clearStudentParams } = studentsSlice.actions

export default studentsSlice.reducer