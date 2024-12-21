import { Dialog, DialogContent, DialogTitle, TextField, Tooltip } from '@mui/material'
import toast, { Toaster } from 'react-hot-toast'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import api from 'src/@core/utils/api'
import { useAppSelector } from 'src/store'
import { toggleQrCodeModal } from 'src/store/apps/page'
import { Icon } from '@iconify/react'
import useResponsive from 'src/@core/hooks/useResponsive'

const QrCodeModal = () => {
  const { isQrCodeModalOpen } = useAppSelector(state => state.page)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [studentId, setStudentId] = useState<any | null>(null)
  const [timeoutId, setTimeoutId] = useState<any>(null) // To store the timeout ID
  const { isMobile } = useResponsive()
  const [asteriskValue, setAsteriskValue] = useState<any>()
  function handleClose() {
    dispatch(toggleQrCodeModal(false))
    setAsteriskValue('')
    setStudentId('')
  }

  const handleSendQrCode = async (id: any) => {
    if (id) {
      await api
        .post(`common/attendance/by-qr-code/${id}/`)
        .then(res => {
          if (res.status === 200) {
            toast.success('Muvaffaqiyatli', {
              style: {
                zIndex: 999999999 // Adjust zIndex to ensure it appears above the modal
              }
            })
            setStudentId('') // Clear input after successful request
          }
        })
        .catch(err => {
          console.log(err)
          if (err.response.status == 404) {
            toast.error("Ma'lumot topilmadi")
          } else {
            toast.error(err.response.data.msg)
          }
          setStudentId('')
        })
    }
  }

  const handleInput = (e: any) => {
    const value = e.target.value
    setStudentId(value)
    // Clear previous timeout if any
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    // Set a new timeout to delay the API call
    const newTimeoutId = setTimeout(() => {
      handleSendQrCode(value)
    }, 1000) // Delay of 1 second before calling handleSendQrCode
    setTimeoutId(newTimeoutId) // Store the timeout ID to clear later
  }

  return (
    <>
      <Dialog
        open={isQrCodeModalOpen}
        onClose={handleClose}
        sx={{
          '& .MuiPaper-root': { width: '100%', maxWidth: 450, zIndex: 10000 } // Set a higher zIndex for the modal
        }}
      >
        <DialogTitle id='user-view-edit' sx={{ textAlign: 'center', fontSize: '1.5rem !important' }}>
          {t('Skanner orqali davomat qilish')}
          <Tooltip
            title="O'quvchini profili orqali olingan QR Code ni apparat yordamida skanerlang va tizim avtomatik davomat qiladi"
            arrow
          >
            <span style={{ cursor: 'pointer' }}>
              <Icon
                icon='mdi:help-circle-outline'
                style={{ fontSize: isMobile ? '16px' : '20px', marginLeft: '5px' }}
              />
            </span>
          </Tooltip>
        </DialogTitle>
        <DialogContent>
          <TextField
            type='text' // Changed to 'text' type to prevent numeric input issues
            size='small'
            name='message'
            fullWidth
            sx={{ marginTop: 1.2 }}
            value={studentId} // Empty when there's no studentId
            label={t('Qr code ')}
            onInput={handleInput}
            placeholder='Scan or enter QR code' // Optional placeholder text
          />
        </DialogContent>
      </Dialog>

      {/* Toaster should be outside modal to ensure it can appear on top */}
    </>
  )
}

export default QrCodeModal
