import { Box, Button, Typography } from '@mui/material'
import { useAppDispatch } from 'src/store'
import { handleMonthlyModalOpen } from 'src/store/apps/c-panel'

export default function Heading() {
  const dispatch = useAppDispatch()

  return (
    <Box sx={{ display: 'flex', mb: 5, alignItems: 'center', justifyContent: 'space-between' }}>
      <Typography variant='h6'>Oylik tariflar</Typography>
      <Button onClick={() => dispatch(handleMonthlyModalOpen(true))} variant='contained' color='primary'>
        Oylik tarif qo'shish
      </Button>
    </Box>
  )
}
