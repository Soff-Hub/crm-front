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
