

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

export interface YearlyStats {
    Yanvar: number,
    Favral: number,
    Mart: number,
    Aprel: number,
    May: number,
    Iyun: number,
    Iyul: number,
    Avgust: number,
    Sentabr: number,
    Oktabr: number,
    Noyabr: number,
    Dekabr: number
}

export interface AllNumbersParams {
    date_year: any,
    date_month: string,
    start_date: string,
    end_date: string
}

export interface IFinanceState {
    isPending: boolean,
    numbersLoad: boolean,
    moderation_salaries: SalaryitemType[]
    all_numbers: {
        label: {
            benefit: string,
            expense: string,
            difference: string
        },
        year: number,
        expense: YearlyStats,
        benefit: YearlyStats,
        difference: YearlyStats,
        payment_types: {
            id: number,
            name: string,
            amount: number
        }[]
    } | undefined,
    allNumbersParams: AllNumbersParams
}