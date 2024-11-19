export interface SalaryitemType {
  id: number
  status: string
  employee_data: {
    id: number
    name: string
  }
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
  Yanvar: number
  Favral: number
  Mart: number
  Aprel: number
  May: number
  Iyun: number
  Iyul: number
  Avgust: number
  Sentabr: number
  Oktabr: number
  Noyabr: number
  Dekabr: number
}

export interface AllNumbersParams {
  date_year: any
  date_month: string
  start_date: string
  end_date: string
  branch: string
}

export type GroupFinance = {
  allowed_lessons: number
  attended_lessons: number
  calculated_date: string
  condition: string
  course_price: number
  fines_count: number
  group_name: string
  original_amount: number
  students_count: number
}

export interface IFinanceState {
  isPending: boolean
  isGettingGroupsFinance: boolean
  numbersLoad: boolean
  isGettingExpenseCategories: boolean
  moderation_salaries: SalaryitemType[]
  categoriesData: any[]
  groupsFinance: any[]
  calculatedSalary: GroupFinance[] | null
  isGettingCalculatedSalary: boolean
  all_numbers:
    | {
        label: {
          benefit: string
          expense: string
        difference: string,
          active_balance:string
        }
        year: number
        expense: YearlyStats
        benefit: YearlyStats
    difference: YearlyStats
    active_balance:YearlyStats

        payment_types: {
          id: number
          name: string
          amount: number
        }[]
      }
    | undefined
  allNumbersParams: AllNumbersParams
  is_update: boolean
}

export interface IAdvanceFormState {
  employee: string
  amount: string
  description: string
  date: string
  id: number
  is_action: boolean
  employee_name: string
}
export interface IAdvanceResponseData {
  next: string
  count: number
  previous: string
  total_prepayments: number
  results: IAdvanceFormState[]
}
