import { useState, useContext, useEffect } from 'react'
import { Dialog, DialogTitle, DialogContent, Button } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { toggleModal } from 'src/store/apps/page'
import Typewriter from 'typewriter-effect'
import { AuthContext } from 'src/context/AuthContext'
import useRoles from 'src/hooks/useRoles'
import { CeoContent } from './components/ceo-content/ceo-content'
import { TeacherContent } from './components/teacher-content/teacher-content'
import { AdminContent } from './components/admin-content/admin-content'
import confetti from 'canvas-confetti';

function randomInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}


const StaticsModal = () => {
  const [displayedMessage, setDisplayedMessage] = useState('')
  const [typingComplete, setTypingComplete] = useState(false)
  const [showFireworks, setShowFireworks] = useState(false)
  const dispatch = useDispatch()
  const { user } = useContext(AuthContext)
  const currentDate = new Date().toISOString()
  const isModalOpen = useSelector((state: any) => state.page.isModalOpen)
  const soffBotText = useSelector((state: any) => state.page.soffBotText)
  const soffBotStatus = useSelector((state: any) => state.page.soffBotStatus)
  const userRole = localStorage.getItem('userRole')
  const [triggerConfetti, setTriggerConfetti] = useState(false);


  useEffect(() => {
    if (triggerConfetti) {
      const launchConfetti = () => {
        confetti({
          angle: randomInRange(55, 125),
          spread: randomInRange(50, 70),
          particleCount: randomInRange(50, 100),
          origin: { x: 0.5, y: 0.5 }, 
          zIndex:99999
        });
      };

      launchConfetti();

      setTriggerConfetti(false);
    }
  }, [triggerConfetti])



  const handleClose = () => {
    const last_login = localStorage.getItem('last_login')
    if (last_login !== currentDate) {
      localStorage.setItem('last_login', currentDate)
      dispatch(toggleModal(false))
      setDisplayedMessage('')
    }
    if (userRole !== user?.role.join(', ')) localStorage.setItem('userRole', String(user?.role.join(', ')))
    dispatch(toggleModal(false))
    setTypingComplete(false)
  }
  const handleTypingComplete = () => {
    setTypingComplete(true)
    setShowFireworks(true)
    setTriggerConfetti(true); 
    setTimeout(() => setShowFireworks(false), 3000) // Fireworks animation lasts for 3 seconds
  }


  return soffBotText.not_using_platform == false ? (
    <Dialog
      // onClick={e => e.stopPropagation()}
      open={isModalOpen}
      onClose={handleClose}
      maxWidth={'md'}
      fullWidth
    >
      <DialogTitle sx={{ color: 'black', position: 'relative', paddingRight: '30px' }}>
        Hurmatli {user?.role.join(', ').includes('admin') && 'admin'} {user?.fullName}
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
      {soffBotText?.role === 'admin' ? (
        <AdminContent setTypingComplete={setTypingComplete} soffBotText={soffBotText} />
      ) : soffBotText?.role === 'ceo' ? (
        <CeoContent setTypingComplete={setTypingComplete} soffBotText={soffBotText} />
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
            borderRadius: '8px', // Match the border-radius in the CSS
            padding: '10px 20px', // Adjust padding to match the CSS
            backgroundColor: '#007BFF', // Blue button
            color: 'white',
            fontSize: '0.9rem', // Font size from CSS
            fontWeight: 'bold', // Font weight from CSS
            textDecoration: 'none', // Make sure the text decoration is removed
            transition: 'background-color 0.3s ease', // Transition effect from CSS
            '&:hover': {
              backgroundColor: '#0056b3' // Darker blue on hover
            },
            margin: '15px' // Top margin from CSS
          }}
        >
          Tushunarli
        </Button>
      )}
    </Dialog>
  ) : (
    <Dialog fullWidth maxWidth='xs' open={isModalOpen} onClose={handleClose}>
      <DialogContent>
        <div className='d-flex mb-4 justify-content-center align-items-center'>
          <img src='/images/avatars/happybot.png' width='100' height='100' />
        </div>

        <div style={{textAlign:'center'}}>
          <Typewriter
            onInit={typewriter => {
              const message =
                "Salom! Men sizning SoffCRM tizimidan foydalanishingizda sodiq yordamchingizman! 🚀 Sizga tizimning qulayliklari,yangi qo'shimchalar haqida muntazam xabar berib turaman. 📊 Bundan tashqari, har kuni tizimdan foydalanish bo'yicha statistik ma'lumotlarni ham taqdim etaman."
              typewriter
                .typeString(message)
                .callFunction(handleTypingComplete)
                .pauseFor(5000)
                .start()
            }}
            options={{
              loop: false,
              delay: 10,
              cursor: ''
            }}
          />
        </div>
      </DialogContent>
        {typingComplete && (
          <>
        <Button
          onClick={handleClose}
          variant='contained'
          sx={{
            m: 2,
            alignSelf: 'flex-end',
            borderRadius: '8px', // Match the border-radius in the CSS
            padding: '5px 10px', // Adjust padding to match the CSS
            backgroundColor: '#f0f0f0', // Light gray background
            color: 'blue',
            fontSize: '0.8rem', // Font size from CSS
            fontWeight: 'bold', // Font weight from CSS
            textDecoration: 'none', // Make sure the text decoration is removed
            transition: 'background-color 0.3s ease', // Transition effect from CSS
            '&:hover': {
              backgroundColor: '#e0e0e0' // Darker blue on hover
            },
            margin: '15px' // Top margin from CSS
          }}
        >
          Tushunarli
            </Button>
            </>
      )}
    </Dialog>
  )
}

export default StaticsModal
