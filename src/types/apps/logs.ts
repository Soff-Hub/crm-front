export interface PaymentLogItem {
    id: number
    title: string
    text: string
    user_name: string
    user_phone: string
    admin_name: string
    admin_phone: string
    date: string
}

export interface ILogsState {
    paymentLogs: PaymentLogItem[]
    paymentCount: number
    isLoading: boolean
    queryParams: { page: number }
}