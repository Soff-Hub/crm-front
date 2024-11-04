import { Box } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { DateRangePicker, SelectPicker } from 'rsuite'
import { useAppDispatch, useAppSelector } from 'src/store'
import { useTranslation } from 'react-i18next'
import {
  fetchFinanceAllNumbers,
  getExpenseCategories,
  getGroupsFinance,
  updateNumberParams
} from 'src/store/apps/finance'
import { formatDateString } from 'src/pages/finance'
import { AuthContext } from 'src/context/AuthContext'
import useResponsive from 'src/@core/hooks/useResponsive'

export const yearItems = [
  { label: 2021, value: 2021 },
  ...Array(new Date().getFullYear() - 2021)
    .fill(1)
    .map((item, index) => ({ label: 2021 + index + 1, value: 2021 + index + 1 }))
]
export const monthItems = [
  'Yanvar',
  'Fevral',
  'Mart',
  'Aprel',
  'May',
  'Iyun',
  'Iyul',
  'Avgust',
  'Sentabr',
  'Oktabr',
  'Noyabr',
  'Dekabr'
].map((el, i) => ({ label: el, value: i + 1 < 10 ? `0${i + 1}` : `${i + 1}` }))

export default function HeadingFilter() {
  const { allNumbersParams } = useAppSelector(state => state.finance)
  const { isMobile } = useResponsive()
  const { user } = useContext(AuthContext)
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const [date, setDate] = useState<any>('')
  const [activeBranch, setActiveBranch] = useState<any>(user?.active_branch)

  const handleChangeDate = async (e: any) => {
    if (e) {
      dispatch(updateNumberParams({ date_year: '', date_month: '' }))
      dispatch(
        updateNumberParams({
          start_date: `${formatDateString(e[0])}`,
          end_date: `${formatDateString(e[1])}`,
          date_year: '',
          date_month: ''
        })
      )
      await Promise.all([
        dispatch(
          fetchFinanceAllNumbers({
            ...allNumbersParams,
            start_date: `${formatDateString(e[0])}`,
            end_date: `${formatDateString(e[1])}`,
            date_year: '',
            date_month: ''
          })
        ),
        dispatch(
          getExpenseCategories({
            ...allNumbersParams,
            start_date: `${formatDateString(e[0])}`,
            end_date: `${formatDateString(e[1])}`,
            date_year: '',
            date_month: ''
          })
        ),
        dispatch(
          getGroupsFinance({
            ...allNumbersParams,
            start_date: `${formatDateString(e[0])}`,
            end_date: `${formatDateString(e[1])}`,
            date_year: '',
            date_month: ''
          })
        )
      ])
      dispatch(updateNumberParams({ date_month: '' }))
    } else {
      dispatch(updateNumberParams({ date_year: `${new Date().getFullYear()}-01-01`, start_date: ``, end_date: `` }))
      await Promise.all([
        dispatch(
          fetchFinanceAllNumbers({
            ...allNumbersParams,
            date_year: `${new Date().getFullYear()}-01-01`,
            start_date: ``,
            end_date: ``
          })
        ),
        dispatch(
          getExpenseCategories({
            ...allNumbersParams,
            date_year: `${new Date().getFullYear()}-01-01`,
            start_date: ``,
            end_date: ``
          })
        ),
        dispatch(
          getGroupsFinance({
            ...allNumbersParams,
            date_year: `${new Date().getFullYear()}-01-01`,
            start_date: ``,
            end_date: ``
          })
        )
      ])
    }
    setDate(e)
  }

  const handleYearDate = async (value: any, t: 'm' | 'y') => {
    dispatch(updateNumberParams({ start_date: '', end_date: '' }))
    setDate('')
    if (!value) {
      if (t === 'm') {
        dispatch(updateNumberParams({ date_month: '' }))
        await Promise.all([
          dispatch(fetchFinanceAllNumbers({ ...allNumbersParams, date_month: '', start_date: ``, end_date: `` })),
          dispatch(getExpenseCategories({ ...allNumbersParams, date_month: '', start_date: ``, end_date: `` })),
          dispatch(getGroupsFinance({ ...allNumbersParams, date_month: '', start_date: ``, end_date: `` }))
        ])
      } else {
        dispatch(updateNumberParams({ date_year: `${new Date().getFullYear()}-01-01` }))
        await Promise.all([
          dispatch(fetchFinanceAllNumbers({ ...allNumbersParams, date_month: '', start_date: ``, end_date: `` })),
          dispatch(getExpenseCategories({ ...allNumbersParams, date_month: '', start_date: ``, end_date: `` })),
          dispatch(getGroupsFinance({ ...allNumbersParams, date_month: '', start_date: ``, end_date: `` }))
        ])
      }
      return
    }
    if (Number(value) > 100) {
      dispatch(updateNumberParams({ date_year: `${value}-01-01` }))
      await Promise.all([
        dispatch(
          fetchFinanceAllNumbers({ ...allNumbersParams, date_year: `${value}-01-01`, start_date: ``, end_date: `` })
        ),
        dispatch(
          getExpenseCategories({ ...allNumbersParams, date_year: `${value}-01-01`, start_date: ``, end_date: `` })
        ),
        dispatch(getGroupsFinance({ ...allNumbersParams, date_year: `${value}-01-01`, start_date: ``, end_date: `` }))
      ])
    } else {
      dispatch(updateNumberParams({ date_month: value }))
      await Promise.all([
        dispatch(
          fetchFinanceAllNumbers({
            ...allNumbersParams,
            date_year: allNumbersParams.date_year || `${new Date().getFullYear()}-01-01`,
            date_month: value,
            start_date: ``,
            end_date: ``
          })
        ),
        dispatch(
          getExpenseCategories({
            ...allNumbersParams,
            date_year: allNumbersParams.date_year || `${new Date().getFullYear()}-01-01`,
            date_month: value,
            start_date: ``,
            end_date: ``
          })
        ),
        dispatch(
          getGroupsFinance({
            ...allNumbersParams,
            date_year: allNumbersParams.date_year || `${new Date().getFullYear()}-01-01`,
            date_month: value,
            start_date: ``,
            end_date: ``
          })
        )
      ])
    }
  }

  const handleChangeBranch = async (branch: any) => {
    if (branch) {
      setActiveBranch(branch)
      dispatch(updateNumberParams({ branch }))
      await Promise.all([
        dispatch(fetchFinanceAllNumbers({ ...allNumbersParams, branch })),
        dispatch(getExpenseCategories({ ...allNumbersParams, branch })),
        dispatch(getGroupsFinance({ ...allNumbersParams, branch }))
      ])
    } else {
      setActiveBranch('')
      dispatch(updateNumberParams({ branch: '' }))
      await Promise.all([
        dispatch(fetchFinanceAllNumbers({ ...allNumbersParams, branch: '' })),
        dispatch(getExpenseCategories({ ...allNumbersParams, branch: '' })),
        dispatch(getGroupsFinance({ ...allNumbersParams, branch: '' }))
      ])
    }
  }

  useEffect(() => {
    ;(async function () {
      await Promise.all([
        dispatch(fetchFinanceAllNumbers({ ...allNumbersParams, branch: activeBranch })),
        dispatch(getExpenseCategories({ ...allNumbersParams, branch: activeBranch })),
        dispatch(getGroupsFinance({ ...allNumbersParams, branch: activeBranch }))
      ])
    })()
    dispatch(updateNumberParams({ branch: activeBranch }))
  }, [])

  return (
    <Box
      sx={{
        display: isMobile ? 'grid' : 'flex',
        flexWrap: isMobile ? 'unset' : 'wrap', 
        gap: isMobile ? 1 : 3, 
        gridTemplateColumns: isMobile ? '1fr 1fr' : 'unset', 
        alignItems: 'center',
        mt: isMobile ? '10px' : '',
        mb: '10px',
        mr: '5px'
      }}
    >
      {' '}
      <SelectPicker
        // sx={{ maxWidth: 180, width: '100%' }}
        onChange={handleChangeBranch}
        size='md'
        data={
          user?.branches
            ? [
                ...user?.branches?.map(el => ({ label: el.name, value: el.id })),
                { label: t('Barcha filiallar'), value: '' }
              ]
            : []
        }
        style={{ width: isMobile ? 'auto' : 180 }}
        searchable={false}
        placeholder={t('Filialni tanlang')}
        value={activeBranch}
      />
      <SelectPicker
        onChange={v => handleYearDate(v, 'y')}
        size='md'
        data={yearItems}
        style={{ width: isMobile ? 'auto' : 180 }}
        value={Number(allNumbersParams.date_year.split('-')[0])}
        searchable={false}
        cleanable={false}
        placeholder={t('Yilni tanlang')}
      />
      <SelectPicker
        onChange={v => handleYearDate(v, 'm')}
        size='md'
        data={monthItems}
        style={{ width: isMobile ? 'auto' : 180 }}
        value={allNumbersParams.date_month}
        searchable={false}
        placeholder={t('Oyni tanlang')}
      />
      <DateRangePicker
        showOneCalendar
        placement='bottomEnd'
        locale={{
          last7Days: t('Oxirgi hafta'),
          sunday: t('Yak'),
          monday: t('Du'),
          tuesday: t('Se'),
          wednesday: t('Chor'),
          thursday: t('Pa'),
          friday: t('Ju'),
          saturday: t('Sha'),
          ok: t('Saqlash'),
          today: t('Bugun'),
          yesterday: t('Kecha'),
          hours: t('Soat'),
          minutes: t('Minut'),
          seconds: t('Sekund')
        }}
        format='yyyy-MM-dd'
        onChange={handleChangeDate}
        translate={'yes'}
        size='md'
        value={date}
      />
    </Box>
  )
}
