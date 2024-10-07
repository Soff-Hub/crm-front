import {
  Box,
  Button,
  Pagination,
  Typography
} from '@mui/material'
import React, { ReactNode, useContext, useEffect } from 'react'
import IconifyIcon from 'src/@core/components/icon'
import DataTable from 'src/@core/components/table'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'src/store'
import { fetchRoomList, setOpenCreateSms, updatePage } from 'src/store/apps/settings'
import CreateRoomDialog from 'src/views/apps/settings/rooms/CreateRoomDialog'
import EditRoomDialog from 'src/views/apps/settings/rooms/EditRoomDialog'
import RoomListRowOptions from 'src/views/apps/settings/rooms/RoomsRowOptions'
import VideoHeader, { videoUrls } from 'src/@core/components/video-header/video-header'
import { toast } from 'react-hot-toast'
import { AuthContext } from 'src/context/AuthContext'
import { useRouter } from 'next/router'

export interface customTableProps {
  xs: number
  title: string
  dataIndex?: string | ReactNode
  render?: (source: string) => any | undefined
}


export default function RoomsPage() {
  const { t } = useTranslation()
  const { rooms, is_pending, active_page, room_count } = useAppSelector(state => state.settings)
  const dispatch = useAppDispatch()

  const { push } = useRouter()
  const { user } = useContext(AuthContext)

  const handlePagination = async (page: number) => {
    await dispatch(fetchRoomList({ page }))
    dispatch(updatePage(page))
  }

  useEffect(() => {
    dispatch(fetchRoomList({ page: active_page }))
  }, [])

  useEffect(() => {
    if (!user?.role.includes('ceo') && !user?.role.includes('admin')) {
      push("/")
      toast.error("Sizda bu sahifaga kirish huquqi yo'q!")
    }
    return () => {
      dispatch(updatePage(1))
    }

  }, [])

  const columns: customTableProps[] = [
    {
      xs: 0.2,
      title: t('ID'),
      dataIndex: 'id'
    },
    {
      xs: 1.4,
      title: t('Nomi'),
      dataIndex: 'name'
    },
    {
      xs: 1.5,
      title: t('branch'),
      dataIndex: 'branch',
      render: (branch: any) => <span>{branch?.name}</span>
    },
    {
      xs: 0.38,
      title: t('Harakatlar'),
      dataIndex: 'id',
      render: id => <RoomListRowOptions id={+id} />
    }
  ]

  return (
    <div>
      <VideoHeader item={videoUrls.rooms} />

      <Box
        className='groups-page-header'
        sx={{ display: 'flex', justifyContent: 'space-between', margin: '10px 0' }}
        py={2}
      >
        <Typography variant='h5'>{t('Xonalar')}</Typography>
        <Button
          onClick={() => dispatch(setOpenCreateSms(true))}
          variant='contained'
          size='small'
          startIcon={<IconifyIcon icon='ic:baseline-plus' />}
        >
          {t("Yangi xona qo'shish")}
        </Button>
      </Box>
      <DataTable loading={is_pending} columns={columns} data={rooms} />
      {room_count > 1 && !is_pending && <Pagination page={active_page} count={room_count} variant="outlined" shape="rounded" onChange={(e: any, page) => handlePagination(page)} />}

      <CreateRoomDialog />

      <EditRoomDialog />
    </div>
  )
}
