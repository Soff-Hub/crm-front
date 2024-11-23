import { DialogContent } from "@mui/material"
import Typewriter from 'typewriter-effect'


interface CeoContentProps{
    soffBotText: any,
    setTypingComplete:(status:boolean)=>void
    
}

export const CeoContent = ({soffBotText,setTypingComplete}:CeoContentProps) => {
    return (
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
    )
}