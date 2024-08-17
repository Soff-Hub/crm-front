import { useTranslation } from "react-i18next"
import DataTable from "src/@core/components/table"

export default function StudentHistory() {
    const { t } = useTranslation()

    const columns = [
        {
            xs: 0.2,
            title: t("ID"),
            dataIndex: 'id'
        },
        {
            xs: 0.6,
            title: t("Sana"),
            dataIndex: 'payment_date',
        },
        {
            xs: 0.6,
            title: t("Turi"),
            dataIndex: 'is_debtor',
        },
        {
            xs: 0.7,
            title: t('Summa'),
            dataIndex: 'amount',
        },
        {
            xs: 1,
            title: t("Guruh"),
            dataIndex: 'group_name',
        },
        {
            xs: 1,
            title: t("Izoh"),
            dataIndex: 'description',
        },
        {
            xs: 1,
            title: t("Qabul qildi"),
            dataIndex: 'admin',
        }
    ]

    return (
        <DataTable color loading={false} maxWidth="100%" minWidth="450px" data={[].map((el: any) => ({ ...el, color: Number(el.amount) >= 0 ? 'transparent' : 'rgba(227, 18, 18, 0.1)', is_debtor: Number(el.amount) >= 0 }))} columns={columns} />
    )
}
