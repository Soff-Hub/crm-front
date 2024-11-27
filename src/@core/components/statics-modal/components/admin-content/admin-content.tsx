import { DialogContent } from '@mui/material'
import Typewriter from 'typewriter-effect'

interface AdminContentProps {
  soffBotText: any
  setTypingComplete: (status: boolean) => void
}

export const AdminContent = ({ soffBotText, setTypingComplete }: AdminContentProps) => {
  return (
    <DialogContent sx={{ textAlign: 'justify', padding: '20px', fontFamily: 'Inter, sans-serif' }}>
      {soffBotText?.role && (
        <Typewriter
          onInit={typewriter => {
            const message = `
       <div style="font-family: 'Inter', sans-serif; color: #333; line-height: 1.6;">
<h3 style="color: #333; font-size: 20px; margin-top: 10px; margin-bottom: 20px;">📊Kechagi tizimda ishlash bo'yicha ko'rsatkichlaringiz statistikasi</h3>

<div class="space-y-2">
  <p style="font-size: 16px;">
    <strong style="color: #555;font-family: 'Inter', sans-serif;">💰 Kirimlar:</strong> <span style="color: #28a745;">${
      soffBotText.income && soffBotText.income.toLocaleString()
    } so'm</span>
  </p>
  
  <p style="font-size: 16px;">
    <strong style="color: #555;font-family: 'Inter', sans-serif;">👥 Kelmagan o'quvchilar soni:</strong> <span style="color: #dc3545;">${
      soffBotText.absent_students
    } ta</span>
  </p>
  
  <p style="font-size: 16px;">
    <strong style="color: #555;font-family: 'Inter', sans-serif;">✨ Yangi qo'shilgan lidlar:</strong> <span style="color: #17a2b8;">${
      soffBotText.new_leads
    } ta</span>
  </p>
  
  <p style="font-size: 16px;">
    <strong style="color: #555;font-family: 'Inter', sans-serif;">❌ Bog'lanilmagan lidlar:</strong> <span style="color: #ffc107;">${
      soffBotText.unconnected_leads
    } ta</span>
  </p>
  
  <p style="font-size: 16px;">
    <strong style="color: #555;font-family: 'Inter', sans-serif;">⚡️Faol lidlar:</strong> <span style="color: #0077FF;">${
      soffBotText.attending_the_class
    } ta</span>
  </p>
   <p style="font-size: 16px;">
    <strong style="color: #555;font-family: 'Inter', sans-serif;">🧑‍🎓Yangi kelgan o'quvchilar:</strong> <span style="color: #0077FF;">${
      soffBotText.added_students
    } ta</span>
  </p>
   <p style="font-size: 16px;">
    <strong style="color: #555;font-family: 'Inter', sans-serif;">🧑‍🎓Ketkan o'quvchilar:</strong> <span style="color: #0077FF;">${
      soffBotText.left_students
    } ta</span>
  </p>
  
  
  <div style="border: 1px solid #ccc; border-radius: 8px; padding: 15px; margin-top: 15px; background-color: #EAF6FF; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); font-family: 'Inter', sans-serif;">
    <h3 style="color: #6c757d; font-size: 1rem; margin-top: 5px; margin-bottom: 5px; font-weight: normal; opacity: 0.7;">
      Xulosa
    </h3>
    <span style="color: #333; font-size: 15px;">${soffBotText?.summary.replace(/\n/g, '<br />')}</span>   
  </div>

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
            delay: 10,
            cursor: '',
          }}
        />
      )}
    </DialogContent>
  )
}
