import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import VideoHeader, { videoUrls } from 'src/@core/components/video-header/video-header'
import { customTableProps } from '../../groups'
import { useRouter } from 'next/router'
import getMonthName from 'src/@core/utils/gwt-month-name'
import { fetchAttendances } from 'src/store/apps/attandance'
import { useAppDispatch, useAppSelector } from 'src/store'
import useResponsive from 'src/@core/hooks/useResponsive'
import { AttandanceFilters } from 'src/views/apps/attandances/AttandanceFilters'
import AttandanceDataTable from 'src/@core/components/table/attandanceTable'
import IconifyIcon from 'src/@core/components/icon'
export default function Attandences() {
  const { t } = useTranslation()
  const { isMobile } = useResponsive()
  const [open, setOpen] = useState(false)
  const dispatch = useAppDispatch()
  const { attandance, isLoading, queryParams } = useAppSelector(state => state.attendance)
  const router = useRouter()
  const columns: customTableProps[] = [
    {
      xs: 0.3,
      title: t('ID'),
      dataIndex: 'index'
    },
    {
      xs: 1,
      title: t('Guruh nomi'),
      dataIndex: 'name',
      renderId: (id, name) => (
        <div onClick={() => router.push(`/groups/view/security?id=${id}&month=${getMonthName(null)}`)}>{name}</div>
      )
    },
    {
      xs: 1.4,
      title: t("O'qituvchi"),
      dataIndex: 'teacher',
      render: (teacher: any) => teacher?.first_name
    },
    {
      xs: 1,
      title: t('Guruh davomiyligi'),
      dataIndex: 'date'
    },
    {
      xs: 1,
      title: t(
        queryParams.is_available == 1
          ? "Kelgan o'quvchilar"
          : queryParams.is_available == 0
          ? "Davomat qilinmagan o'quvchilar"
          : "Kelmagan o'quvchilar"
      ),
      renderItem: (record: any) => (
        <div>
          <Chip
            sx={{
              background:
                queryParams.is_available == 1
                  ? 'lightgreen'
                  : queryParams.is_available == 0
                  ? ''
                  : queryParams.is_available == -1
                  ? 'lightcoral'
                  : ''
            }}
            variant='filled'
            size='medium'
            label={` ${record?.attendances}/${record?.allowed_attendances} `}
          />
        </div>
      )
    }
  ]
  const rowClick = (id: any) => {
    router.push(`/groups/view/security?id=${id}&month=${getMonthName(null)}`)
  }
  useEffect(() => {
    const queryString = new URLSearchParams({ ...queryParams }).toString()
    dispatch(fetchAttendances(queryString))
  }, [])

  return (
    <div>
      <VideoHeader item={videoUrls.groups} />
      <Box
        className='groups-page-header'
        py={2}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px',mb:3 }}>
          <Typography variant='h5'>{t('Davomatlar')}</Typography>
        </Box>
        {isMobile && (
          <>
            <Button
              size='small'
              sx={{ marginLeft: 'auto', width: '100%', marginBottom: 2 }}
              variant='outlined'
              onClick={() => setOpen(true)}
            >
              {t('Filterlash')}
            </Button>
          </>
        )}
      </Box>
      {!isMobile && <AttandanceFilters isMobile={isMobile} />}
      <AttandanceDataTable columns={columns} loading={isLoading} data={attandance || []} color text_color />
      <Dialog fullScreen onClose={() => setOpen(false)} aria-labelledby='full-screen-dialog-title' open={open}>
        <DialogTitle id='full-screen-dialog-title'>
          <Typography variant='h6' component='span'>
            {t('Modal title')}
          </Typography>
          <IconButton
            aria-label='close'
            onClick={() => setOpen(false)}
            sx={{ top: 8, right: 10, position: 'absolute', color: 'grey.500' }}
          >
            <IconifyIcon icon='mdi:close' />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <AttandanceFilters isMobile={isMobile} />
        </DialogContent>
        <DialogActions className='dialog-actions-dense'>
          <Button onClick={() => setOpen(false)}>{t('Davom etish')}</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
