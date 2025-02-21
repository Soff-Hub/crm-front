import { Box, Card, CardContent, Skeleton } from '@mui/material'

export default function GroupSkeleton() {
  return (
    <>
      {[1, 2, 3].map(num => (
        <Box key={num} style={{ textDecoration: 'none' }}>
          <Box sx={{ display: 'flex', gap: '20px' }}>
            <Card>
              <CardContent sx={{ display: 'flex', justifyContent: 'space-between', minWidth: '320px' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <Skeleton variant='text' width={120} />
                  <Skeleton variant='text' width={115} />
                  <Skeleton variant='text' width={130} />
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: ' flex-end', gap: '5px' }}>
                  <Skeleton variant='text' width={40} />
                  <Skeleton variant='text' width={105} />
                  <Skeleton variant='text' width={130} />
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
      ))}
    </>
  )
}
