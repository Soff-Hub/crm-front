import { Box, Card, CardContent, Typography } from '@mui/material'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import getLessonDays from 'src/@core/utils/getLessonDays'
import getMonthName from 'src/@core/utils/gwt-month-name'

export default function GroupCard({ group }: { group: any }) {
  const { t } = useTranslation()

  return (
    <Link
      href={`/groups/view/security/?id=${group.id}&month=${getMonthName(null)}`}
      style={{ textDecoration: 'none' }}
    >
      <Box sx={{ display: 'flex', gap: '20px' }}>
        <Card sx={{ bgcolor: group.color }}>
          <CardContent sx={{ display: 'flex', justifyContent: 'space-between', minWidth: '320px', gap: '20px' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <Typography sx={{ fontSize: '12px' }}>{group.name}</Typography>
              <Typography sx={{ fontSize: '12px' }}>{group.course_name}</Typography>
              <Typography sx={{ fontSize: '12px' }}>{group.teacher_name}</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: ' flex-end', gap: '5px' }}>
              <Typography sx={{ fontSize: '12px' }}>
                {t(getLessonDays(group.week_days))} {group.start_at.split(':').splice(0, 2).join(':')} -{' '}
                {group.end_at.split(':').splice(0, 2).join(':')}
              </Typography>
              <Typography sx={{ fontSize: '12px' }}>
                {t('Boshlangan')}: {group.start_date}
              </Typography>
              <Typography sx={{ fontSize: '12px' }}>
                {t('Yakunlanadi')}: {group.end_date}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Link>
  )
}
