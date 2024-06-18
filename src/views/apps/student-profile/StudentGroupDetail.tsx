import { Box, Card, CardContent, Typography } from "@mui/material"
import { useRouter } from "next/router"
import IconifyIcon from "src/@core/components/icon"
import getMontName, { getMontNumber } from "src/@core/utils/gwt-month-name";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import api from "src/@core/utils/api";
import DataTable from "src/@core/components/table";
import { formatCurrency } from "src/@core/utils/format-currency";
import { formatDateTime } from "src/@core/utils/date-formatter";
import { customTableProps } from "src/pages/groups";
import { downloadImage } from "../students/view/UserViewSecurity";
import useResponsive from "src/@core/hooks/useResponsive";


interface Result {
    date: string;
    year: string;
}

interface DateInfo {
    date: string;
    year: string;
}

const Item = ({ defaultValue }: { defaultValue: true | false | null | 0 }) => {


    if (defaultValue === true || defaultValue === false || defaultValue === null) {
        return (
            <Box sx={{ position: 'relative' }}>
                <span>
                    {
                        defaultValue === true ? (
                            <IconifyIcon icon={'game-icons:check-mark'} fontSize={18} color="#4be309" />
                        ) : defaultValue === false ? (
                            <IconifyIcon icon={'mdi:cancel-bold'} fontSize={18} color="#e31309" />
                        ) : defaultValue === null ? (
                            <IconifyIcon icon={'fluent:square-20-regular'} fontSize={18} color="#9e9e9e" />
                        ) : ''
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

const StudentGroupDetail = ({ slug, month, start_date, month_duration }: any) => {
    const { pathname, query, push } = useRouter()
    const { t } = useTranslation()
    const [data, setData] = useState<any>([])
    const [days, setDays] = useState<any[]>([])
    const [loading, setLoading] = useState<any>(null)
    const [pays, setPays] = useState<any[]>([])
    const { isMobile } = useResponsive()

    const months: string[] = ['yan', 'fev', 'mar', 'apr', 'may', 'iyun', 'iyul', 'avg', 'sen', 'okt', 'noy', 'dek']

    const generateDates = (startMonth: any, numMonths: number): Result[] => {
        const result: DateInfo[] = [];
        let currentDate = new Date(startMonth);

        for (let i = 0; i < numMonths; i++) {
            const year = currentDate.getFullYear();
            const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
            const day = currentDate.getDate().toString().padStart(2, '0');

            result.push({
                date: `${year}-${month}-${day}`,
                year: `${year}`
            });

            currentDate.setMonth(currentDate.getMonth() + 1);
        }

        return result
    };


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
        const resp = await api.get(`common/student/payments/${slug}/`)
        setPays(resp.data);
    }

    const getDays = async () => {
        const resp = await api.get(`common/day-of-week/${slug}/date/${month}/`)
        setDays(resp.data);
    }

    async function getReceipt(id: any) {
        setLoading(id)
        const subdomain = location.hostname.split('.')
        try {
            await downloadImage(`receipt-${new Date().getTime()}.pdf`, `${process.env.NODE_ENV === 'development' ? process.env.NEXT_PUBLIC_TEST_BASE_URL : subdomain.length < 3 ? `https://${process.env.NEXT_PUBLIC_BASE_URL}` : `https://${subdomain[0]}.${process.env.NEXT_PUBLIC_BASE_URL}`}/api/v1/common/generate-check/${id}/`)
            // await downloadImage(`receipt-${new Date().getTime()}.pdf`, `http://192.168.1.48:8000/api/v1/common/generate-check/${id}/`)
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
            title: t("Izoh"),
            dataIndex: 'description',
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
        getDays()
        getAttendence()
    }, [month])

    useEffect(() => {
        getPayments()
    }, [])

    return (
        <Box className='demo-space-y' sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '20px' }}>
            <Card sx={{ maxWidth: '400px' }}>
                <CardContent>
                    <Typography>{t("Davomat")}</Typography>
                    <div style={{ display: 'flex', listStyle: 'none', margin: 0, padding: '10px 0', marginBottom: 12, overflowX: 'scroll' }}>
                        {
                            generateDates(start_date, month_duration).map(item => (
                                <div
                                    key={item.date}
                                    onClick={() => handleClick(item)}
                                    style={{
                                        borderBottom: (month.split('-')[1] ? getMontName(Number(month.split('-')[1])) : month) === getMontName(Number(item.date.split('-')[1])) ? '2px solid #c3cccc' : '2px solid transparent',
                                        cursor: 'pointer',
                                        marginRight: '15px'
                                    }}>
                                    {getMontName(Number(item.date.split('-')[1]))}
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
                            days.map((day, key) => (
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
                                    <span>{day.date}</span>
                                    <span>
                                        <Item defaultValue={
                                            data.find((el: any) => el.date === day.date)?.is_available
                                        } />
                                    </span>
                                </Box>
                            ))
                        }
                    </Box>
                </CardContent>
            </Card>
            <DataTable minWidth="900px" data={pays} columns={columns} />
        </Box >
    )
}

export default StudentGroupDetail
