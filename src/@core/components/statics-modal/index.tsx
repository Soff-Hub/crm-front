import { useState, useContext, useEffect } from 'react'
import { Dialog, DialogTitle, DialogContent, Button, Select, MenuItem } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { setSoffBotText, toggleModal } from 'src/store/apps/page'
import Typewriter from 'typewriter-effect'
import { AuthContext } from 'src/context/AuthContext'
import { CeoContent } from './components/ceo-content/ceo-content'
import { TeacherContent } from './components/teacher-content/teacher-content'
import { AdminContent } from './components/admin-content/admin-content'
import confetti from 'canvas-confetti'
import api from 'src/@core/utils/api'
import { useAppSelector } from 'src/store'

function randomInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

const StaticsModal = () => {
  const dispatch = useDispatch()
  const { user } = useContext(AuthContext)
  const { isModalOpen } = useAppSelector(state => state.page)
  const soffBotText = useAppSelector(state => state.page.soffBotText)
  const soffBotStatus = useAppSelector(state => state.page.soffBotStatus)

  const [typingComplete, setTypingComplete] = useState(false)
  const [showFireworks, setShowFireworks] = useState(false)
  const [triggerConfetti, setTriggerConfetti] = useState(false)
  const [selectedDate, setSelectedDate] = useState('yesterday')

  const currentDate = new Date().toISOString().split('T')[0]
  const yesterdayDate = new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0]
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    setUserRole(localStorage.getItem('userRole'))
  }, [])

  const fetchAnalytics = async (date: string) => {
    try {
      const response = await api.get('auth/analytics/', { params: { date } })
      dispatch(setSoffBotText(response.data))
    } catch (error) {
      console.error('Analytics yuklashda xatolik:', error)
    }
  }

  useEffect(() => {
    fetchAnalytics(yesterdayDate)
  }, [])

  useEffect(() => {
    if (triggerConfetti) {
      confetti({
        angle: randomInRange(55, 125),
        spread: randomInRange(50, 70),
        particleCount: randomInRange(50, 100),
        origin: { x: 0.5, y: 0.5 },
        zIndex: 99999
      })
      setTriggerConfetti(false)
    }
  }, [triggerConfetti])

  const handleClose = () => {
    dispatch(toggleModal(false))
    setTypingComplete(false)
  }

  const handleChangeDate = (date: string) => {
    setSelectedDate(date)
    fetchAnalytics(date === 'yesterday' ? yesterdayDate : currentDate)
  }

  return (
    <Dialog fullWidth maxWidth='md' open={isModalOpen} onClose={handleClose}>
      <DialogTitle sx={{ color: 'black', position: 'relative', paddingRight: '30px' }}>
        Hurmatli {user?.role?.includes('admin') ? 'admin' : ''} {user?.fullName}
        <img
          src={
            soffBotStatus === -1
              ? '/images/avatars/sadbot.png'
              : soffBotStatus === 0
              ? '/images/avatars/normalbot.png'
              : '/images/avatars/happybot.png'
          }
          width={55}
          height={55}
          style={{ position: 'absolute', top: 8, right: 8 }}
          alt='Bot Avatar'
        />
      </DialogTitle>

      <Select value={selectedDate} onChange={e => handleChangeDate(e.target.value)} size='small' sx={{ margin: 5 }}>
        <MenuItem value='yesterday'>Kechagi kun</MenuItem>
        <MenuItem value='today'>Bugungi kun</MenuItem>
      </Select>

      {soffBotText?.role === 'admin' ? (
        <AdminContent date={selectedDate} setTypingComplete={setTypingComplete} soffBotText={soffBotText} />
      ) : soffBotText?.role === 'ceo' ? (
        <CeoContent date={selectedDate} setTypingComplete={setTypingComplete} soffBotText={soffBotText} />
      ) : (
        <TeacherContent setTypingComplete={setTypingComplete} soffBotText={soffBotText} />
      )}

      {typingComplete && (
        <Button
          onClick={handleClose}
          variant='contained'
          sx={{
            m: 2,
            alignSelf: 'flex-end',
            borderRadius: '8px',
            padding: '10px 20px',
            backgroundColor: '#007BFF',
            color: 'white',
            fontSize: '0.9rem',
            fontWeight: 'bold',
            textDecoration: 'none',
            transition: 'background-color 0.3s ease',
            '&:hover': {
              backgroundColor: '#0056b3'
            },
            margin: '15px'
          }}
        >
          Tushunarli
        </Button>
      )}
    </Dialog>
  )
}

export default StaticsModal
