import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'src/store'
import { fetBotOwners, setBotData, setOpenCreate } from 'src/store/apps/logs'
import SubLoader from 'src/views/apps/loaders/SubLoader'
import DataTable from 'src/@core/components/table'
import IconifyIcon from 'src/@core/components/icon'
import CreateBotNotificationModal from 'src/@core/components/logs/create-bot-notification-modal'
import { Alert, AlertTitle, Button } from '@mui/material'
import Link from 'next/link'
import DeleteBotNotificationModal from 'src/@core/components/logs/delete-bot-notification-modal'
import i18n from 'src/configs/i18n'

export default function BotNotification() {
  const [page, setPage] = useState(1)

  const dispatch = useAppDispatch()
  const { t } = useTranslation()

  const { isLoading, botNotifications } = useAppSelector(state => state.logs)

  const columns: any[] = [
    {
      xs: 0.2,
      title: t('ID'),
      dataIndex: 'index'
    },
    {
      xs: 1.7,
      title: t('Xodim'),
      dataIndex: 'full_name'
    },
    {
      xs: 1.7,
      title: t('Mahsus ID'),
      dataIndex: 'chat_id'
    },
    {
      xs: 1.7,
      title: t('Filiallar'),
      dataIndex: 'branches_data',
      render(source: any) {
        return `${source.map((el: any) => `${el.name} `).join(', ')}`
      }
    },
    {
      xs: 1.7,
      title: t('Amallar'),
      dataIndex: 'id',
      render: (id:any) => (
        <div style={{ color: 'red' }} onClick={() => dispatch(setBotData(id))}>
          <IconifyIcon icon={'fluent:delete-20-regular'} />
        </div>
      )
    }
  ]

  useEffect(() => {
    dispatch(fetBotOwners())
  }, [])

  let alerts: any = {
    uz: (
      <Alert severity='info'>
        <AlertTitle>{t('Eslatma')}</AlertTitle>
        Bu ro'yxatga qo'shilgan xodimlar{' '}
        <Link
          href={'https://t.me/soffcrm_support_bot'}
          target='_blank'
          style={{ color: 'blue', textDecoration: 'none' }}
        >
          @soffcrm_support_bot
        </Link>{' '}
        da tizimdagi xarakatlar haqida bildirishnoma olishadi
      </Alert>
    ),
    en: (
      <Alert severity='info'>
        <AlertTitle>{t('Eslatma')}</AlertTitle>
        Employees added to this list will receive notification of system activity at{' '}
        <Link
          href={'https://t.me/soffcrm_support_bot'}
          target='_blank'
          style={{ color: 'blue', textDecoration: 'none' }}
        >
          @soffcrm_support_bot
        </Link>{' '}
      </Alert>
    ),
    ru: (
      <Alert severity='info'>
        <AlertTitle>{t('Eslatma')}</AlertTitle>
        Сотрудники, добавленные в этот список, получат уведомление об активности системы на{' '}
        <Link
          href={'https://t.me/soffcrm_support_bot'}
          target='_blank'
          style={{ color: 'blue', textDecoration: 'none' }}
        >
          @soffcrm_support_bot
        </Link>{' '}
      </Alert>
    )
  }

  return (
    <div>
      <div className='d-flex align-items-start justify-content-between'>
        {alerts[`${i18n.language}`]}
        <Button variant='contained' size='small' onClick={() => dispatch(setOpenCreate(true))}>
          {t('Yaratish')}
        </Button>
      </div>
      {isLoading ? (
        <SubLoader />
      ) : (
        <DataTable loading={isLoading} minWidth='600px' columns={columns} data={botNotifications} />
      )}

      <CreateBotNotificationModal />
      <DeleteBotNotificationModal />
    </div>
  )
}
