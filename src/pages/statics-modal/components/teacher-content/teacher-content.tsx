import { DialogContent } from "@mui/material"
import Typewriter from 'typewriter-effect'


interface TeacherContentProps{
    soffBotText: any,
    setTypingComplete:(status:boolean)=>void
    
}

export const TeacherContent = ({soffBotText,setTypingComplete}:TeacherContentProps) => {
    return (
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
              delay: 20
            }}
          />
        )}
      </DialogContent>
    )
}