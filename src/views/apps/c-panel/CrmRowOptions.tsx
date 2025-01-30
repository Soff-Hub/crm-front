import { IconButton, Menu } from '@mui/material'
import { MouseEvent, useState } from 'react'
import IconifyIcon from 'src/@core/components/icon'
import MenuItem from '@mui/material/MenuItem'
import UserSuspendDialog from 'src/views/apps/mentors/view/UserSuspendDialog'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-hot-toast'
import { useAppDispatch } from 'src/store'
import { disablePage } from 'src/store/apps/page'
import { deleteCRM, deleteCRMPayment, fetchCRMPayments, handleEditClientPayment } from 'src/store/apps/c-panel'
import Router from 'next/router'
import { StudentsPaymentsModal } from 'src/@core/components/c-panel/DeleteStudentsPayments'
import { AddStudentModal } from 'src/@core/components/c-panel/AddStudentModal'

const CrmRowOptions = ({ id }: { id: number | string }) => {
  const { t } = useTranslation()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [suspendDialogOpen, setSuspendDialogOpen] = useState<boolean>(false)
  const dispatch = useAppDispatch()
    const [openStudentPaymentsModal, setOpenStudentsPaymentsModal] = useState(false)
    const [openStudentAddModal, setOpenStudentAddModal] = useState(false)

  const [loading, setLoaading] = useState<boolean>(false)
  const rowOptionsOpen = Boolean(anchorEl)

  const handleRowOptionsClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleRowOptionsClose = () => {
    setAnchorEl(null)
  }

  const handleDelete = () => {
    handleRowOptionsClose()
    setSuspendDialogOpen(true)
  }

  const handleDeleteCrm = async (id: string | number) => {
    setLoaading(true)
    dispatch(disablePage(true))
    const resp = await dispatch(deleteCRM(id))
    if (resp.meta.requestStatus === 'rejected') {
      toast.error(`${resp.payload?.msg}`, { position: 'top-center' })
    } else {
      toast.success(`${t("O'quv markaz ro'yxatidan o'chirildi")}`, { position: 'top-center' })
      Router.push('/c-panel')
    }
    setLoaading(false)
    dispatch(disablePage(false))
  }

  const handleEdit = async (id: any) => {
    dispatch(handleEditClientPayment(id))
    handleRowOptionsClose()
  }

  return (
    <>
      <IconButton size='small' onClick={handleRowOptionsClick}>
        <IconifyIcon icon='mdi:dots-vertical' />
      </IconButton>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={rowOptionsOpen}
        onClose={handleRowOptionsClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        PaperProps={{ style: { minWidth: '8rem' } }}
      >
        <MenuItem onClick={() => Router.push('/c-panel/company/edit')} sx={{ '& svg': { mr: 2 } }}>
          <IconifyIcon icon='mdi:pencil-outline' fontSize={20} />
          {t('Tahrirlash')}
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ '& svg': { mr: 2 } }}>
          <IconifyIcon icon='mdi:delete-outline' fontSize={20} />
          {t("O'chirish")}
        </MenuItem>
        <MenuItem onClick={() => setOpenStudentsPaymentsModal(true)} sx={{ '& svg': { mr: 2 } }}>
          <IconifyIcon icon='mdi:cash-multiple' fontSize={20} />
          {t("O'quvchilari to'lovi")}
              </MenuItem>
              <MenuItem onClick={()=>setOpenStudentAddModal(true)} sx={{ '& svg': { mr: 2 } }}>
          <IconifyIcon icon="mdi:account-plus" fontSize={20} />
          {t("O'quvchi qo'shish")}
        </MenuItem>
      </Menu>
      <UserSuspendDialog
        loading={loading}
        handleOk={() => handleDeleteCrm(id)}
        open={suspendDialogOpen}
        setOpen={setSuspendDialogOpen}
      />
          <StudentsPaymentsModal id={id} openModal={openStudentPaymentsModal} setOpenModal={setOpenStudentsPaymentsModal} />
          <AddStudentModal id={id} openModal={openStudentAddModal} setOpenModal={setOpenStudentAddModal} />

    </>
  )
}

export default CrmRowOptions
