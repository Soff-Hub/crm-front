export type CPanelTypes = {
  isGettingTariffs: boolean
  isOpenMonthlyModal: boolean
  isGettingOwnPayments: boolean
  isOpenClientModal: boolean
  open: string | null
  tariffs: TariffResponseType[]
  clientSideTariffs: TariffResponseType[]
  clientOwnPayments: ClientPaymentType | null
  clientQueryParams: { page: number }
  editedMonthlyPlan: TariffType | null
  editClientPayment: null | number
}

export type TariffType = {
  id: number
  amount: number | null
  min_count: number | null
  max_count: number | null
  month_count: number | null
}

export type TariffResponseType = {
  min_count: number | null
  max_count: number | null
  tariffs: TariffType[]
}

export type ClientPaymentType = {
  count: number
  expiration_date: string | null
  is_demo: boolean
  next: string | null
  previous: string | null
  results: {
    id: number
    tariff: number | null
    receipt: string | null
    description: string | null
    status: string | null
    amount: string | null
    created_at?: string | null
    date?: string | null
    tariff_data: TariffType | null
    tenant_data: { id: number; name: string }
  }[]
}

export interface CompanyDetailsPageTypes {
  details: {
    order_data: {
      amount: string | null
      description: string
      receipt: string | null
      status: string | null
      tariff: string | null
      tariff_data: TariffType
      tenant: string | null
    }
    client_data: {
      branches_count: number
      courses_count: number
      groups_count: number
      id: number
      rooms_count: number
      students_count: number
      employees_count: number
    }
    expiration_date: string
    name: string
    id: number
    is_active: boolean
    number_of_lesson: number
    payment_service: string
    reference_name: string
    reference_phone: string
    sms_data: string
    students_count: number
  } | null
  isLoading: boolean
  isGettingSMS: boolean
  isGettingPayments: boolean
  payments: ClientPaymentType | null
  sms: {
    id: number
    phone: string
    message: string
    client: number
    created_at: string
  }[]
}
