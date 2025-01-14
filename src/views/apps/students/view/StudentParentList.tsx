import { Box, Button, IconButton, Typography } from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import IconifyIcon from 'src/@core/components/icon'
import DataTable from 'src/@core/components/table'
import { customTableProps } from 'src/pages/students'
import { useAppDispatch, useAppSelector } from 'src/store'
import AddStudentParent from './AddStudentParent'
import api from 'src/@core/utils/api'
import { fetchStudentDetail } from 'src/store/apps/students'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import UserSuspendDialog from '../../groups/view/UserSuspendDialog'

export default function StudentParentList() {
  const [open, setOpen] = useState<'create' | 'edit' | null>(null)
  const { t } = useTranslation()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [id, setId] = useState<number | null>(null)
  const { studentData } = useAppSelector(state => state.students)
  const dispatch = useAppDispatch()
  const { query } = useRouter()
  const [deleteLoading,setDeleteLoading] = useState(false)

  

  async function handleDelete() {
    setDeleteLoading(true)
    await api
      .delete(`student/parent/destroy/${id}`)
      .then(res => {
        console.log(res)
        dispatch(fetchStudentDetail(Number(query.student)))
        toast.success("O'chirildi")
      })
      .catch(err => {
        toast.error(err.response.data.msg || 'Xatolik bor')
      })
    setDeleteLoading(false)
  }

  const columns: customTableProps[] = [
    {
      xs: 1,
      title: t('first_name'),
      dataIndex: 'first_name'
    },
    {
      xs: 1,
      title: t('phone'),
      dataIndex: 'phone'
    },
    {
      xs: 1,
      title: t("O'chirish"),
      dataIndex: 'id',
      render: id => (
        <Box sx={{ textAlign: 'end' }}>
          <IconButton
            onClick={() => {
              setDeleteOpen(true), setId(id)
            }}
          >
            <IconifyIcon icon='mdi:delete' />
          </IconButton>
        </Box>
      )
    }
  ]

  return (
    <Box sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant='h6'>{t('Ota-onalari')}</Typography>
        {
          <Button onClick={() => setOpen('create')} variant='contained'>
            {t('Yaratish')}
          </Button>
        }
      </Box>
      <DataTable maxWidth='100%' minWidth='100%' data={studentData?.parent_data || []} columns={columns} />
      <UserSuspendDialog isDeleting={deleteLoading}  handleOk={handleDelete} open={deleteOpen} setOpen={setDeleteOpen} />

      <AddStudentParent open={open}  setOpen={setOpen} />
    </Box>
  )
}
