import { Box, Grid, Pagination, Typography } from '@mui/material'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { customTableDataProps } from 'src/@core/components/table'
import { formatCurrency } from 'src/@core/utils/format-currency'
import { AuthContext } from 'src/context/AuthContext'
import { useAppDispatch, useAppSelector } from 'src/store'
import { fetchGroups, fetchTeacherSalaries, updateMyGroupParams } from 'src/store/apps/groups'

// Dynamically import components
const TeachersDetails = dynamic(() => import('./components/TeachersDetails'), { ssr: false })
const GroupCard = dynamic(() => import('./components/GroupCard'), { ssr: false })
const GroupSkeleton = dynamic(() => import('./components/Skeleton'), { ssr: false })
const DataTable = dynamic(() => import('src/@core/components/table'), { ssr: false })

export default function MyGroups() {
  const { user } = useContext(AuthContext)
  const { t } = useTranslation()
  const { groups, isTableLoading, myGroupParams, isLoading, teacherSalaries } = useAppSelector(state => state.groups)
  const dispatch = useAppDispatch()
  const { push } = useRouter()

  const column: customTableDataProps[] = [
    {
      xs: 0.03,
      title: '#',
      dataIndex: 'index'
    },
    {
      xs: 0.2,
      title: t('Oy'),
      dataIndex: 'date'
    },
    {
      xs: 0.2,
      title: t('Bonuslar'),
      dataIndex: 'bonus_amount',
      render: salaries => `${formatCurrency(salaries)} so'm`
    },
    {
      xs: 0.2,
      title: t('Jarimalar'),
      dataIndex: 'fine_amount',
      render: salaries => `${formatCurrency(salaries)} so'm`
    },
    {
      xs: 0.2,
      title: t('Avanslar'),
      dataIndex: 'prepayment',
      render: salaries => `${formatCurrency(salaries)} so'm`
    },
    {
      xs: 0.2,
      title: t('Oylik ish haqi'),
      dataIndex: 'salary',
      render: salaries => `${formatCurrency(salaries)} so'm`
    },
    {
      xs: 0.2,
      title: t('Oylik berilgan sana'),
      dataIndex: 'checked_date'
    },
    {
      xs: 0.2,
      title: t('Yakuniy ish haqqi'),
      dataIndex: 'updated_salary',
      render: salaries => `${formatCurrency(salaries)} so'm`
    }
  ]

  useEffect(() => {
    if (!user?.role.includes('teacher')) {
      push('/')
      toast.error("Sizda bu sahifaga kirish huquqi yo'q!")
    }
    ;(async function () {
      await Promise.all([
        dispatch(fetchGroups(`page=1&status=active&teacher=${user?.id}`)),
        dispatch(fetchTeacherSalaries(``))
      ])
    })()
  }, [])

  const handlePagination = async (page: number) => {
    const stringedParams: any = { ...myGroupParams, page: String(page) }
    const queryString = new URLSearchParams(stringedParams).toString()
    dispatch(updateMyGroupParams({ page: page }))
    await dispatch(fetchTeacherSalaries(queryString))
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={5} lg={4}>
          <TeachersDetails />
        </Grid>
        <Grid item xs={12} md={7} lg={8}>
          <Typography variant='h6' sx={{ mb: 3 }}>
            {t('Mening guruhlarim')}
          </Typography>
          <Box sx={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            {isLoading ? (
              <GroupSkeleton />
            ) : (
              groups && groups.map((group: any) => <GroupCard key={group.id} group={group} />)
            )}
          </Box>
        </Grid>
      </Grid>
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography variant='h6'>{t("Oylik to'lovlar tarixi")}</Typography>
        <DataTable
          loading={isTableLoading}
          columns={column}
          data={teacherSalaries?.results || []}
          rowClick={(id: number) => null}
        />
      </Box>
      {teacherSalaries && teacherSalaries?.count > 10 && !isTableLoading && (
        <Pagination
          defaultPage={myGroupParams?.page || 1}
          count={Math.ceil(teacherSalaries?.count / 10)}
          variant='outlined'
          shape='rounded'
          onChange={(e: any, page) => handlePagination(page)}
        />
      )}
    </Box>
  )
}
