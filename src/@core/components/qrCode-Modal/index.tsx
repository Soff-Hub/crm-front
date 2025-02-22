import { Dialog, DialogContent, DialogTitle, TextField, Tooltip, Typography } from '@mui/material'
import toast from 'react-hot-toast'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import api from 'src/@core/utils/api'
import { useAppSelector } from 'src/store'
import { toggleQrCodeModal } from 'src/store/apps/page'
import { Icon } from '@iconify/react'
import useResponsive from 'src/@core/hooks/useResponsive'
import { CheckOutlined } from '@mui/icons-material'

const QrCodeModal = () => {
  const { isQrCodeModalOpen } = useAppSelector(state => state.page)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { isMobile } = useResponsive()

  const [studentId, setStudentId] = useState('')
  const [errorText, setErrorText] = useState('')
  const [userData, setUserData] = useState<any | null>(null)

  const handleClose = () => {
    dispatch(toggleQrCodeModal(false))
    setStudentId('')
    setErrorText('')
    setUserData(null)
  }

  const handleSendQrCode = async (id: string) => {
    if (!id) return
    try {
      const res = await api.post(`common/attendance/by-qr-code/${id}/`)

      if (res.status === 200) {
        setUserData(res.data) // Foydalanuvchi ma'lumotlarini saqlash
      

        setTimeout(() => setUserData(null), 2000)

        setTimeout(() => setStudentId(''), 2000)
        setErrorText('')
      }
    } catch (err: any) {
      console.error(err)
      if (err.response?.status === 404) {
        setErrorText("Ma'lumot topilmadi")
      } else {
        setErrorText(err.response?.data?.msg || 'Bu shaxs topilmadi')
      }
      setTimeout(() => setStudentId(''), 2000)
      setTimeout(() => setErrorText(''), 2000)
    }
  }

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStudentId(e.target.value)
    handleSendQrCode(e.target.value)
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
          placeholder='Scan or enter QR code'
        />

        {errorText && (
          <Typography color={'red'} textAlign={'center'} pt={2} fontSize={14}>
            {errorText}
          </Typography>
        )}

        {userData && (
          <div className='mt-4 text-center'>
            <Typography fontSize={14}>
              <b>FIO:</b> {userData.first_name}
            </Typography>
            <Typography fontSize={14}>
              <b>Telefon:</b> {userData.phone}
            </Typography>
            <CheckOutlined color='success'/>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default QrCodeModal
