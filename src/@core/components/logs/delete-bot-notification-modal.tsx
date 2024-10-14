import React from 'react'
import { Alert, AlertTitle, Button, Dialog, DialogContent } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'src/store'
import { deleteBotOwner, fetBotOwners, setBotData } from 'src/store/apps/logs'
import toast from 'react-hot-toast'
import i18n from 'src/configs/i18n'

export default function DeleteBotNotificationModal() {
  const { t } = useTranslation()

  const dispatch = useAppDispatch()
  const { botData } = useAppSelector(state => state.logs)

  const handleClose = () => {
    dispatch(setBotData(null))
  }

  const onSubmit = async () => {
    await dispatch(deleteBotOwner(botData))
    await dispatch(fetBotOwners())
    dispatch(setBotData(null))
    toast.success(`${t("Muvaffaqiyatli o'chirib tashlandi")}`)
    handleClose()
  }

  let alerts: any = {
    uz: (
      <Alert severity='warning' className='mb-3'>
        <AlertTitle>{t('Eslatma')}</AlertTitle>
        Xodimga yuboriladigan <br /> bildirishnomalarni to'xtatmoqchimisiz?
      </Alert>
    ),
    en: (
      <Alert severity='warning' className='mb-3'>
        <AlertTitle>{t('Eslatma')}</AlertTitle>
        Do you want to stop notifications <br /> sent to an employee?
      </Alert>
    ),
    ru: (
      <Alert severity='warning' className='mb-3'>
        <AlertTitle>{t('Eslatma')}</AlertTitle>
        Вы хотите прекратить отправку <br /> уведомлений сотруднику?
      </Alert>
    )
  }

  return (
    <Dialog open={!!botData} onClose={handleClose}>
      <DialogContent>
        <div style={{ minWidth: '300px' }}>
          <form
            onSubmit={e => {
              e.preventDefault()
              onSubmit()
            }}
          >
            {alerts[i18n.language]}

            <div className='d-flex gap-2'>
              <Button type='button' variant='outlined' fullWidth onClick={() => dispatch(setBotData(null))}>
                {t('Bekor qilish')}
              </Button>
              <Button type='submit' variant='contained' color='error' fullWidth>
                {t("O'chirish")}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
