// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Typography from '@mui/material/Typography'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { useTranslation } from 'react-i18next'

type Props = {
  open: boolean
  setOpen: (val: boolean) => void
  handleOk?: () => any,
  okText?: string | undefined
}

const UserSuspendDialog = (props: Props) => {
  // ** Props
  const { open, setOpen, handleOk, okText } = props
  const { t } = useTranslation()

  // ** States
  const [userInput, setUserInput] = useState<string>('yes')
  const [secondDialogOpen, setSecondDialogOpen] = useState<boolean>(false)

  const handleClose = () => {
    setOpen(false)
    setSecondDialogOpen(false)
  }

  const handleSecondDialogClose = () => {
    setSecondDialogOpen(false)
  }

  const handleConfirmation = async (value: string) => {
    setUserInput(value)
    if (value === 'yes') {
      await handleOk?.()
      setOpen(false)
    }
  }

  const handleConfirmation2 = async (value: string) => {
    setUserInput(value)

    if (value === 'cancel') {
      setOpen(false)
      setSecondDialogOpen(true)
    }
  }

  function handleModalClose() {
    setSecondDialogOpen(false)
  }

  return (
    <>
      <Dialog fullWidth open={open} onClose={handleClose} sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 512 } }}>
        <DialogContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <Box sx={{ mb: 4, maxWidth: '85%', textAlign: 'center', '& svg': { mb: 12.25, color: 'warning.main' } }}>
              <Icon icon='mdi:alert-circle-outline' fontSize='5.5rem' />
              <Typography variant='h4' sx={{ color: 'text.secondary' }}>
                {t("Ishonchingiz komilmi?")}
              </Typography>
            </Box>
            <Typography>{t("Siz bu jarayonni ortqa qaytara olmaysiz qaytara olmaysiz!")}</Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button
            variant='contained'
            style={{ marginTop: '30px' }}
            color='error'
            onClick={() => handleConfirmation('yes')}
          >
            {okText ? okText : t("O'chirish")}
          </Button>
          <Button
            variant='outlined'
            style={{ marginTop: '30px' }}
            color='secondary'
            onClick={() => handleConfirmation2('cancel')}
          >
            {t("Bekor qilish")}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        fullWidth
        open={secondDialogOpen}
        onClose={handleSecondDialogClose}
        sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 512 } }}
      >
        <DialogContent>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              '& svg': {
                mb: 14,
                color: userInput === 'yes' ? 'success.main' : 'error.main'
              }
            }}
          >
            <Icon
              fontSize='5.5rem'
              icon={userInput === 'yes' ? 'mdi:check-circle-outline' : 'mdi:close-circle-outline'}
            />
            <Typography variant='h4' sx={{ mb: 6 }}>
              {userInput === 'yes' ? t('Muvaffaqiyatli!') : t('Bekor qilindi')}
            </Typography>
            <Typography>{userInput === 'yes' ? t(`Muvaffaqiyatli o'chirilidi!`) : t("O'chirish  bekor qilindi")}</Typography>
            <DialogActions sx={{ justifyContent: 'center', p: 3 }}>
              <Button variant='contained' color='success' onClick={handleModalClose}>
                {t("Yaxshi")}
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default UserSuspendDialog
