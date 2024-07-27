import LoadingButton from "@mui/lab/LoadingButton";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import EmptyContent from "src/@core/components/empty-content";
import IconifyIcon from "src/@core/components/icon";
import DataTable from "src/@core/components/table";
import useResponsive from "src/@core/hooks/useResponsive";
import { formatCurrency } from "src/@core/utils/format-currency";
import getMontName from "src/@core/utils/gwt-month-name";
import usePayment from "src/hooks/usePayment";
import { customTableProps } from "src/pages/groups";
import { useAppDispatch, useAppSelector } from "src/store";
import { fetchStudentDetail, fetchStudentPayment } from "src/store/apps/students";
import StudentPaymentEditForm from "./StudentPaymentEdit";

// Rasm yuklab olish misoli
export async function downloadImage(filename: string, url: string) {
  await fetch(url, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    }
  })
    .then(response => response.blob())
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'fileName';
      a.style.position = 'fixed';
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    })
    .catch(console.error);
}


const UserViewSecurity = ({ groupData }: any) => {

  const { t } = useTranslation()
  const { query } = useRouter()
  const { isMobile } = useResponsive()
  const [edit, setEdit] = useState<any>(null)
  const [deleteId, setDelete] = useState<any>(null)
  const [loading, setLoading] = useState<any>(null)
  const [amount, setAmount] = useState<any>('')

  const dispatch = useAppDispatch()
  const { payments, isLoading } = useAppSelector(state => state.students)

  const { getPaymentMethod, deletePayment } = usePayment()

  const handleEdit = (id: any) => {
    setAmount(payments.find((el: any) => el.id === id)?.amount)
    setEdit(payments.find((el: any) => el.id === id))
  }

  const handlePrint = async (id: number | string) => {
    const subdomain = location.hostname.split('.');
    try {
      const response = await fetch(
        `${process.env.NODE_ENV === 'development' ? process.env.NEXT_PUBLIC_TEST_BASE_URL : subdomain.length < 3 ? `https://${process.env.NEXT_PUBLIC_BASE_URL}` : `https://${subdomain[0]}.${process.env.NEXT_PUBLIC_BASE_URL}`}/common/generate-check/${id}/`,
        {
          method: "GET",
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          },
        }
      );
      const data = await response.blob();
      const blobUrl = URL.createObjectURL(data);
      const printFrame: HTMLIFrameElement | null = document.getElementById("printFrame") as HTMLIFrameElement;
      if (printFrame) {
        printFrame.src = blobUrl;
        printFrame.onload = function () {
          if (printFrame.contentWindow) {
            printFrame.contentWindow?.print();
          }
        };
      }
    } catch (error) {
      console.error("Print error:", error);
    }
  };

  async function getReceipt(id: any) {
    setLoading(id)
    try {
      await handlePrint(id)
    } catch (err) {
      console.log(err)
    }
    setLoading(null)
  }

  const columns: customTableProps[] = [
    {
      xs: 0.2,
      title: t("ID"),
      dataIndex: 'id'
    },
    {
      xs: 0.6,
      title: t("Sana"),
      dataIndex: 'payment_date',
    },
    {
      xs: 0.6,
      title: t("Turi"),
      dataIndex: 'is_debtor',
      render: (debtor) => <Chip size="small" label={debtor ? "To'landi" : "Qarzdorlik"} color={debtor ? 'success' : 'error'} />
    },
    {
      xs: 0.7,
      title: t('Summa'),
      dataIndex: 'amount',
      render: (amount) => Number(amount) <= 0 ? `${formatCurrency(Number(amount) * (-1))} UZS` : `${formatCurrency(amount)} UZS`
    },
    {
      xs: 1,
      title: t("Guruh"),
      dataIndex: 'group_name',
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
      xs: 0.2,
      title: t("Amallar"),
      dataIndex: 'amount',
      renderId: (id, src) => (
        <Box sx={{ display: 'flex', gap: '10px' }}>
          <IconifyIcon onClick={() => handleEdit(id)} icon='mdi:pencil-outline' fontSize={20} />
          {Number(src) < 0 ? "" : <IconifyIcon onClick={() => setDelete(id)} icon='mdi:delete-outline' fontSize={20} />}
          {Number(src) < 0 ? "" : loading === id ? <IconifyIcon icon={'la:spinner'} fontSize={20} /> : <IconifyIcon onClick={() => getReceipt(id)} icon={`ph:receipt-light`} fontSize={20} />}
        </Box>
      )
    }
  ]

  const onHandleDelete = async () => {
    setLoading(true)
    await deletePayment(deleteId)
    setLoading(false)
    setDelete(false)
    await dispatch(fetchStudentPayment(query?.student))
    await dispatch(fetchStudentDetail(Number(query?.student)))
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
                      <CardContent sx={{ display: 'flex', justifyContent: 'space-between', margin: '0', py: '10px' }}>
                        <Chip label={`${formatCurrency(group.group_data.balance)} so'm`} size="small" variant='outlined' color={group.group_data.balance >= 0 ? 'success' : 'error'} />
                        <Chip label={`${t(group.status)}`} size="small" variant='outlined' color={group.status === 'active' ? 'success' : group.status === 'new' ? 'warning' : 'error'} />
                      </CardContent >
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
                    </Card >
                  </Box >
                </Link >
              ))
            }
          </Box> : <EmptyContent />
      }

      <Typography sx={{ my: 3, fontSize: '20px' }}>To'lov tarixi</Typography>
      <DataTable color loading={isLoading} maxWidth="100%" minWidth="450px" data={payments.map(el => ({ ...el, color: Number(el.amount) >= 0 ? 'transparent' : 'rgba(227, 18, 18, 0.1)', is_debtor: Number(el.amount) >= 0 }))} columns={columns} />

      <iframe src="" id="printFrame" style={{ height: 0 }}></iframe>

      <StudentPaymentEditForm openEdit={edit} setOpenEdit={setEdit} />

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
