import { Box, Button, Card, CardActions, CardContent, Skeleton, Tooltip, Typography } from '@mui/material'
import Link from 'next/link'
import { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AuthContext } from 'src/context/AuthContext'
import { useAppDispatch, useAppSelector } from 'src/store'
import CustomChip from 'src/@core/components/mui/chip'
import { ThemeColor } from 'src/@core/layouts/types'
import getLessonDays from 'src/@core/utils/getLessonDays'
import { addPeriodToThousands } from 'src/pages/settings/office/courses'
import IconifyIcon from 'src/@core/components/icon'
import { getSMSTemp, handleEditClickOpen, setMeetLink, setOnlineLessonLoading } from 'src/store/apps/groupDetails'
import EditGroupModal from '../../EditGroupModal'
import { getDashboardLessons, getGroupsDetails, getMetaData, handleOpenEdit } from 'src/store/apps/groups'
import api from 'src/@core/utils/api'
import { LoadingButton } from '@mui/lab'
import { Router, useRouter } from 'next/router'
import toast from 'react-hot-toast'

interface ColorsType {
  [key: string]: ThemeColor
}

const roleColors: ColorsType = {
  ceo: 'error',
  admin: 'info',
  teacher: 'warning',
  director: 'success'
}

export default function GroupDetails() {
  const { groupData, isGettingGroupDetails ,onlineLessonLoading} = useAppSelector(state => state.groupDetails)
  const dispatch = useAppDispatch()
  const [url, setUrl] = useState('')
  const { user } = useContext(AuthContext)
  const { t } = useTranslation();
  const router = useRouter()
  const { id,month } = router.query


  const handleOpenSendSMSModal = async () => {
    dispatch(handleEditClickOpen('send-sms'))
    await dispatch(getSMSTemp())
  }

  console.log(id,month);
  

  const handleEdit = async (id: any) => {
    dispatch(handleOpenEdit(true))
    const filtered = { ...groupData }
    const queryString = new URLSearchParams({
      day_of_week: filtered?.day_of_week?.toString(),
      teacher: String(filtered?.teacher_data?.id),
      room: String(filtered?.room_data?.id)
    }).toString()
    await Promise.all([dispatch(getDashboardLessons(queryString)), dispatch(getGroupsDetails(id))])
  }

  async function handleGetMeetLink() {
      dispatch(setOnlineLessonLoading(true))
      await api.get(`meets/google/login/?id=${id}&month=${month}`).then(res => {
        if (res.data.url) {
          window.location.assign(res.data.url)
          // dispatch(setMeetLink(res.data.url))
        }
      }).catch((err) => {
        console.log(err);
        toast.error(err.response.data.msg)
        
      })
      dispatch(setOnlineLessonLoading(false))
  }

  return (
    <Card sx={{ position: 'relative' }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {isGettingGroupDetails ? (
          <Skeleton variant='rounded' height={20} animation='wave' sx={{ my: '5px' }} />
        ) : (
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <Typography>{t('Guruh')}:</Typography>
            <Typography sx={{ fontWeight: 600, fontSize: '18px' }}>{groupData?.name}</Typography>
          </Box>
        )}
        {isGettingGroupDetails ? (
          <Skeleton variant='rounded' height={20} animation='wave' sx={{ my: '5px' }} />
        ) : (
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <Typography>{t("O'quvchilar soni")}:</Typography>
            <Typography>{groupData?.student_count} ta</Typography>
          </Box>
        )}
        {isGettingGroupDetails ? (
          <Skeleton variant='rounded' height={20} animation='wave' sx={{ my: '5px' }} />
        ) : (
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <Typography>{t('Kurs')}:</Typography>
            {!(user?.role.length === 1 && user?.role.includes('teacher')) ? (
              <Link href={`/settings/office/courses/`}>
                <CustomChip
                  skin='light'
                  size='small'
                  label={groupData?.course_data?.name}
                  color={roleColors['director']}
                  sx={{
                    height: 20,
                    fontWeight: 600,
                    borderRadius: '5px',
                    fontSize: '0.875rem',
                    textTransform: 'capitalize',
                    '& .MuiChip-label': { mt: -0.25 },
                    cursor: 'pointer'
                  }}
                />
              </Link>
            ) : (
              <CustomChip
                skin='light'
                size='small'
                label={groupData?.course_data.name}
                color={roleColors['director']}
                sx={{
                  height: 20,
                  fontWeight: 600,
                  borderRadius: '5px',
                  fontSize: '0.875rem',
                  textTransform: 'capitalize',
                  '& .MuiChip-label': { mt: -0.25 },
                  cursor: 'pointer'
                }}
              />
            )}
          </Box>
        )}
        {isGettingGroupDetails ? (
          <Skeleton variant='rounded' height={20} animation='wave' sx={{ my: '5px' }} />
        ) : (
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <Typography>{t('Dars vaqti')}:</Typography>
            {groupData && (
              <Typography>
                {t(getLessonDays(groupData?.day_of_week || ''))} {groupData?.start_at}
              </Typography>
            )}
          </Box>
        )}
        {isGettingGroupDetails ? (
          <Skeleton variant='rounded' height={20} animation='wave' sx={{ my: '5px' }} />
        ) : (
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <Typography>{t('Dars xonasi')}:</Typography>
            <Typography>{groupData?.room_data?.name}</Typography>
          </Box>
        )}
        {isGettingGroupDetails ? (
          <Skeleton variant='rounded' height={20} animation='wave' sx={{ my: '5px' }} />
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {!(user?.role.length === 1 && user?.role.includes('teacher')) ? (
              <Box sx={{ display: 'flex' }}>
                <Typography sx={{ mr: 2 }}>{t("O'qituvchi")}:</Typography>
                <Link href={`/mentors/view/security/?id=${groupData?.teacher_data?.id}`}>
                  <Typography>{groupData?.teacher_data?.first_name}</Typography>
                </Link>
              </Box>
            ) : (
              ''
            )}
            <Box sx={{ display: 'flex', gap: '5px' }}>
              <Typography sx={{ mr: 2 }}>{t('Kurs davomiyligi (oy)')}:</Typography>
              <Typography>{groupData?.start_date?.split('-').reverse().join('.')}</Typography> -
              <Typography>{groupData?.end_date?.split('-').reverse().join('.')}</Typography>
            </Box>
          </Box>
        )}
        {isGettingGroupDetails ? (
          <Skeleton variant='rounded' height={20} animation='wave' sx={{ my: '5px' }} />
        ) : (
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <Typography>{t('branch')}:</Typography>
            <CustomChip
              skin='light'
              size='small'
              label={groupData?.branch_data?.name}
              color={roleColors['director']}
              sx={{
                height: 20,
                fontWeight: 600,
                borderRadius: '5px',
                fontSize: '0.875rem',
                textTransform: 'capitalize',
                '& .MuiChip-label': { mt: -0.25 }
              }}
            />
          </Box>
        )}
        {isGettingGroupDetails ? (
          <Skeleton variant='rounded' height={20} animation='wave' sx={{ my: '5px' }} />
        ) : (
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <Typography>{t('Kurs narxi')}:</Typography>
            <CustomChip
              skin='light'
              size='small'
              label={addPeriodToThousands(+groupData?.monthly_amount) + " so'm"}
              color={'secondary'}
              sx={{
                height: 20,
                fontWeight: 600,
                borderRadius: '5px',
                fontSize: '0.875rem',
                textTransform: 'capitalize',
                '& .MuiChip-label': { mt: -0.25 }
              }}
            />
          </Box>
        )}
      </CardContent>
      {!(user?.role.length === 1 && user?.role.includes('teacher')) ? (
        <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
          {isGettingGroupDetails ? (
            <Skeleton variant='rounded' animation='wave' width={70} height={40} />
          ) : (
            <Tooltip title={t('Tahrirlash')} placement='top'>
              <Button
                variant='outlined'
                color='warning'
                onClick={async () => (
                  dispatch(handleOpenEdit(true)), handleEdit(groupData?.id), await dispatch(getMetaData())
                )}
              >
                <IconifyIcon icon='iconamoon:edit-light' />
              </Button>
            </Tooltip>
          )}
          {isGettingGroupDetails ? (
            <Skeleton variant='rounded' animation='wave' width={70} height={40} />
          ) : (
            <Tooltip title={t("O'chirish")} placement='top'>
              <Button variant='outlined' color='error' onClick={() => dispatch(handleEditClickOpen('delete'))}>
                <IconifyIcon icon='mdi-light:delete' />
              </Button>
            </Tooltip>
          )}
          {isGettingGroupDetails ? (
            <Skeleton variant='rounded' animation='wave' width={70} height={40} />
          ) : (
            <Tooltip title={t('SMS yuborish')} placement='top'>
              <Button variant='outlined' color='warning' onClick={handleOpenSendSMSModal}>
                <IconifyIcon icon='material-symbols-light:sms-outline' />
              </Button>
            </Tooltip>
          )}
          {isGettingGroupDetails ? (
            <Skeleton variant='rounded' animation='wave' width={70} height={40} />
          ) : (
            <Tooltip title={t("O'quvchi qo'shish")} placement='top'>
              <Button variant='outlined' onClick={() => dispatch(handleEditClickOpen('add-student'))}>
                <IconifyIcon icon='mdi:user-add-outline' />
              </Button>
            </Tooltip>
          )}
          {isGettingGroupDetails ? (
            <Skeleton variant='rounded' animation='wave' width={70} height={40} />
          ) : (
            <Tooltip title={t('Online dars')} placement='top'>
                <LoadingButton
                  loading={onlineLessonLoading}
                color='success'
                variant='outlined'
                onClick={() => {
                  handleGetMeetLink()
                }}
              >
                <IconifyIcon icon='mdi:laptop' />
              </LoadingButton>
            </Tooltip>
          )}
        </CardActions>
      ) : (
        ''
      )}

      <EditGroupModal />
    </Card>
  )
}
