import { Box, Typography, Pagination, Select, MenuItem, debounce, TextField } from '@mui/material'
import { count } from 'console'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import DataTable, { customTableDataProps } from 'src/@core/components/table'
import api from 'src/@core/utils/api'
import { useAppDispatch, useAppSelector } from 'src/store'
import { setLogins } from 'src/store/apps/settings'

function Logins() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { logins } = useAppSelector(state => state.settings)
  const [search, setSearch] = useState('')

  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [total, setTotal] = useState(0)
  const [userType, setUserType] = useState('')

  const columns: customTableDataProps[] = [
    { xs: 0.3, title: t('ID'), dataIndex: 'index' },
    { xs: 1, title: t('Username'), dataIndex: 'user_name' },
    { xs: 1, title: t('Telefon raqam'), dataIndex: 'user_phone' },
    { xs: 1.4, title: t('Kirgan sanasi'), dataIndex: 'date' }
  ]

  async function fetchUserLogins() {
    setLoading(true)
    try {
      const res = await api.get('auth/user-logins/', {
        params: {
          limit: rowsPerPage,
          offset: (page - 1) * rowsPerPage,
          search: search || undefined,
          user_type: userType || undefined
        }
      })
      dispatch(setLogins(res.data))
      setTotal(res.data.count)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const handleSearchChange = debounce((value: string) => {
    setSearch(value)
    setPage(1)
  }, 500)

  useEffect(() => {
    fetchUserLogins()
  }, [page, rowsPerPage, search, userType])

  return (
    <div>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant='h5'>{t('Kirishlar soni')}</Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          size='small'
          variant='outlined'
          label={t('Qidirish')}
          onChange={e => handleSearchChange(e.target.value)}
          sx={{ width: '250px' }}
        />

        <Select
          size='small'
          displayEmpty
          value={userType}
          onChange={e => {
            setUserType(e.target.value)
            setPage(1)
          }}
          sx={{ width: '200px' }}
        >
          <MenuItem value=''>{t('Barchasi')}</MenuItem>
          <MenuItem value='student'>{t('Talaba')}</MenuItem>
          <MenuItem value='employee'>{t('Xodim')}</MenuItem>
        </Select>
      </Box>

      <DataTable columns={columns} loading={loading} data={logins?.results || []} />

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {logins && logins?.count > 10 && (
            <Select
              value={rowsPerPage}
              onChange={(e: any) => {
                setRowsPerPage(parseInt(e.target.value, 10))
                setPage(1)
              }}
              size='small'
            >
              {[10, 20, 50, 100, 200, 300].map(size => (
                <MenuItem key={size} value={size}>
                  {size}
                </MenuItem>
              ))}
            </Select>
          )}
        </Box>

        {logins && logins?.count > 10 && (
          <Pagination
            count={Math.ceil(total / rowsPerPage)}
            page={page}
            onChange={(_, newPage) => setPage(newPage)}
            color='primary'
          />
        )}
      </Box>
    </div>
  )
}

export default Logins
