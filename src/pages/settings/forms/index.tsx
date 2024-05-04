import React, { useEffect, useState } from 'react'
import { Alert, Box, Button, Dialog, DialogContent, DialogTitle, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import { customTableProps } from 'src/pages/groups'
import DataTable from 'src/@core/components/table'
import toast from 'react-hot-toast'
import IconifyIcon from 'src/@core/components/icon'
import Form from 'src/@core/components/form'
import api from 'src/@core/utils/api'
import LoadingButton from '@mui/lab/LoadingButton'
import UseBgColor from 'src/@core/hooks/useBgColor'
import { useTranslation } from 'react-i18next'
import showResponseError from 'src/@core/utils/show-response-error'
import { useRouter } from 'next/router'

export default function FormsPage() {

  const [open, setOpen] = useState<null | 'new' | 'delete'>(null)
  const [departments, setDepartments] = useState<any[]>([])
  const [selectedDepartment, setSelectedDepartment] = useState<any>(null)
  const [error, setError] = useState<any>({})
  const [deleteId, setDeleteId] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [data, setData] = useState<any[]>([])
  const [sourceData, setSourceData] = useState<any>([])
  const [addSource, setAddSource] = useState<boolean>(false)

  const bgColors = UseBgColor()
  const { t } = useTranslation()
  const { push } = useRouter()
  const columns: customTableProps[] = [
    {
      xs: 0.1,
      title: "#",
      dataIndex: "index",
    },
    {
      xs: 1,
      title: "Nomi",
      dataIndex: "title",
    },
    {
      xs: 1,
      title: "Lid bo'limi",
      dataIndex: "source_department",
      render: (source_department: any) => source_department.department
    },
    {
      xs: 1,
      title: "Manba",
      dataIndex: "source_department",
      render: (source_department: any) => source_department.source
    },
    {
      xs: 1,
      title: "Tushgan lidlar soni",
      dataIndex: "user_count",
    },
    {
      xs: 2.4,
      title: "Link",
      dataIndex: "uuid",
      render: (link: string) => `${link}`
    },
    {
      xs: 0.5,
      title: "Amallar",
      dataIndex: "id",
      render: (id) => <IconifyIcon onClick={() => (setDeleteId(id), setOpen('delete'))} icon={'material-symbols-light:delete-outline'} />
    },
  ]

  const BASE_URL = process.env.NEXT_PUBLIC_URL

  const handleClick = (id: string) => {
    const value = data.find(el => el.id === id)
    const textArea = document.createElement("textarea");
    textArea.value = `${BASE_URL}/forms/r/${value.uuid}`;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
    } catch (err) {
      console.error('Unable to copy to clipboard', err);
    }
    document.body.removeChild(textArea);
    toast.success("Link nusxalandi", { position: 'top-center' })
  };

  const getForms = async () => {
    const resp = await api.get('leads/application-form/list/')
    setData(resp.data)
  }

  async function getDepartments() {
    const resp = await api.get(`leads/department/list/`)
    setDepartments(resp.data);
  }


  const getSources = async () => {
    const resp = await api.get('leads/source/')
    if (resp?.data) {
      setSourceData(resp.data.results);
    }
  }

  const openDialog = () => {
    setOpen('new')
    getDepartments()
    getSources()
  }

  async function onSubmit(values: any) {
    setLoading(true)
    try {
      await api.post('leads/application-form/create/', values)
      setOpen(null)
      setLoading(false)
      getForms()
    } catch (err: any) {
      console.log(err)
      showResponseError(err?.response.data, setError)
      setLoading(false)
    }
  }

  async function onDelete() {
    setLoading(true)
    try {
      await api.delete(`leads/application-form/destroy/${deleteId}`)
      setOpen(null)
      setLoading(false)
      getForms()
    } catch (err: any) {
      console.log(err)
      setLoading(false)
    }
  }

  useEffect(() => {
    getForms()
  }, [])

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography fontSize={'18px'}>Formalar</Typography>
        {/* <Button size='small' variant='contained' startIcon={<IconifyIcon icon={'ic:baseline-add'} />} onClick={openDialog}>Yangi</Button> */}
        <Button size='small' variant='contained' startIcon={<IconifyIcon icon={'ic:baseline-add'} />} onClick={() => push(`/settings/forms/create`)}>Yangi</Button>
      </Box>

      <Box sx={{ display: 'flex', gap: '10px', flexDirection: 'column', mt: '10px' }}>
        <Alert icon={false} sx={{ py: 2, mb: 0, ...bgColors.primaryLight, '& .MuiAlert-message': { p: 0 } }}>
          <Typography variant='caption' sx={{ display: 'block', color: 'primary.main' }}>
            Linkni nusxalash uchun qatorning istalgan joyiga bosing
          </Typography>
        </Alert>
      </Box>

      <DataTable columns={columns} data={data} rowClick={handleClick} />

      <Dialog open={open === 'new'} onClose={() => setOpen(null)}>
        <DialogTitle minWidth={'300px'} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography fontSize={'18px'}>Yangi forma</Typography>
          <span onClick={() => setOpen(null)}>
            <IconifyIcon icon={'ic:baseline-add'} style={{ transform: 'rotate(45deg)', cursor: 'pointer' }} />
          </span>
        </DialogTitle>
        <DialogContent>
          <Form setError={setError} reqiuredFields={['department', 'departmentParent', 'title']} id='create-form' onSubmit={onSubmit} sx={{ marginTop: '5px', display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}>
            <FormControl fullWidth>
              <TextField size='small' label="Nomi" name='title' error={error?.title?.error} />
              <FormHelperText error={error.title?.error}>{error.title?.message}</FormHelperText>
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
                  id='user-view-language'
                  labelId='user-view-language-label'
                  name='department'
                  defaultValue={''}
                >
                  {
                    departments.find(el => Number(el.id) === selectedDepartment).children.map((item: any) => <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>)
                  }
                </Select>
                <FormHelperText error={error.department?.error}>{error.department?.message}</FormHelperText>
              </FormControl>
            )}

            {!addSource ? (
              <FormControl fullWidth>
                <InputLabel size='small' id='fsdgsdgsgsdfsd-label'>{t('Manba')}</InputLabel>
                <Select
                  size='small'
                  error={error.source?.error}
                  label={t('Manba')}
                  id='fsdgsdgsgsdfsd'
                  labelId='fsdgsdgsgsdfsd-label'
                  name='source'
                  onChange={(e: any) => setAddSource(e?.target?.value === 0)}
                  sx={{ mb: 1 }}
                >
                  {
                    sourceData.map((lead: any) => <MenuItem key={lead.id} value={lead.id}>{lead.name}</MenuItem>)
                  }
                  {/* <MenuItem value={0} sx={{ fontWeight: '600' }}><IconifyIcon icon={'ic:baseline-add'} /> Yangi qo'shish</MenuItem> */}
                </Select>
                <FormHelperText error={error.source?.error}>{error.source?.message}</FormHelperText>
              </FormControl>
            ) : ''}

            {addSource ? (
              <FormControl fullWidth>
                <TextField fullWidth error={error.first_name?.error} size='small' label={t('Manba')} name='source' />
                <FormHelperText error={error.source?.error}>{error.source?.message}</FormHelperText>
              </FormControl>
            ) : ''}

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
