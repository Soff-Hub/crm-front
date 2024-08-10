export type CPanelTypes = {
  isGettingTariffs: boolean
  isOpenMonthlyModal: boolean
  tariffs: TariffType[]
  editedMonthlyPlan: TariffType | null
}
export type TariffType = {
  id: number
  amount: number | null
  min_count: number | null
  max_count: number | null
  month_count: number | null
}
