import { useContext, useEffect, useState } from 'react'
import { Box, Card, CardContent, Chip, Skeleton, Typography } from '@mui/material'
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
import { formatCurrency } from 'src/@core/utils/format-currency'
import { Icon } from '@iconify/react'

export default function StudentProfile() {
  const { t } = useTranslation()
  const { isMobile } = useResponsive()
  const [groups, setGroups] = useState<any[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [sms, setSms] = useState<any[]>([])
  const { user,loading } = useContext(AuthContext)
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
    <div >
      <div >
      <Card sx={{ display: 'flex', justifyContent: 'center',alignItems:'center' ,marginBottom:5}}>
        <div>
          <CardContent sx={{display:'flex',flexDirection:'column',alignItems:'center'}}>
              <p  style={{textAlign:'center', padding:0,color:'black',fontSize:20}}>Kodni skanerlang</p>
              <img  src={user?.qr_code} alt='' width={110} height={110} />
          </CardContent>
        </div>
      </Card>
      <Card sx={{ display: 'flex', justifyContent: 'space-between' }}>
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
        <CardContent sx={{ cursor: 'pointer' }}>
          <UserIcon onClick={() => setIsModalOpen(true)} icon='lucide:edit' />
        </CardContent>
      </Card>
     </div>
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
                {/* <Box sx={{ display: 'flex', gap: '20px', width: '100%' }}>
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
                </Box> */}
                <Box sx={{ width: '100%', display: 'flex', gap: '20px' }}>
                  <Card sx={{ width: isMobile ? '100%' : '400px', minHeight: 380 }}>
                    <div onClick={e => e.stopPropagation()}>
                      <CardContent
                        sx={{
                          backgroundColor: '#666CFF',
                          display: 'flex',
                          justifyContent: 'space-between',
                          py: '10px'
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Icon color='lightgreen' icon={'mdi:wallet'} />
                          <Chip
                            sx={{ backgroundColor: 'white' }}
                            label={`${formatCurrency(group.student_group_balance) || 0} so'm`}
                            size='small'
                            variant='outlined'
                            color={group.student_group_balance >= 0 ? 'success' : 'error'}
                          />
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {group.status == 'archive' ? (
                            <Chip
                              label={t('archive')}
                              color='error'
                              variant='outlined'
                              size='small'
                              sx={{
                                backgroundColor: 'white',
                                cursor: 'pointer',
                                fontWeight: 500,
                                fontSize: '10px',
                                padding: 0
                              }}
                            />
                          ) : group.status == 'new' ? (
                            <Chip
                              label={t('new')}
                              color='info'
                              variant='outlined'
                              size='small'
                              sx={{
                                backgroundColor: 'white',
                                cursor: 'pointer',
                                fontWeight: 500,
                                fontSize: '10px',
                                padding: 0
                              }}
                            />
                            ) : group.status == 'active' ? (
                                
                              <Chip
                              label={t('active')}
                              color='success'
                              variant='outlined'
                              size='small'
                              sx={{
                                backgroundColor: 'white',
                                cursor: 'pointer',
                                fontWeight: 500,
                                fontSize: '10px',
                                padding: 0
                              }}
                            />
                          ) : (
                            <Chip
                            label={t('frozen')}
                            color='secondary'
                            variant='outlined'
                            size='small'
                            sx={{
                              backgroundColor: 'white',
                              cursor: 'pointer',
                              fontWeight: 500,
                              fontSize: '10px',
                              padding: 0
                            }}
                          />
                          )}
                        </Box>
                      </CardContent>
                    </div>
                    <CardContent>
                      <Box sx={{ marginBottom: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Typography sx={{ fontSize: '20px', color: 'black' }}>{group.name} </Typography>
                          <Typography fontSize={12}>{group.group_interval}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Icon color='lightgreen' icon={'mdi:school'} />
                          <Typography sx={{ fontSize: '15px' }}>{group.teacher_name}</Typography>
                        </Box>
                      </Box>
                      <Box sx={{ marginBottom: 2 }}>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', marginBottom: 2 }}>
                          <Typography sx={{ color: 'black' }}>Dars kunlari :</Typography>
                          <Typography fontSize={12}>{group.lesson_time}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                          {group?.week_days?.map((day: any) => (
                            <Typography
                              sx={{
                                backgroundColor: 'lightgrey',
                                borderRadius: 10,
                                color: 'black',
                                paddingX: 3,
                                paddingY: 2
                              }}
                              fontSize={10}
                            >
                              {t(day)}
                            </Typography>
                          ))}
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography fontSize={13} sx={{ color: 'black' }}>
                            Boshlangan sana
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Icon icon={'mdi:calendar'} color='green' />
                            <Typography fontSize={12}>{group.start_date}</Typography>
                          </Box>
                        </Box>
                        <Box>
                          <Typography fontSize={13} sx={{ color: 'black' }}>
                            O'chiriladigan sana
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Icon icon={'mdi:calendar'} color='red' />
                            <Typography fontSize={12}>{group.end_date}</Typography>
                          </Box>
                        </Box>
                      </Box>
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 5 }}
                      >
                        <Box>
                          <Typography color={'black'}>Keyingi to'lov</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Icon icon={'mdi:clock'} />
                            <Typography fontSize={13}>{group.next_payment}</Typography>
                          </Box>
                        </Box>
                        <Box>
                          <Typography color={'black'}>To'lov narxi</Typography>
                          <Typography color='green' fontSize={13}>
                            {formatCurrency(group.price)} so'm
                          </Typography>
                        </Box>
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
