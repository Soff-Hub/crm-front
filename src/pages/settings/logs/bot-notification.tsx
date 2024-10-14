import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'src/store'
import { fetBotOwners, setOpenCreate } from 'src/store/apps/logs'
import SubLoader from 'src/views/apps/loaders/SubLoader'
import { customTableProps } from '../sms'
import DataTable from 'src/@core/components/table'
import IconifyIcon from 'src/@core/components/icon'
import CreateBotNotificationModal from 'src/@core/components/logs/create-bot-notification-modal'
import { Alert, AlertTitle, Button } from '@mui/material'
import Link from 'next/link'

export default function BotNotification() {
  const [page, setPage] = useState(1)

  const dispatch = useAppDispatch()
  const { t } = useTranslation()

  const { isLoading, botNotifications } = useAppSelector(state => state.logs)

  const columns: customTableProps[] = [
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
      render: id => (
        <div style={{ color: 'red' }}>
          <IconifyIcon icon={'fluent:delete-20-regular'} />
        </div>
      )
    }
  ]

  useEffect(() => {
    dispatch(fetBotOwners(`page=${page}`))
  }, [page])

  return (
    <div>
      <div className='d-flex align-items-start justify-content-between'>
        <Alert severity='info'>
          <AlertTitle>Elatma</AlertTitle>
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
    </div>
  )
}
