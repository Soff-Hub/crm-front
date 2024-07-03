import { GetServerSidePropsContext, InferGetStaticPropsType } from "next/types";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import DataTable, { customTableDataProps } from "src/@core/components/table";
import { formatCurrency } from "src/@core/utils/format-currency";
import { useAppDispatch, useAppSelector } from "src/store";
import { fetchModerationSalaries } from "src/store/apps/finance";

const UserView = ({ slug }: InferGetStaticPropsType<typeof getServerSideProps>) => {
    const { moderation_salaries, isPending } = useAppSelector(state => state.finance)
    const dispatch = useAppDispatch()
    const { t } = useTranslation()

    const withdrawCol: customTableDataProps[] = [
        {
            xs: 0.03,
            title: "#",
            dataIndex: "index",
        },
        {
            xs: 0.16,
            title: t("first_name"),
            dataIndex: "employee_data",
            render: (employee_data: any) => employee_data.name
        },
        {
            xs: 0.16,
            title: t("O'zgarmas oylik"),
            dataIndex: "fixed_salary",
            render: (fixed_salary) => `${formatCurrency(+fixed_salary)} so'm`
        },
        {
            xs: 0.08,
            title: t("KPI (%)"),
            dataIndex: "kpi",
            render: (kpi) => `${+kpi} %`
        },
        {
            xs: 0.14,
            title: t("Jami KPI (so'm)"),
            dataIndex: 'kpi_salary',
            render: (kpi_salary) => `${formatCurrency(kpi_salary)} so'm`
        },
        {
            xs: 0.17,
            title: t("Tushurgan summa"),
            dataIndex: 'profit_amount',
            render: (profit_amount) => `${formatCurrency(profit_amount)} so'm`
        },
        {
            xs: 0.14,
            title: t("Jami ish haqqi"),
            dataIndex: 'salary',
            render: (salary) => `${formatCurrency(salary)} so'm`
        },
        // {
        //     xs: 0.15,
        //     title: t("Avanslar"),
        //     dataIndex: 'index',
        //     render: () => "5 400 000"
        // },
        {
            xs: 0.13,
            title: `${t("Jarimalar soni")}`,
            dataIndex: 'fines_count',
            render: (fines_count) => `${fines_count} ta`
        },
        {
            xs: 0.15,
            title: `${t("Bonuslar")} (so'm)`,
            dataIndex: 'bonus_amount',
            render: (bonus_amount) => `${formatCurrency(bonus_amount)} so'm`
        },
        {
            xs: 0.16,
            title: `${t("Jarimalar")} (so'm)`,
            dataIndex: 'fine_amount',
            render: (fine_amount) => `${formatCurrency(fine_amount)} so'm`
        },
        {
            xs: 0.18,
            title: t("Yakuniy ish haqqi"),
            dataIndex: 'final_salary',
            render: (final_salary) => `${formatCurrency(final_salary)} so'm`
        },
    ]

    useEffect(() => {
        dispatch(fetchModerationSalaries(`date=${slug}`))
    }, [])

    return <DataTable loading={isPending} maxWidth='100%' minWidth='800px' columns={withdrawCol} data={moderation_salaries} />
}


export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { query, params } = context;

    return {
        props: {
            slug: params?.slug
        },
    };
}

export default UserView
