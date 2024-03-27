// ** MUI Import
import Box, { BoxProps } from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import { useSelector } from 'react-redux'

const FallbackSpinner = ({ sx }: { sx?: BoxProps['sx'] }) => {
  const { companyInfo } = useSelector((state: any) => state.user)

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        ...sx
      }}
    >
      <img src={companyInfo?.logo} height={35} />
      <CircularProgress disableShrink sx={{ mt: 6 }} />
    </Box>
  )
}

export default FallbackSpinner
