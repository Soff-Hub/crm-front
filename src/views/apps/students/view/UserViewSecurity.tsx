import LoadingButton from "@mui/lab/LoadingButton"
import { Box, Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { today } from "src/@core/components/card-statistics/kanban-item"
import Form from "src/@core/components/form"
import IconifyIcon from "src/@core/components/icon"
import DataTable from "src/@core/components/table"
import useResponsive from "src/@core/hooks/useResponsive"
import api from "src/@core/utils/api"
import { formatDateTime } from "src/@core/utils/date-formatter"
import { formatCurrency } from "src/@core/utils/format-currency"
import getMontName from "src/@core/utils/gwt-month-name"
import showResponseError from "src/@core/utils/show-response-error"
import usePayment from "src/hooks/usePayment"
import { customTableProps } from "src/pages/groups"
import { useAppDispatch, useAppSelector } from "src/store"
import { fetchStudentPayment } from "src/store/apps/students"

// Rasm yuklab olish misoli
export async function downloadImage(filename: string, url: string) {
  await fetch(url, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    }
  })
    .then(response => response.blob())
    .then(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    })
    .catch(console.error);
}


const UserViewSecurity = ({ groupData }: any) => {

  const { t } = useTranslation()
  const { query } = useRouter()
  const [data, setData] = useState([])
  const { isMobile } = useResponsive()
  const [edit, setEdit] = useState<any>(null)
  const [deleteId, setDelete] = useState<any>(null)
  const [error, setError] = useState<any>({})
  const [loading, setLoading] = useState<any>(null)

  const dispatch = useAppDispatch()
  const { payments, isLoading } = useAppSelector(state => state.students)

  const { paymentMethods, getPaymentMethod, updatePayment, deletePayment } = usePayment()

  const handleEdit = (id: any) => {
    setEdit(data.find((el: any) => el.id === id))
  }

  async function getReceipt(id: any) {
    setLoading(true)
    const subdomain = location.hostname.split('.')
    try {
      await downloadImage(`receipt-${new Date().getTime()}.pdf`, `${process.env.NODE_ENV === 'development' ? process.env.NEXT_PUBLIC_TEST_BASE_URL : subdomain.length < 3 ? `https://${process.env.NEXT_PUBLIC_BASE_URL}` : `https://${subdomain[0]}.${process.env.NEXT_PUBLIC_BASE_URL}`}/api/v1/common/generate-check/${id}/`)
      // await downloadImage(`receipt-${new Date().getTime()}.pdf`, `http://192.168.1.48:8000/api/v1/common/generate-check/${id}/`)
      setLoading(false)
    } catch (err) {
      console.log(err)
    }
  }

  const columns: customTableProps[] = [
    {
      xs: 0.2,
      title: t("ID"),
      dataIndex: 'id'
    },
    {
      xs: 0.8,
      title: t("Sana"),
      dataIndex: 'payment_date',
      // render: (date: string) => formatDateTime(date)
    },
    {
      xs: 0.7,
      title: t("Summa"),
      dataIndex: 'amount',
      render: (amount) => `${formatCurrency(amount)} UZS`
    },
    {
      xs: 1,
      title: t("Izoh"),
      dataIndex: 'description',
    },
    {
      xs: 1,
      title: t("Qabul qildi"),
      dataIndex: 'admin',
    },
    {
      xs: 1,
      title: t("Amallar"),
      dataIndex: 'id',
      render: (id) => (
        <Box sx={{ display: 'flex', gap: '10px' }}>
          <IconifyIcon onClick={() => handleEdit(id)} icon='mdi:pencil-outline' fontSize={20} />
          <IconifyIcon onClick={() => setDelete(id)} icon='mdi:delete-outline' fontSize={20} />
          {loading ? <IconifyIcon icon={'la:spinner'} fontSize={20} /> : <IconifyIcon onClick={() => getReceipt(id)} icon={`ph:receipt-light`} fontSize={20} />}
        </Box>
      )
    }
  ]


  const onUpdatePayment = async (value: {}) => {
    setLoading(true)
    const data = {
      ...value,
      student: query?.student,
    }

    try {
      await updatePayment(edit?.id, data)
      setLoading(false)
      setEdit(null)

      return await dispatch(fetchStudentPayment(query?.student))
    } catch (err: any) {
      showResponseError(err.response.data, setError)
      setLoading(false)
    }
  }

  const onHandleDelete = async () => {
    setLoading(true)
    await deletePayment(deleteId)
    setLoading(false)
    setDelete(false)
   await  dispatch(fetchStudentPayment(query?.student))
  }

  useEffect(() => {
    dispatch(fetchStudentPayment(query?.student))
    getPaymentMethod()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Box className='demo-space-y'>
      {
        groupData && groupData.length > 0 ?
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {
              groupData.map((group: any) => (
                <Link key={group.id} href={`/groups/view/security/?id=${group.group_data.id}&month=${getMontName(null)}`} style={{ textDecoration: 'none' }}>
                  <Box sx={{ display: 'flex', gap: '20px' }} >
                    <Card sx={{ width: isMobile ? '100%' : '50%' }}>
                      <CardContent sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                          <Typography sx={{ fontSize: '12px' }}>{group.group_data.name}</Typography>
                          <Typography sx={{ fontSize: '12px' }}>{group.course.name}</Typography>
                          <Typography sx={{ fontSize: '12px' }}>{group.teacher.first_name}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: ' flex-end', gap: '5px' }}>
                          <Typography sx={{ fontSize: '12px' }}>{group.date}</Typography>
                          <Typography sx={{ fontSize: '12px' }}>Juft kunlar - {group.start_at}</Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Box></Link>
              ))
            }
          </Box> : ''
      }

      <Typography sx={{ my: 3, fontSize: '20px' }}>To'lov tarixi</Typography>
      <DataTable loading={isLoading} maxWidth="100%" minWidth="450px" data={payments} columns={columns} />


      <Dialog
        open={edit}
        onClose={() => setEdit(null)}
        aria-labelledby='user-view-edit'
        sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 450, p: [1, 3] } }}
        aria-describedby='user-view-edit-description'
      >
        <DialogTitle id='user-view-edit' sx={{ textAlign: 'center', fontSize: '1.5rem !important' }}>
          To'lovni tahrirlash
        </DialogTitle>
        <DialogContent>
          <Form setError={setError} valueTypes='json' sx={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: '10px' }} onSubmit={onUpdatePayment} id='edifsdt-employee-pay'>
            <FormControl fullWidth error={error.payment_type?.error}>
              <InputLabel size='small' id='user-view-language-label'>{t("To'lov usulini tanlang")}</InputLabel>
              <Select
                size='small'
                label={t("To'lov usulini tanlang")}
                id='user-view-language'
                labelId='user-view-language-label'
                name='payment_type'
                defaultValue={edit?.payment_type}
              >
                {
                  paymentMethods.map((branch: any) => <MenuItem key={branch.id} value={branch.id}>{branch.name}</MenuItem>)
                }
              </Select>
              <FormHelperText error={error.payment_type?.error}>{error.payment_type?.message}</FormHelperText>
            </FormControl>

            <FormControl fullWidth>
              <TextField
                error={error?.amount}
                rows={4}
                label="Miqdori (so'm)"
                size='small'
                name='amount'
                defaultValue={edit?.amount}
                type='number'
              />
              <FormHelperText error={error.amount}>{error.amount?.message}</FormHelperText>
            </FormControl>

            <FormControl fullWidth>
              <TextField
                error={error?.description}
                rows={4}
                multiline
                label="Izoh"
                name='description'
                defaultValue={edit?.description}
              />
              <FormHelperText error={error.description}>{error.description?.message}</FormHelperText>
            </FormControl>

            <FormControl sx={{ width: '100%' }}>
              <input type="date" style={{ borderRadius: '8px', padding: '10px', outline: 'none', border: '1px solid gray', marginTop: '10px' }} name='payment_date' defaultValue={today} />
              <FormHelperText defaultValue={edit?.payment_date} error={error.payment_date?.error}>{error.payment_date?.message}</FormHelperText>
            </FormControl>


            <DialogActions sx={{ justifyContent: 'center' }}>
              <LoadingButton loading={loading} type='submit' variant='contained' sx={{ mr: 1 }}>
                {t("Saqlash")}
              </LoadingButton>
              <Button variant='outlined' type='button' color='secondary' onClick={() => setEdit(null)}>
                {t("Bekor Qilish")}
              </Button>
            </DialogActions>
          </Form>
        </DialogContent>
      </Dialog>


      <Dialog
        open={deleteId}
        onClose={() => setDelete(null)}
        aria-labelledby='user-view-edit'
        sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 350, p: [1, 3] } }}
        aria-describedby='user-view-edit-description'
      >
        <DialogTitle id='user-view-edit' sx={{ textAlign: 'center', fontSize: '1.5rem !important' }}>
          To'lovni o'chirishni tasdiqlang
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button onClick={() => setDelete(null)}>{t("Bekor qilish")}</Button>
            <LoadingButton variant="outlined" color="error" onClick={onHandleDelete} loading={loading}>{t("O'chirish")}</LoadingButton>
          </Box>
        </DialogContent>
      </Dialog>
    </Box >
  )
}

export default UserViewSecurity
