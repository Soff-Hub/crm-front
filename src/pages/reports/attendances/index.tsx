import { Box, Chip, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import VideoHeader, { videoUrls } from 'src/@core/components/video-header/video-header'
import api from 'src/@core/utils/api'
import { customTableProps } from '../../groups'
import RowOptions from 'src/views/apps/groups/RowOptions'
import { useRouter } from 'next/router'
import getMonthName from 'src/@core/utils/gwt-month-name'
import DataTable from 'src/@core/components/table'
import { fetchAttendances, updateQueryParam } from 'src/store/apps/attandance'
import { useAppDispatch, useAppSelector } from 'src/store'
import useResponsive from 'src/@core/hooks/useResponsive'
import { AttandanceFilters } from 'src/views/apps/attandances/AttandanceFilters'
export default function Attandences() {
  const { t } = useTranslation()
  const { isMobile } = useResponsive()
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
      dataIndex: 'name'
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
      title: t('Qilingan davomadlar'),
      renderItem: (record: any) => (
        <div>
          <Chip
            variant='outlined'
            size='medium'
            color='success'
            label={`${record?.attended_attendances} / ${record?.allowed_attendances}`}
          />
        </div>
      )
    },
    {
      xs: 1,
      title: t('Qilinmagan davomatlar soni'),
      dataIndex: 'not_attended_attendances',
      render: recors => (Number(recors) > 0 ? <Chip size='medium' color='error' label={`${recors}`} /> : recors)
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
        sx={{ display: 'flex', justifyContent: 'space-between', margin: '10px 0' }}
        py={2}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Typography variant='h5'>{t('Davomatlar')}</Typography>
        </Box>
      </Box>
      {!isMobile && <AttandanceFilters isMobile={isMobile} />}
      <DataTable columns={columns} loading={isLoading} data={attandance || []} rowClick={rowClick} color text_color />
    </div>
  )
}
