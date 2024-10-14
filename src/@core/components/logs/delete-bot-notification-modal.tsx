import React from 'react'
import { Alert, AlertTitle, Button, Dialog, DialogContent } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'src/store'
import { deleteBotOwner, fetBotOwners, setBotData } from 'src/store/apps/logs'
import toast from 'react-hot-toast'

export default function DeleteBotNotificationModal() {
  const { t } = useTranslation()

  const dispatch = useAppDispatch()
  const { queryParams, botData } = useAppSelector(state => state.logs)

  const handleClose = () => {
    dispatch(setBotData(null))
  }

  const onSubmit = async () => {
    await dispatch(deleteBotOwner(botData))
    await dispatch(fetBotOwners(new URLSearchParams({ page: queryParams.page.toString() }).toString()))
    dispatch(setBotData(null))
    toast.success(`Muvaffaqiyatli o'chirib tashlandi`)
    handleClose()
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
            <Alert severity='warning' className='mb-3'>
              <AlertTitle>Elatma</AlertTitle>
              Xodimga yuboriladigan <br /> bildirishnomalarni to'xtatmoqchimisiz?
            </Alert>

            <div className='d-flex gap-2'>
              <Button type='button' variant='outlined' fullWidth onClick={() => dispatch(setBotData(null))}>
                {t('Bekor qilish')}
              </Button>
              <Button type='submit' variant='contained' fullWidth>
                {t("O'chirish")}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
