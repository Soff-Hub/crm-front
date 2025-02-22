import {
  Badge,
  Box,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Tooltip,
  Typography
} from '@mui/material'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import api from 'src/@core/utils/api'
import { useAppSelector } from 'src/store'
import { toggleQrCodeModal } from 'src/store/apps/page'
import { Icon } from '@iconify/react'
import useResponsive from 'src/@core/hooks/useResponsive'
import { Done } from '@mui/icons-material'
import useDebounce from 'src/hooks/useDebounce'

const QrCodeModal = () => {
  const { isQrCodeModalOpen } = useAppSelector(state => state.page)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { isMobile } = useResponsive()

  const [studentId, setStudentId] = useState('')
  const debouncedStudentId = useDebounce(studentId, 500)
  const [errorText, setErrorText] = useState('')
  const [userData, setUserData] = useState<any | null>(null)

  const validateUUID = (id: string) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    return uuidRegex.test(id)
  }

  const handleClose = () => {
    dispatch(toggleQrCodeModal(false))
    setStudentId('')
    setErrorText('')
    setUserData(null)
  }

  const handleSendQrCode = async (id: string) => {
    if (!id) return

    if (!validateUUID(id)) {
      setErrorText("Noto'g'ri ID format")
      return
    }

    try {
      const res = await api.post(`common/attendance/by-qr-code/${id}/`)

      if (res.status === 200) {
        setUserData(res.data)
        setErrorText('')

        setTimeout(() => {
          setUserData(null)
          setStudentId('')
        }, 7000)
      }
    } catch (err: any) {
      console.error(err)
      if (err.response?.status === 404) {
        setErrorText("Ma'lumot topilmadi")
      } else {
        setErrorText(err.response?.data?.msg || 'Bu shaxs topilmadi')
      }

      setTimeout(() => {
        setUserData(null)
        setStudentId('')
      }, 7000)
    }
  }

  useEffect(() => {
    if (debouncedStudentId) {
      handleSendQrCode(debouncedStudentId)
    }
  }, [debouncedStudentId])

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
          error={Boolean(errorText)}
          sx={{ marginTop: 1.2 }}
          value={studentId}
          label={t('Qr code ')}
          onChange={e => setStudentId(e.target.value)}
          placeholder='Scan or enter QR code'
        />

        {errorText && (
          <div className='border rounded mt-2'>
            <Typography color={'red'} textAlign={'center'} p={4} fontSize={14}>
              {errorText}
            </Typography>
          </div>
        )}

        {studentId && userData && (
          <Box
            className='border rounded mt-2'
            p={4}
            display={'flex'}
            alignItems={'center'}
            justifyContent={'space-between'}
          >
            <Stack display={'flex'}>
              <Typography fontSize={14}>
                <b>FIO:</b> {userData.first_name}
              </Typography>

              <Typography fontSize={14}>
                <b>Telefon:</b> {userData.phone}
              </Typography>
            </Stack>

            <Chip label='Darsga keldi' color='success' variant='outlined' icon={<Done />} />
          </Box>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default QrCodeModal
