export interface SmsItemType {
    id: number
    description: string
}

export interface SettingsState {
    is_pending: boolean
    sms_list: SmsItemType[]
    openCreateSms: boolean
    openEditSms: null | SmsItemType
}