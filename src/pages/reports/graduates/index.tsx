import { 
  Box, 
  Typography, 
  Pagination, 
  Select, 
  MenuItem, 
  InputLabel, 
  FormControl, 
  SelectChangeEvent 
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import DataTable from 'src/@core/components/table'
import api from 'src/@core/utils/api'

export interface customTableProps {
  xs: number
  title: string | React.ReactNode
  dataIndex?: string | React.ReactNode
  renderItem?: (source: any) => any | undefined
  render?: (source: string) => any | undefined
  renderId?: (id: any, source: any) => any | undefined
  renderSource?: (source: any, item: any) => any | undefined
}

export default function GraduatesPage() {
  const { t } = useTranslation()
  const [graduatesData, setGraduatesData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1) // Set initial page to 1
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [groups, setGroups] = useState<any[]>([])
  const [selectedGroup, setSelectedGroup] = useState<string>('all')

  // Fetch graduates with optional group filter
  async function getGraduates() {
    setLoading(true)
    const offset = (page - 1) * rowsPerPage
    const limit = rowsPerPage

    let url = `common/group/students/?status=graduates`

    if (selectedGroup !== 'all') {
      url += `&group=${encodeURIComponent(selectedGroup)}`
    }

    try {
      const res = await api.get(url)
      setGraduatesData(res.data.response)
    } catch (error) {
      console.error('Error fetching graduates:', error)
    }
    setLoading(false)
  }

  async function getGroups() {
    try {
      const res = await api.get('common/group-check-list/')
      setGroups(res.data) 
    } catch (error) {
      console.error('Error fetching groups:', error)
    }
  }

  useEffect(() => {
    getGraduates()
  }, [page, rowsPerPage, selectedGroup])

  useEffect(() => {
    getGroups()
  }, [])

  const handleChangePage = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: SelectChangeEvent<number>) => {
    setRowsPerPage(Number(event.target.value))
    setPage(1) // Reset to first page when rows per page changes
  }

  const handleChangeGroupFilter = (event: SelectChangeEvent<string>) => {
    setSelectedGroup(event.target.value)
    setPage(1) // Reset to first page when the group filter changes
  }

  const columns: customTableProps[] = [
    {
      title: 'Ism',
      dataIndex: 'student',
      xs: 3,
      render: (student: any) => <>{student.first_name}</>
    },
    {
      title: 'Guruhi',
      dataIndex: 'group_name',
      xs: 3
    },
    {
      title: "Qo'shilgan sanasi",
      dataIndex: 'added_at',
      render: (added_at: string) => <span>{added_at}</span>,
      xs: 2
    },
    {
      title: 'Tugatkan sanasi',
      dataIndex: 'deleted_at',
      render: (deleted_at: string) => <span>{deleted_at}</span>,
      xs: 2
    }
  ]

  return (
    <div>
      {/* Header */}
      <Box
        className='groups-page-header'
        sx={{ display: 'flex', justifyContent: 'space-between', margin: '10px 0' }}
        py={2}
      >
        <Typography variant='h5'>{t('Bitiruvchilar')}</Typography>
      </Box>

      {/* Group Filter */}
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', marginBottom: 2 }}>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel id="group-filter-label">Guruhlar</InputLabel>
          <Select
            labelId="group-filter-label"
            value={selectedGroup}
            label="Guruhlar"
            onChange={handleChangeGroupFilter}
          >
            <MenuItem value="all">Barchasi</MenuItem>
            {groups.map((group: any) => (
              <MenuItem key={group.id} value={group.id}>
                {group.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={graduatesData}
        loading={loading}
        minWidth="1200px"
        maxWidth="1500px"
      />

      {/* Controls for rows per page and pagination */}
      {/* <Box sx={{ marginTop: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel id="rows-per-page-label">Rows per page</InputLabel>
          <Select
            labelId="rows-per-page-label"
            value={rowsPerPage}
            label="Rows per page"
            onChange={handleChangeRowsPerPage}
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={25}>25</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </Select>
        </FormControl>

        <Pagination
          count={Math.ceil(graduatesData.length / rowsPerPage)}
          page={page}
          onChange={handleChangePage}
          color="primary"
          shape="rounded"
        />
      </Box> */}
    </div>
  )
}
