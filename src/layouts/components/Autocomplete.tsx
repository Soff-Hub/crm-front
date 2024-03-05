// ** React Imports
import { useEffect, useCallback, useRef, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'

// ** Types Imports
import { Settings } from 'src/@core/context/settingsContext'

// ** Icon Imports
import Icon from 'src/@core/components/icon'


interface Props {
  hidden: boolean
  settings: Settings
}


const AutocompleteComponent = ({ hidden, settings }: Props) => {
  // ** States
  const [isMounted, setIsMounted] = useState<boolean>(false)
  const [openDialog, setOpenDialog] = useState<boolean>(false)

  // ** Hooks & Vars
  const { layout } = settings
  const wrapper = useRef<HTMLDivElement>(null)


  useEffect(() => {
    setIsMounted(true)

    return () => setIsMounted(false)
  }, [])


  // Handle ESC & shortcut keys keydown events
  const handleKeydown = useCallback(
    (event: KeyboardEvent) => {
      // ** Shortcut keys to open searchbox (Ctrl + /)
      if (!openDialog && event.ctrlKey && event.which === 191) {
        setOpenDialog(true)
      }
    },
    [openDialog]
  )

  // Handle shortcut keys keyup events
  const handleKeyUp = useCallback(
    (event: KeyboardEvent) => {
      // ** ESC key to close searchbox
      if (openDialog && event.keyCode === 27) {
        setOpenDialog(false)
      }
    },
    [openDialog]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeydown)
    document.addEventListener('keyup', handleKeyUp)

    return () => {
      document.removeEventListener('keydown', handleKeydown)
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [handleKeyUp, handleKeydown])

  if (!isMounted) {
    return null
  } else {
    return (
      <Box
        ref={wrapper}
        onClick={() => !openDialog && setOpenDialog(true)}
        sx={{ display: 'flex', cursor: 'pointer', alignItems: 'center' }}
      >
        <IconButton color='inherit' sx={!hidden && layout === 'vertical' ? { mr: 1, ml: -2.75 } : {}}>
          <Icon icon='mdi:magnify' />
        </IconButton>
      </Box>
    )
  }
}

export default AutocompleteComponent
