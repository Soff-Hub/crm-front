import { Box, Card, CardContent, Typography } from "@mui/material"
import { useRouter } from "next/router"
import IconifyIcon from "src/@core/components/icon"
import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useState } from "react";
import api from "src/@core/utils/api";
import DataTable from "src/@core/components/table";
import { formatCurrency } from "src/@core/utils/format-currency";
import { formatDateTime } from "src/@core/utils/date-formatter";
import { customTableProps } from "src/pages/groups";
import useResponsive from "src/@core/hooks/useResponsive";
import SubLoader from "../loaders/SubLoader";


const Item = ({ defaultValue }: { defaultValue: true | false | null | 0 }) => {


    if (defaultValue === true || defaultValue === false || defaultValue === null) {
        return (
            <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <span style={{ display: 'flex' }}>
                    {
                        defaultValue === true ? (
                            <IconifyIcon icon={'game-icons:check-mark'} fontSize={18} color="#4be309" />
                        ) : defaultValue === false ? (
                            <IconifyIcon icon={'mdi:cancel-bold'} fontSize={18} color="#e31309" />
                        ) : defaultValue === null ? (
                            <IconifyIcon icon={'fluent:square-20-regular'} fontSize={18} color="#9e9e9e" />
                        ) : <IconifyIcon icon={'material-symbols:lock-outline'} fontSize={18} color="#9e9e9e" />
                    }
                </span>
            </Box>
        )
    } else {
        return (
            <span>
                <IconifyIcon icon={'material-symbols:lock-outline'} fontSize={18} color="#9e9e9e" />
            </span>
        )
    }
}

const StudentGroupDetail = ({ slug, month }: any) => {
    const { pathname, query, push } = useRouter()
    const { t } = useTranslation()
    const [data, setData] = useState<any>([])
    const [days, setDays] = useState<any>({})
    const [loading, setLoading] = useState<any>(null)
    const [isLoading, setIsLoading] = useState<any>(null)
    const [payLoading, setPayLoading] = useState<any>(null)
    const [pays, setPays] = useState<any[]>([])
    const { isMobile } = useResponsive()

    const handleClick = (value: any) => {

        push({
            pathname,
            query: { ...query, month: value.date, year: value.year, id: slug }
        })
    }

    const getAttendence = async () => {
        const resp = await api.get(`common/student/attendance/${slug}/date/${month}/`)
        setData(resp.data);
    }

    const getPayments = async () => {
        setPayLoading(true)
        const resp = await api.get(`common/student/payments/${slug}/`)
        setPays(resp.data);
        setPayLoading(false)
    }

    const getDays = async () => {
        setIsLoading(true)
        const resp = await api.get(`common/day-of-week/${slug}/date/${month}/`)
        setDays(resp.data);
        setIsLoading(false)
    }

    const handlePrint = useCallback(async (id: number | string) => {
        const subdomain = location.hostname.split('.')
        try {
            const response = await fetch(
                `${process.env.NODE_ENV === 'development' ? process.env.NEXT_PUBLIC_TEST_BASE_URL : subdomain.length < 3 ? `https://${process.env.NEXT_PUBLIC_BASE_URL}` : `https://${subdomain[0]}.${process.env.NEXT_PUBLIC_BASE_URL}`}/common/generate-check/${id}/`,
                {
                    method: "GET",
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                    },
                }
            );
            const data = await response.blob();
            const blobUrl = URL.createObjectURL(data);
            const printFrame: any = document.getElementById("printFrame");
            printFrame.src = blobUrl;
            printFrame.onload = function () {
                printFrame.contentWindow.print();
            };
        } catch (error) {
            console.error("Print error:", error);
        }
    }, []);

    async function getReceipt(id: any) {
        setLoading(id)
        try {
            await handlePrint(id)
            setLoading(false)
        } catch (err) {
            console.log(err)
        }
    }

    const columns: customTableProps[] = [
        {
            xs: 0.2,
            title: t("ID"),
            dataIndex: 'id'
        },
        {
            xs: 0.8,
            title: t("Sana"),
            dataIndex: 'created_at',
            render: (date: string) => formatDateTime(date)
        },
        {
            xs: 0.7,
            title: t("Summa"),
            dataIndex: 'amount',
            render: (amount: any) => `${formatCurrency(amount)} UZS`
        },
        {
            xs: 1,
            title: t("Qabul qildi"),
            dataIndex: 'admin',
        },
        {
            xs: 1,
            title: t("Amallar"),
            dataIndex: 'id',
            render: (id) => (
                <Box sx={{ display: 'flex', gap: '10px' }}>
                    {loading === id ? <IconifyIcon icon={'la:spinner'} fontSize={20} /> : <IconifyIcon onClick={() => getReceipt(id)} icon={`ph:receipt-light`} fontSize={20} />}
                </Box>
            )
        }
    ]

    useEffect(() => {
        Promise.all([
            getDays(),
            getAttendence()
        ])
    }, [month])

    useEffect(() => {
        getPayments()
    }, [])


    return (
        <Box className='demo-space-y' sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '20px' }}>
            <Card sx={{ maxWidth: '600px', minWidth: '600px' }}>
                <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', mb: 5 }} >
                        <Typography variant='h6'>{t("Davomat")} |</Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <Item defaultValue />
                            <Typography variant="body2">{t("Kelgan")}, </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <Item defaultValue={false} />
                            <Typography variant="body2">{t("Kelmagan")},</Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <Item defaultValue={null} />
                            <Typography variant="body2">{t("Yoqlama qilinmagan")},</Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <Item defaultValue={0} />
                            <Typography variant="body2">{t("Yopiq")},</Typography>
                        </Box>

                    </Box>
                    <div style={{ display: 'flex', listStyle: 'none', margin: 0, padding: '5px 0', overflowX: 'auto' }}>
                        {
                            days?.months && days?.months.map((item: any) => (
                                <div
                                    key={item.date}
                                    onClick={() => handleClick(item)}
                                    style={{
                                        borderBottom: month === item.date ? '2px solid #c3cccc' : '2px solid transparent',
                                        cursor: 'pointer',
                                        marginRight: '15px'
                                    }}>
                                    {item.month}
                                </div>
                            ))
                        }
                    </div>
                    <Box sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        flexDirection: isMobile ? 'column' : 'row',
                    }}>
                        {
                            !isLoading && days?.result ? days?.result.map((day: any, key: number) => (
                                <Box
                                    key={key}
                                    sx={{
                                        width: isMobile ? '100%' : '50%',
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        padding: '5px 0',
                                        gap: '10px'
                                    }}
                                >
                                    <span>{day.date.split('-').reverse().join('-')}</span>
                                    <span>
                                        <Item defaultValue={data.find((el: any) => el.date === day.date)?.is_available} />
                                    </span>
                                </Box>
                            )) : <SubLoader />
                        }
                    </Box>
                </CardContent>
            </Card>
            <DataTable minWidth="600px" data={pays} columns={columns} loading={payLoading} />
        </Box >
    )
}

export default StudentGroupDetail
