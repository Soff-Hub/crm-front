import { Box, Card, CardContent, Typography } from "@mui/material"
import Link from "next/link"
import getMontName from "src/@core/utils/gwt-month-name"

const UserViewSecurity = () => {

  return (
    <Box className='demo-space-y' sx={{ display: 'flex', flexDirection: 'column' }}>
      {
        Array(2).fill(0).map((_, index) => (
          <Link href={`/groups/view/security/?id=1&moonth=${getMontName(null)}`} key={index} style={{ textDecoration: 'none' }}>
            <Box sx={{ display: 'flex', gap: '20px', cursor: 'pointer' }}>
              <Card sx={{ width: '50%' }}>
                <CardContent sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <Typography sx={{ fontSize: '12px' }}>{'Frontend 030'}</Typography>
                    <Typography sx={{ fontSize: '12px' }}>{'Frontend'}</Typography>
                    <Typography sx={{ fontSize: '12px' }}>{'O\'quvchilar soni'}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: ' flex-end', gap: '5px' }}>
                    <Typography sx={{ fontSize: '12px' }}>{'12.12.2024'}</Typography>
                    <Typography sx={{ fontSize: '12px' }}>Juft kunlar - {'18:00'}</Typography>
                    <Typography sx={{ fontSize: '12px' }}>{'21 ta'}</Typography>
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
