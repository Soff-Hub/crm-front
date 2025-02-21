import { Dialog, DialogContent, DialogTitle, TextField, Tooltip } from '@mui/material'
import toast from 'react-hot-toast'
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
  const [studentId, setStudentId] = useState('')
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)
  const { isMobile } = useResponsive()

  const handleClose = () => {
    dispatch(toggleQrCodeModal(false))
    setStudentId('')
    if (timeoutId) clearTimeout(timeoutId)
  }

  const handleSendQrCode = async (id: string) => {
    if (!id) return
    try {
      const res = await api
        .post(`common/attendance/by-qr-code/${id}/`)
        .then(res => {
          if (res.status === 200) {
            toast.success('Muvaffaqiyatli', {
              style: {
                zIndex: 999999999
              }
            })
            setStudentId('')
          }
        })
        .catch(err => {
          console.error(err)
          if (err.response.status == 404) {
            toast.error("Ma'lumot topilmadi", {
              style: {
                zIndex: 999999999
              }
            })
          } else {
            toast.error(err.response.data.msg)
          }
          setStudentId('')
        })
    } catch (err) {
      throw new Error("Ma'lumot topilmadi")
    }
  }

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setStudentId(value)
    if (timeoutId) clearTimeout(timeoutId)

    if (value.length) {
      const newTimeoutId = setTimeout(() => handleSendQrCode(value), 2000)
      setTimeoutId(newTimeoutId)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (timeoutId) clearTimeout(timeoutId)
      handleSendQrCode(studentId)
    }
  }

  return (
    <Dialog
      open={isQrCodeModalOpen}
      onClose={handleClose}
      sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 450, zIndex: 10000 } }}
    >
      <DialogTitle id='user-view-edit' sx={{ textAlign: 'center', fontSize: '1.5rem !important' }}>
        {t('Skanner orqali davomat qilish')}
        <Tooltip
          title="O'quvchini profili orqali olingan QR Code ni apparat yordamida skanerlang va tizim avtomatik davomat qiladi"
          arrow
        >
          <span style={{ cursor: 'pointer' }}>
            <Icon icon='mdi:help-circle-outline' style={{ fontSize: isMobile ? '16px' : '20px', marginLeft: '5px' }} />
          </span>
        </Tooltip>
      </DialogTitle>

      <DialogContent>
        <TextField
          type='text'
          size='small'
          fullWidth
          sx={{ marginTop: 1.2 }}
          value={studentId}
          label={t('Qr code ')}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder='Scan or enter QR code'
        />
      </DialogContent>
    </Dialog>
  )
}

export default QrCodeModal
