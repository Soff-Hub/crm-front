import { styled } from '@mui/material/styles'
import Box, { BoxProps } from '@mui/material/Box'
import { BlankLayoutWithAppBarProps } from './types'
import AppBar from 'src/@core/layouts/components/blank-layout-with-appBar'
const BlankLayoutWithAppBarWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  height: '100vh',
  '& .content-center': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(5),
    minHeight: `calc(100vh - ${theme.spacing((theme.mixins.toolbar.minHeight as number) / 4)})`
  },
  '& .content-right': {
    display: 'flex',
    overflowX: 'hidden',
    position: 'relative',
    minHeight: `calc(100vh - ${theme.spacing((theme.mixins.toolbar.minHeight as number) / 4)})`
  }
}))

const BlankLayoutWithAppBar = (props: BlankLayoutWithAppBarProps) => {
  const { children } = props

  return (
    <BlankLayoutWithAppBarWrapper>
      <AppBar />
      <Box
        className='app-content'
        sx={{
          overflowX: 'hidden',
          position: 'relative',
          minHeight: theme => `calc(100vh - ${theme.spacing((theme.mixins.toolbar.minHeight as number) / 4)})`
        }}
      >
        {children}
      </Box>
    </BlankLayoutWithAppBarWrapper>
  )
}

export default BlankLayoutWithAppBar
