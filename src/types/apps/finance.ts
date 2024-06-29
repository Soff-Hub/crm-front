

export interface SalaryitemType {
    id: number
    status: string
    employee_data: {
        id: number
        name: string
    },
    profit_amount: number
    kpi: number
    fixed_salary: number
    kpi_salary: number
    bonus_amount: number
    fine_amount: number
    salary: number
    date: string
    fines_count: number
}

export interface IFinanceState {
    isPending: boolean,
    moderation_salaries: SalaryitemType[]
}