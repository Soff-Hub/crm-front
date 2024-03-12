import React, { useState } from 'react'
import { Box, Button, Dialog, DialogContent, DialogTitle, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import { customTableProps } from 'src/pages/groups'
import DataTable from 'src/@core/components/table'
import toast from 'react-hot-toast'
import IconifyIcon from 'src/@core/components/icon'
import Form from 'src/@core/components/form'
import api from 'src/@core/utils/api'
import LoadingButton from '@mui/lab/LoadingButton'

export default function FormsPage() {

  const [open, setOpen] = useState<null | 'new' | 'delete'>(null)
  const [departments, setDepartments] = useState<any[]>([])
  const [selectedDepartment, setSelectedDepartment] = useState<any>(null)
  const [error, setError] = useState<any>({})
  const [deleteId, setDeleteId] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const columns: customTableProps[] = [
    {
      xs: 0.1,
      title: "#",
      dataIndex: "index",
    },
    {
      xs: 0.5,
      title: "Nomi",
      dataIndex: "name",
    },
    {
      xs: 1,
      title: "Nomi",
      dataIndex: "lead",
    },
    {
      xs: 1,
      title: "Nomi",
      dataIndex: "link"
    },
    {
      xs: 0.5,
      title: "Amallar",
      dataIndex: "id",
      render: (id) => <IconifyIcon onClick={() => (setDeleteId(id), setOpen('delete'))} icon={'material-symbols-light:delete-outline'} />
    },
  ]

  const data: any[] = [
    {
      id: 1,
      name: "forma 1",
      lead: "Frontend guruhi uchun",
      link: "https://soff.uz"
    },
  ]

  const handleClick = (id: string) => {
    const value = data.find(el => el.id === id)
    navigator.clipboard.writeText(value.link)
    toast.success("Link nusxalandi!", {
      position: 'top-center'
    })
  };

  async function getDepartments() {
    const resp = await api.get(`leads/department/list/`)
    setDepartments(resp.data.results);
  }

  const openDialog = () => {
    setOpen('new')
    getDepartments()
  }

  async function onSubmit(values: any) {
    setLoading(true)
    console.log(values)
    setTimeout(() => {
      setOpen(null)
      setLoading(false)
    }, 800)
  }

  async function onDelete() {
    setLoading(true)
    setTimeout(() => {
      setOpen(null)
      setLoading(false)
    }, 800)
  }

  return (
    <Box sx={{ maxWidth: '700px' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography>Formalar</Typography>
        <Button size='small' variant='contained' startIcon={<IconifyIcon icon={'ic:baseline-add'} />} onClick={openDialog}>Yangi</Button>
      </Box>

      <DataTable columns={columns} data={data} maxWidth='700px' minWidth='500px' rowClick={handleClick} />

      <Dialog open={open === 'new'} onClose={() => setOpen(null)}>
        <DialogTitle minWidth={'300px'} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography fontSize={'18px'}>Yangi forma</Typography>
          <span onClick={() => setOpen(null)}>
            <IconifyIcon icon={'ic:baseline-add'} style={{ transform: 'rotate(45deg)', cursor: 'pointer' }} />
          </span>
        </DialogTitle>
        <DialogContent>
          <Form setError={setError} reqiuredFields={['department', 'departmentParent', 'name']} id='create-form' onSubmit={onSubmit} sx={{ marginTop: '5px', display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}>
            <FormControl fullWidth>
              <TextField size='small' label="Nomi" name='name' error={error?.name?.error} />
              <FormHelperText error={error.name?.error}>{error.name?.message}</FormHelperText>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel size='small' id='user-view-language-label'>Bo'lim</InputLabel>
              <Select
                size='small'
                error={error.departmentParent?.error}
                label={"Bo'lim"}

                id='user-view-language'
                labelId='user-view-language-label'
                name='departmentParent'
                defaultValue={''}
                onChange={(e: any) => setSelectedDepartment(e.target.value)}
              >
                {
                  departments.map(item => <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>)
                }
              </Select>
              <FormHelperText error={error.departmentParent?.error}>{error.departmentParent?.message}</FormHelperText>
            </FormControl>

            {selectedDepartment && (
              <FormControl fullWidth>
                <InputLabel size='small' id='user-view-language-label'>Quyi bo'lim</InputLabel>
                <Select
                  size='small'
                  error={error.department?.error}
                  label={"Quyi bo'lim"}
                  multiple
                  id='user-view-language'
                  labelId='user-view-language-label'
                  name='department'
                  defaultValue={[]}
                >
                  {
                    departments.find(el => Number(el.id) === selectedDepartment).children.map((item: any) => <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>)
                  }
                </Select>
                <FormHelperText error={error.department?.error}>{error.department?.message}</FormHelperText>
              </FormControl>
            )}

            <LoadingButton loading={loading} variant='contained' type='submit'>Yaratish</LoadingButton>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={open === 'delete'} onClose={() => setOpen(null)}>
        <DialogContent>
          <Typography sx={{ fontSize: '20px', margin: '30px 20px' }}>Formani o'chirmoqchimisiz?</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
            <LoadingButton variant='outlined' color='error' onClick={() => setOpen(null)}>Yo'q</LoadingButton>
            <LoadingButton loading={loading} variant='contained' color='success' onClick={onDelete}>Xa, O'chirish</LoadingButton>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  )
}
