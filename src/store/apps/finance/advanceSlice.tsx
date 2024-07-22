import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { today } from 'src/@core/components/card-statistics/kanban-item';
import { customTableDataProps } from 'src/@core/components/table';
import api from 'src/@core/utils/api';
import { formatCurrency } from 'src/@core/utils/format-currency';
import { IAdvanceFormState, IAdvanceResponseData } from 'src/types/apps/finance';
import { EmployeeItemType } from 'src/types/apps/settings';
import AdvanceRowActions from 'src/views/apps/finance/advance/AdvanceRowActions';


export const getAdvanceList = createAsyncThunk('getAdvanceList', async (params?: string) => {
    return (await api.get('/common/finance/prepayment/list/?' + params)).data
})

export const getStaffs = createAsyncThunk('getStaffs', async (params?: string) => {
    return (await api.get('/auth/employees/')).data
})

export const createAdvance = createAsyncThunk('createAdvance', async (values: Partial<IAdvanceFormState>, { rejectWithValue }) => {
    try {
        const response = await api.post("/common/finance/prepayment/create/", values)
        return response.data
    } catch (err: any) {
        if (err.response) {
            return rejectWithValue(err.response.data)
        }
        return rejectWithValue(err.message)
    }
})

export const updateAdvance = createAsyncThunk('updateAdvance', async (values: Partial<IAdvanceFormState>, { rejectWithValue }) => {
    try {
        const response = await api.patch(`/common/finance/prepayment/update/${values.id}/`, values)
        return response.data
    } catch (err: any) {
        if (err.response) {
            return rejectWithValue(err.response.data)
        }
        return rejectWithValue(err.message)
    }
})

export const deleteStudent = createAsyncThunk(
    'deleteAdvance',
    async (id: number) => {
        const res = await api.delete(`/common/finance/prepayment/delete/${id}/`)
        return res
    }
);

type StateProps = {
    isOpenCreateModal: boolean,
    isEditId: null | number,
    isLoading: boolean,
    advanceList: IAdvanceResponseData | null,
    employee: EmployeeItemType[],
    queryParams: { page: number, date_year: string, date_month: string },
    formikState: Partial<IAdvanceFormState>,
    columns: customTableDataProps[]
}

const initialState: StateProps = {
    isOpenCreateModal: false,
    isEditId: null,
    isLoading: false,
    employee: [],
    advanceList: null,
    queryParams: { page: 1, date_year: `${new Date().getFullYear()}-01-01`, date_month: '' },
    formikState: {
        employee: '',
        amount: '',
        description: '',
        date: today
    },
    columns: [
        {
            xs: 0.03,
            title: '#',
            dataIndex: 'index'
        },
        {
            xs: 0.2,
            title: 'Xodim',
            dataIndex: 'employee_name',
        },
        {
            xs: 0.2,
            title: 'Summa',
            dataIndex: 'amount',
            render: (amount) => `${formatCurrency(amount)} so'm`
        },
        {
            xs: 0.2,
            title: 'Sana',
            dataIndex: 'date'
        },
        {
            xs: 0.5,
            title: 'Izoh',
            dataIndex: 'description'
        },
        {
            xs: 0.05,
            title: '',
            dataIndex: 'id',
            render: (id) => <AdvanceRowActions id={Number(id)} />,
        }
    ]
}

export const advanceSlice = createSlice({
    name: 'finance',
    initialState,
    reducers: {
        setOpenEdit: (state, action) => {
            state.isEditId = action.payload
        },
        setOpenCreateModal: (state, action) => {
            state.isOpenCreateModal = action.payload
        },
        updateParams: (state, action) => {
            state.queryParams = { ...state.queryParams, ...action.payload }
        },
    },
    extraReducers: builder => {
        builder
            .addCase(getAdvanceList.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getAdvanceList.fulfilled, (state, action) => {
                state.advanceList = action.payload
                state.isLoading = false
            })
            .addCase(getAdvanceList.rejected, (state) => {
                state.isLoading = false
            })
            .addCase(getStaffs.fulfilled, (state, action) => {
                state.employee = action.payload.results
            })
    }
})

export const {
    updateParams,
    setOpenCreateModal,
    setOpenEdit
} = advanceSlice.actions

export default advanceSlice.reducer
