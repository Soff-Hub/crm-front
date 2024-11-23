import { useState, useContext } from 'react'
import { Dialog, DialogTitle, DialogContent, Button } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { toggleModal } from 'src/store/apps/page'
import Typewriter from 'typewriter-effect'
import { AuthContext } from 'src/context/AuthContext'
import useRoles from 'src/hooks/useRoles'

const StaticsModal = () => {
  const [displayedMessage, setDisplayedMessage] = useState('')
  const [typingComplete, setTypingComplete] = useState(false) // State for when Typewriter finishes

  const dispatch = useDispatch()
  const { user } = useContext(AuthContext)
  const currentDate = new Date().toISOString()
  const isModalOpen = useSelector((state: any) => state.page.isModalOpen)
  const soffBotText = useSelector((state: any) => state.page.soffBotText)
  const soffBotStatus = useSelector((state: any) => state.page.soffBotStatus)

  const handleClose = () => {
    const last_login = localStorage.getItem('last_login')
    if (last_login !== currentDate) {
      localStorage.setItem('last_login', currentDate)
      dispatch(toggleModal(false))
      setDisplayedMessage('')
    }
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
        <DialogContent sx={{ textAlign: 'justify', padding: '20px' }}>
          {soffBotText?.role && (
            <Typewriter
              onInit={typewriter => {
                const message = `
         <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
  <h3 style="color: #333; font-size: 20px; margin-top: 10px; margin-bottom: 20px;">📊 O'quv markazingizning kechagi statistikasi</h3>
  

  <div class="space-y-2">
    <p style="font-size: 16px;">
      <strong style="color: #555;">💰 Kirimlar:</strong> <span style="color: #28a745;">${
        soffBotText.income && soffBotText.income.toLocaleString()
      } so'm</span>
    </p>
    
    <p style="font-size: 16px;">
      <strong style="color: #555;">👥 Kelmagan o'quvchilar soni:</strong> <span style="color: #dc3545;">${
        soffBotText.absent_students
      } ta</span>
    </p>
    
    <p style="font-size: 16px;">
      <strong style="color: #555;">✨ Yangi qo'shilgan lidlar:</strong> <span style="color: #17a2b8;">${
        soffBotText.new_leads
      } ta</span>
    </p>
    
    <p style="font-size: 16px;">
      <strong style="color: #555;">❌ Bog'lanilmagan lidlar:</strong> <span style="color: #ffc107;">${
        soffBotText.unconnected_leads
      } ta</span>
    </p>
    
    <p style="font-size: 16px;">
      <strong style="color: #555;">⚡️Faol lidlar:</strong> <span style="color: #0077FF;">${
        soffBotText.attending_the_class
      } ta</span>
    </p>
      <h3 style="color: #333; font-size: 18px; margin-top: 10px; margin-bottom: 20px;">Xulosa : <br/>
      <span style="color:gray; font-size:15px;">${soffBotText?.summary}</span>
      </h3>


  </div>
</div>

            `

                typewriter
                  .typeString(message)
                  .callFunction(() => setTypingComplete(true))
                  .pauseFor(5000)
                  .start()
              }}
              options={{
                loop: false,
                delay: 20
              }}
            />
          )}
        </DialogContent>
      ) : (
        <DialogContent sx={{ textAlign: 'justify', padding: '20px' }}>
          {soffBotText?.role && (
            <Typewriter
              onInit={typewriter => {
                const goodWorkText = soffBotText.missed_attendance === 0 ? 'Barakalla siz zor ishladizngiz🥳' : ''

                const missedStudentsText =
                  Array.isArray(soffBotText?.groups) && soffBotText.groups.length > 0
                    ? soffBotText.groups
                        .map(
                          (group: { group: string; count: number; group_id: number }) =>
                            `- <a href="/groups/view/security/?id=${group.group_id}" style="color: #0077FF; text-decoration: none;">${group.group}</a>: ${group.count} ta o'quvchi`
                        )
                        .join('<br>')
                    : "Hozircha hech qanday guruh ma'lumotlari mavjud emas."

                const message =
                  soffBotText.missed_attendance === 0
                    ? goodWorkText
                    : `Siz kecha ${
                        soffBotText?.missed_attendance || 0
                      } ta talabaning yo'qlamasini o'tkazb yubordingiz:<br>${missedStudentsText} \n` +
                      `${
                        soffBotText?.summary
                          ? `<h3 style='color: #333; font-size: 18px; margin-top: 10px; margin-bottom: 20px;'>
                            Xulosa : <br />
                            <span style='color:gray; font-size:15px;'>${soffBotText?.summary}</span>
                          </h3>`
                          : ''
                      }`

                typewriter
                  .typeString(message)
                  .callFunction(() => setTypingComplete(true))
                  .pauseFor(5000)
                  .start()
              }}
              options={{
                loop: false,
                delay: 40
              }}
            />
          )}
        </DialogContent>
      )}

      {typingComplete && ( // Show the button only after typing completes
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
