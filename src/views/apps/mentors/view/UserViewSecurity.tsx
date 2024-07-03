import { Box, Card, CardContent, Typography } from "@mui/material"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import EmptyContent from "src/@core/components/empty-content"
import useResponsive from "src/@core/hooks/useResponsive"
import api from "src/@core/utils/api"
import getLessonDays from "src/@core/utils/getLessonDays"
import getMontName from "src/@core/utils/gwt-month-name"
import SubLoader from "../../loaders/SubLoader"

const UserViewSecurity = ({ data }: any) => {
  const [newData, setNewData] = useState<any>([])
  const { isMobile } = useResponsive()
  const { t } = useTranslation()
  const [loading, setLoading] = useState<boolean>(false)

  const getGroups = async () => {
    setLoading(true)
    try {
      const resp = await api.get(`common/groups/`, { params: { teacher: data.id } })
      setNewData(resp.data.results)
    } catch (err) {
      console.log(err)
    }
    setLoading(false)
  }

  useEffect(() => {
    getGroups()
  }, [])

  return (
    <Box className='demo-space-y' sx={{ display: 'flex', flexDirection: 'column' }}>
      {
        loading ? <SubLoader /> : newData?.length ? newData.map((_: any, index: number) => (
          <Link href={`/groups/view/security/?id=${_.id}&month=${getMontName(null)}`} key={index} style={{ textDecoration: 'none' }}>
            <Box sx={{ display: 'flex', gap: '20px', cursor: 'pointer' }}>
              <Card sx={{ width: isMobile ? '100%' : '50%' }}>
                <CardContent sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <Typography sx={{ fontSize: '12px' }}>{_.name}</Typography>
                    <Typography sx={{ fontSize: '12px' }}>{_.course_name}</Typography>
                    <Typography sx={{ fontSize: '12px' }}>{t("O'quvchilar soni")}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: ' flex-end', gap: '5px' }}>
                    <Typography sx={{ fontSize: '12px' }}>{t("Ochilgan sana")}: {_.start_date}</Typography>
                    <Typography sx={{ fontSize: '12px' }}>{t(`${getLessonDays(_.week_days)}`)} / {_.start_at.split(':').splice(0, 2).join(':')} - {_.end_at.split(':').splice(0, 2).join(':')}</Typography>
                    <Typography sx={{ fontSize: '12px' }}>{_.student_count}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Link>
        )) : <EmptyContent />
      }
    </Box>
  )
}

export default UserViewSecurity
