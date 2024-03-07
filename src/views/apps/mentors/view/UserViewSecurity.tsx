import { Box, Card, CardContent, Typography } from "@mui/material"
import Link from "next/link"
import { useEffect, useState } from "react"
import useResponsive from "src/@core/hooks/useResponsive"
import api from "src/@core/utils/api"
import getMontName from "src/@core/utils/gwt-month-name"

const UserViewSecurity = ({ data }: any) => {
  const [newData, setNewData] = useState<any>([])
  const { isMobile } = useResponsive()

  const getGroups = async () => {
    try {
      const resp = await api.get(`common/groups/`, { params: { teacher: data.id } })
      setNewData(resp.data.results)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getGroups()
  }, [])

  return (
    <Box className='demo-space-y' sx={{ display: 'flex', flexDirection: 'column' }}>
      {
        newData.map((_: any, index: number) => (
          <Link href={`/groups/view/security/?id=${_.id}&moonth=${getMontName(null)}`} key={index} style={{ textDecoration: 'none' }}>
            <Box sx={{ display: 'flex', gap: '20px', cursor: 'pointer' }}>
              <Card sx={{ width: isMobile ? '100%' : '50%' }}>
                <CardContent sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <Typography sx={{ fontSize: '12px' }}>{_.name}</Typography>
                    <Typography sx={{ fontSize: '12px' }}>{_.course_name}</Typography>
                    <Typography sx={{ fontSize: '12px' }}>{'O\'quvchilar soni'}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: ' flex-end', gap: '5px' }}>
                    <Typography sx={{ fontSize: '12px' }}>Ochilgan sana: {_.start_date}</Typography>
                    <Typography sx={{ fontSize: '12px' }}>{_.start_at.split(':').splice(0, 2).join(':')} - {_.end_at.split(':').splice(0, 2).join(':')}</Typography>
                    <Typography sx={{ fontSize: '12px' }}>{_.student_count} ta</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Link>
        ))
      }
    </Box>
  )
}

export default UserViewSecurity
