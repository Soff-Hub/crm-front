import { useContext, useEffect, useState } from 'react'
import { Box, Card, CardContent, Skeleton, Typography } from '@mui/material'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { getInitials } from 'src/@core/utils/get-initials'
import { addPeriodToThousands } from '../settings/office/courses'
import IconifyIcon from 'src/@core/components/icon'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import getLessonDays from 'src/@core/utils/getLessonDays'
import useResponsive from 'src/@core/hooks/useResponsive'
import api from 'src/@core/utils/api'
import { datatimeFormatCustome } from 'src/@core/utils/time-formatter'
import { AuthContext } from 'src/context/AuthContext'
import EmptyContent from 'src/@core/components/empty-content'
import { useRouter } from 'next/router'
import { toast } from 'react-hot-toast'
import UserIcon from 'src/layouts/components/UserIcon'
import StudentEditProfileModal from './studentEditModal'

export default function StudentProfile() {
  const { t } = useTranslation()
  const { isMobile } = useResponsive()
    const [groups, setGroups] = useState<any[]>([])
    const [isModalOpen,setIsModalOpen] = useState(false)
  const [sms, setSms] = useState<any[]>([])
  const { user } = useContext(AuthContext)
  const { push } = useRouter()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const getGroups = async () => {
    setIsLoading(true)
    const resp = await api.get(`common/student/groups/`)
    setGroups(resp.data)
    setIsLoading(false)
  }

  const getSmsHistory = async () => {
    const resp = await api.get(`common/student/sms/`)
    setSms(resp.data)
  }

  useEffect(() => {
    if (!user?.role.includes('student')) {
      push('/')
      toast.error("Sizda bu sahifaga kirish huquqi yo'q!")
    }
    Promise.all([getGroups(), getSmsHistory()])
  }, [])

  return (
    <div>
      <Card sx={{ display: 'flex', justifyContent:"space-between" }}>
        <div>
          <CardContent sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', gap: 3 }}>
              <CustomAvatar
                skin='light'
                variant='rounded'
                color={'primary'}
                sx={{ width: 70, height: 70, fontWeight: 600, mb: 1, fontSize: '2rem' }}
              >
                {getInitials(user?.fullName || `Talaba ${user?.id}`)}
              </CustomAvatar>
              <Box>
                <Typography variant='h6'>{user?.fullName || `Talaba ${user?.id}`}</Typography>
                <Typography fontSize={12}>{`( ID:${user?.id} )`}</Typography>
              </Box>
            </Box>
          </CardContent>
          <CardContent>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Typography fontSize={13} variant='body2'>
                {t('phone')}:{' '}
              </Typography>
              <Typography fontSize={13}>{user?.username}</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Typography fontSize={13} variant='body2'>
                {t('Balans')}:{' '}
              </Typography>
              <Typography fontSize={13}>{addPeriodToThousands(user?.balance) + " so'm"}</Typography>
            </Box>
          </CardContent>
        </div>
        <CardContent sx={{cursor:"pointer"}}>
          <UserIcon  onClick={()=>setIsModalOpen(true)} icon='lucide:edit' />
        </CardContent>
      </Card>
      <Box sx={{ display: 'flex', gap: '15px', flexDirection: isMobile ? 'column' : 'row' }}>
        <Box
          sx={{
            display: 'flex',
            gap: '15px',
            mt: 3,
            flexWrap: 'wrap',
            justifyContent: isMobile ? 'center' : 'flex-start',
            flexDirection: 'column'
          }}
        >
          <Typography sx={{ fontSize: '20px' }}>{t('Guruhlar')}</Typography>
          {isLoading
            ? [1].map(() => (
                <Box key={'group.id'} style={{ textDecoration: 'none' }}>
                  <Box sx={{ display: 'flex', gap: '20px' }}>
                    <Card>
                      <CardContent sx={{ display: 'flex', justifyContent: 'space-between', minWidth: '320px' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                          <Skeleton variant='text' width={120} />
                          <Skeleton variant='text' width={115} />
                          <Skeleton variant='text' width={130} />
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: ' flex-end', gap: '5px' }}>
                          <Skeleton variant='text' width={40} />
                          <Skeleton variant='text' width={105} />
                          <Skeleton variant='text' width={130} />
                        </Box>
                      </CardContent>
                    </Card>
                  </Box>
                </Box>
              ))
            : ''}
          {groups.length ? (
            groups?.map((group: any) => (
              <Link
                key={group.id}
                href={`/student-profile/group/${group.id}?month=${group.start_date}&month_duration=${group.month_duration}&start_date=${group?.start_date}`}
                style={{
                  textDecoration: 'none',
                  display: 'block',
                  maxWidth: '400px',
                  width: '100%',
                  minWidth: '290px'
                }}
              >
                <Box sx={{ display: 'flex', gap: '20px', width: '100%' }}>
                  <Card sx={{ width: '100%' }}>
                    <CardContent sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <Typography sx={{ fontSize: '12px' }}>{group.name}</Typography>
                        <Typography sx={{ fontSize: '12px' }}>{group.course_name}</Typography>
                        <Typography sx={{ fontSize: '12px' }}>{group.teacher_name}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: ' flex-end', gap: '5px' }}>
                        <Typography sx={{ fontSize: '12px' }}>
                          {getLessonDays(group.week_days)} {group.start_at.split(':').splice(0, 2).join(':')} -{' '}
                          {group.end_at.split(':').splice(0, 2).join(':')}
                        </Typography>{' '}
                        <Typography sx={{ fontSize: '12px' }}>
                          {'Toq kunlari'} {'16:00'}
                        </Typography>
                        <Typography sx={{ fontSize: '12px' }}>{group.room_name}</Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              </Link>
            ))
          ) : (
            <EmptyContent />
          )}
        </Box>
        <Box
          sx={{
            display: 'flex',
            gap: '15px',
            mt: 3,
            flexWrap: 'wrap',
            justifyContent: isMobile ? 'center' : 'flex-start',
            flexDirection: 'column'
          }}
        >
          <Typography sx={{ fontSize: '20px' }}>{t('Xabarlar tarixi')}</Typography>
          {isLoading
            ? [1].map(() => (
                <Box key={'group.id'} style={{ textDecoration: 'none' }}>
                  <Box sx={{ display: 'flex', gap: '20px' }}>
                    <Card>
                      <CardContent sx={{ display: 'flex', justifyContent: 'space-between', minWidth: '320px' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                          <Skeleton variant='text' width={120} />
                          <Skeleton variant='text' width={300} />
                        </Box>
                      </CardContent>
                    </Card>
                  </Box>
                </Box>
              ))
            : ''}
          {sms.map((group: any) => (
            <Box
              key={group.id}
              style={{ textDecoration: 'none', display: 'block', maxWidth: '400px', width: '100%', minWidth: '290px' }}
            >
              <Card sx={{ width: '100%', padding: 0 }}>
                <CardContent
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '100%',
                    p: '6px',
                    flexDirection: 'column'
                  }}
                >
                  <Typography sx={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <IconifyIcon icon={'lets-icons:message-fill'} color='orange' />
                    <span>{datatimeFormatCustome(group.created_at)}</span>
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px', padding: '5px' }}>
                    <Typography sx={{ fontSize: '12px', fontStyle: 'italic' }}>{group.message}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
          </Box>
          <StudentEditProfileModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </div>
  )
}
