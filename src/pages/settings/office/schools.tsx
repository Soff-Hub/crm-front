import { Box, Button, Pagination, Typography } from '@mui/material'
import { ReactNode, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import IconifyIcon from 'src/@core/components/icon'
import DataTable from 'src/@core/components/table'
import VideoHeader, { videoUrls } from 'src/@core/components/video-header/video-header'
import { useAppDispatch, useAppSelector } from 'src/store'
import { fetchSchoolList } from 'src/store/apps/settings'
import RoomListRowOptions from 'src/views/apps/settings/rooms/RoomsRowOptions'
import CreateSchoolDialog from 'src/views/apps/settings/schools/CreateSchoolDialog'
import EditSchoolDialog from 'src/views/apps/settings/schools/EditSchoolDialog'
import SchoolsRowOptions from 'src/views/apps/settings/schools/SchoolsRowOption'

export interface customTableProps {
  xs: number
  title: string
  dataIndex?: string | ReactNode
  render?: (value: any, record?: any, index?: number) => React.ReactNode
}

export default function SchoolsPage() {
  const { school_count, schools, isGettingSchools, schoolQueryParams } = useAppSelector(state => state.settings)
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const [openSchoolModal, setOpenSchoolModal] = useState(false)
  const handlePagination = async (page: number) => {
    await dispatch(fetchSchoolList({ page }))
  }

  const columns: customTableProps[] = [
    {
      xs: 0.2,
      title: t('ID'),
      dataIndex: 'index'
    },
    {
      xs: 1.4,
      title: t('Nomi'),
      dataIndex: 'name'
    },
    {
      xs: 0.38,
      title: t('Harakatlar'),
      dataIndex: 'id',
      render: id => <SchoolsRowOptions id={id} />
    }
  ]
  useEffect(() => {
    dispatch(fetchSchoolList({ page: schoolQueryParams.page }))
  }, [])

  return (
    <div>
      <VideoHeader item={videoUrls.rooms} />

      <Box
        className='schools-page-header'
        sx={{ display: 'flex', justifyContent: 'space-between', margin: '10px 0' }}
        py={2}
      >
        <Typography variant='h5'>{t('Maktablar')}</Typography>
        <Button
          onClick={() => setOpenSchoolModal(true)}
          variant='contained'
          size='small'
          startIcon={<IconifyIcon icon='ic:baseline-plus' />}
        >
          {t("Yangi maktab qo'shish")}
        </Button>
      </Box>
      <DataTable loading={isGettingSchools} columns={columns} data={schools} />
      {school_count > 1 && !isGettingSchools && (
        <Pagination
          page={schoolQueryParams.page}
          count={school_count}
          variant='outlined'
          shape='rounded'
          onChange={(e: any, page) => handlePagination(page)}
        />
      )}
      <CreateSchoolDialog openModal={openSchoolModal} setOpenModal={setOpenSchoolModal} />
      <EditSchoolDialog />
    </div>
  )
}
