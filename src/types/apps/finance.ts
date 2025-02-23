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
  obj_id: number
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
  incomeCategoriesData: any[]
  isGettingGroupsFinance: boolean
  numbersLoad: boolean
  isGettingExpenseCategories: boolean
  moderation_salaries: SalaryitemType[]
  categoriesData: any[]
  isGettingIncomeCategories: boolean
  groupsFinance: any[]
  calculatedSalary: GroupFinance[] | null
  isGettingCalculatedSalary: boolean
  all_numbers: {
    label: {
      benefit: string
      expense: string
      difference: string
      active_balance: string
    }
    month:string
    year: number
    expense: YearlyStats
    benefit: YearlyStats
    difference: YearlyStats
    active_balance: YearlyStats
    plans: {
      debt_amount:number
      done_amount: number
      percentage: number
      planned_amount: number
    }

    payment_types: {
      id: number
      count?: number
      name: string
      amount: number
    }[]
  }|null

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
