// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Checkbox from '@mui/material/Checkbox'
import Typography from '@mui/material/Typography'
import FormControlLabel from '@mui/material/FormControlLabel'

// ** Types
import { ThemeColor } from 'src/@core/layouts/types'
import { SidebarLeftType, CalendarFiltersType } from 'src/types/apps/calendarTypes'

const SidebarLeft = (props: SidebarLeftType) => {

  const {
    store,
    mdAbove,
    dispatch,
    calendarsColor,
    leftSidebarOpen,
    leftSidebarWidth,
    handleCalendarsUpdate,
    handleLeftSidebarToggle,
  } = props

  const colorsArr = calendarsColor ? Object.entries(calendarsColor) : []

  const renderFilters = colorsArr.length
    ? colorsArr.map(([key, value]: string[]) => {
        return (
          <FormControlLabel
            key={key}
            label={key}
            sx={{ mb: 0.5 }}
            control={
              <Checkbox
                color={value as ThemeColor}
                checked={store.selectedCalendars.includes(key as CalendarFiltersType)}
                onChange={() => dispatch(handleCalendarsUpdate(key as CalendarFiltersType))}
              />
            }
          />
        )
      })
    : null


  if (renderFilters) {
    return (
      <Drawer
        open={leftSidebarOpen}
        onClose={handleLeftSidebarToggle}
        variant={'permanent'}
        ModalProps={{
          disablePortal: true,
          disableAutoFocus: true,
          disableScrollLock: true,
          keepMounted: true // Better open performance on mobile.
        }}
        sx={{
          zIndex: 2,
          display: 'block',
          position: mdAbove ? 'static' : 'absolute',
          '& .MuiDrawer-paper': {
            borderRadius: 1,
            boxShadow: 'none',
            width: leftSidebarWidth,
            borderTopRightRadius: 0,
            alignItems: 'flex-start',
            borderBottomRightRadius: 0,
            p: theme => theme.spacing(5),
            position: 'static'
          },
          '& .MuiBackdrop-root': {
            borderRadius: 1,
            position: 'absolute'
          }
        }}
      >
        <Typography variant='body2' sx={{ mb: 2.5, textTransform: 'uppercase' }}></Typography>
        {renderFilters}
      </Drawer>
    )
  } else {
    return null
  }
}

export default SidebarLeft
