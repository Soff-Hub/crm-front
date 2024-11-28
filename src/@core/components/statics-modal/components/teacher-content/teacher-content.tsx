import { DialogContent } from '@mui/material'
import getMonthName from 'src/@core/utils/gwt-month-name'
import Typewriter from 'typewriter-effect'

interface TeacherContentProps {
  soffBotText: any
  setTypingComplete: (status: boolean) => void
}

export const TeacherContent = ({ soffBotText, setTypingComplete }: TeacherContentProps) => {
  return (
    <DialogContent sx={{ textAlign: 'justify', padding: '20px' }}>
      {soffBotText?.role && (
        <Typewriter
          onInit={typewriter => {
            const teacherSubtitle = '<h3 style="color: #333; font-size: 20px; margin-top: 10px; margin-bottom: 10px;"></DialogContent>📊 Sizning ohirgi ish kuningizdagi natijangiz</h3>'
            const goodWorkText = soffBotText.missed_attendance === 0 ? `${teacherSubtitle}<br/> Barakalla siz zo'r ishladizngiz🥳` : ''

            const missedStudentsText =
              Array.isArray(soffBotText?.groups) && soffBotText.groups.length > 0
                ? soffBotText.groups
                    .map(
                      (group: { group: string; count: number; group_id: number }) =>
                        `- <a href="/groups/view/security/?id=${group.group_id}&month=${getMonthName(null)}" style="color: #0077FF; text-decoration: none;">${group.group}</a>: ${group.count} ta o'quvchi`
                    )
                    .join('<br>')
                : "Hozircha hech qanday guruh ma'lumotlari mavjud emas."

            const message =
              soffBotText.missed_attendance === 0
                ? goodWorkText +  `${
                  soffBotText?.summary
                    ? ` <div style="border: 1px solid #ccc; border-radius: 8px; padding: 15px; margin-top: 15px; background-color: #EAF6FF; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); font-family: 'Inter', sans-serif;">
  <h3 style="color: #6c757d; font-size: 1rem; margin-top: 5px; margin-bottom: 5px; font-weight: normal; opacity: 0.7;">
    Xulosa
  </h3>
  <span style="color: #333; font-size: 15px;">${soffBotText?.summary.replace(/\n/g, '<br />')}</span>   
</div>`
                    : ''
                }`
                : `${teacherSubtitle} <br/> Siz kecha ${
                    soffBotText?.missed_attendance || 0
                  } ta talabaning yo'qlamasini o'tkazb yubordingiz:<br>${missedStudentsText} \n` +
                  `${
                    soffBotText?.summary
                      ? ` <div style="border: 1px solid #ccc; border-radius: 8px; padding: 15px; margin-top: 15px; background-color: #EAF6FF; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); font-family: 'Inter', sans-serif;">
    <h3 style="color: #6c757d; font-size: 1rem; margin-top: 5px; margin-bottom: 5px; font-weight: normal; opacity: 0.7;">
      Xulosa
    </h3>
    <span style="color: #333; font-size: 15px;">${soffBotText?.summary.replace(/\n/g, '<br />')}</span>   
  </div>`
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
            delay: 10,
            cursor: '',
          }}
        />
      )}
    </DialogContent>
  )
}
