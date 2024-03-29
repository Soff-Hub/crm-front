import { Box, Card, CardContent, Typography } from "@mui/material"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import DataTable from "src/@core/components/table"
import useResponsive from "src/@core/hooks/useResponsive"
import api from "src/@core/utils/api"
import { formatDateTime } from "src/@core/utils/date-formatter"
import { formatCurrency } from "src/@core/utils/format-currency"
import getMontName from "src/@core/utils/gwt-month-name"
import { customTableProps } from "src/pages/groups"



const UserViewSecurity = ({ groupData }: any) => {

  const { t } = useTranslation()
  const { query } = useRouter()
  const [data, setData] = useState([])
  const { isMobile } = useResponsive()

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
      render: (amount) => `${formatCurrency(amount)} UZS`
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

  async function getPayments() {
    try {
      const resp = await api.get(`common/student-payment/list/${query.student}/`)
      setData(resp.data)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getPayments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Box className='demo-space-y'>
      {
        groupData && groupData.length > 0 ?
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {
              groupData.map((group: any) => (
                <Link key={group.id} href={`/groups/view/security/?id=${group.group_data.id}&month=${getMontName(null)}`} style={{ textDecoration: 'none' }}>
                  <Box sx={{ display: 'flex', gap: '20px' }} >
                    <Card sx={{ width: isMobile ? '100%' : '50%' }}>
                      <CardContent sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                          <Typography sx={{ fontSize: '12px' }}>{group.group_data.name}</Typography>
                          <Typography sx={{ fontSize: '12px' }}>{group.course.name}</Typography>
                          <Typography sx={{ fontSize: '12px' }}>{group.teacher.first_name}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: ' flex-end', gap: '5px' }}>
                          <Typography sx={{ fontSize: '12px' }}>{group.date}</Typography>
                          <Typography sx={{ fontSize: '12px' }}>Juft kunlar - {group.start_at}</Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Box></Link>
              ))
            }
          </Box> : ''
      }

      <Typography sx={{ my: 3, fontSize: '20px' }}>To'lov tarixi</Typography>
      <DataTable maxWidth="100%" minWidth="450px" data={data} columns={columns} />
    </Box >
  )
}

export default UserViewSecurity
