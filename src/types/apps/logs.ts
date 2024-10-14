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

export interface BotNotificationItem {
    id: number,
    chat_id: number,
    full_name: string,
    branches: number[],
    branches_data: [
        {
            name: string,
            id: number
        },
        {
            name: string,
            id: number
        }
    ]
}

export interface ILogsState {
    paymentLogs: PaymentLogItem[]
    paymentCount: number
    queryParams: { page: number }
    isLoading: boolean
    botNotifications: BotNotificationItem[]
    botNotificationsCount: number
    createLoading: boolean
    openCreate: boolean
    botData: null | number
}