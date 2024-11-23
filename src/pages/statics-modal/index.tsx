import { useState, useContext } from 'react'
import { Dialog, DialogTitle, DialogContent, Button } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { toggleModal } from 'src/store/apps/page'
import Typewriter from 'typewriter-effect'
import { AuthContext } from 'src/context/AuthContext'
import useRoles from 'src/hooks/useRoles'
import { CeoContent } from './components/ceo-content/ceo-content'
import { TeacherContent } from './components/teacher-content/teacher-content'

const StaticsModal = () => {
  const [displayedMessage, setDisplayedMessage] = useState('')
  const [typingComplete, setTypingComplete] = useState(false)

  const dispatch = useDispatch()
  const { user } = useContext(AuthContext)
  const currentDate = new Date().toISOString()
  const isModalOpen = useSelector((state: any) => state.page.isModalOpen)
  const soffBotText = useSelector((state: any) => state.page.soffBotText)
  const soffBotStatus = useSelector((state: any) => state.page.soffBotStatus)
  const userRole = localStorage.getItem("userRole")
  const handleClose = () => {
    const last_login = localStorage.getItem('last_login')
    if (last_login !== currentDate) {
      localStorage.setItem('last_login', currentDate)
      dispatch(toggleModal(false))
      setDisplayedMessage('')
    }
    if (userRole !== user?.role.join(', '))
      localStorage.setItem('userRole',String(user?.role.join(', ')))
    dispatch(toggleModal(false))
    setTypingComplete(false)
  }
  return (
    <Dialog
      // onClick={e => e.stopPropagation()}
      open={isModalOpen}
      onClose={handleClose}
      fullWidth
    >
      <DialogTitle sx={{ color: 'black', position: 'relative', paddingRight: '30px' }}>
        Hurmatli {user?.fullName}
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
          style={{ color: 'black', position: 'absolute', top: 8, right: 8 }}
        />
      </DialogTitle>
      {soffBotText?.role === 'ceo' ? (
        <CeoContent setTypingComplete={setTypingComplete} soffBotText={soffBotText}/>
      ) : (
       <TeacherContent setTypingComplete={setTypingComplete} soffBotText={soffBotText}/>
      )}

      {typingComplete && ( 
        <Button
          onClick={handleClose}
          variant='contained'
          sx={{
            m: 2,
            alignSelf: 'flex-end',
            borderRadius: '25px',
            padding: '5px 15px',
            backgroundColor: '#0077FF',
            '&:hover': {
              backgroundColor: '#005BB5'
            }
          }}
        >
          Tushunarli
        </Button>
      )}
    </Dialog>
  )
}

export default StaticsModal
