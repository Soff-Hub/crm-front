import { IconButton, Menu, Typography } from '@mui/material'
import { MouseEvent, useState } from 'react'
import IconifyIcon from 'src/@core/components/icon'
import MenuItem from '@mui/material/MenuItem'
import Link from 'next/link'
import UserSuspendDialog from 'src/views/apps/mentors/view/UserSuspendDialog'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-hot-toast'
import { useAppDispatch, useAppSelector } from 'src/store'

import { disablePage } from 'src/store/apps/page'
import { editEmployeeStatus } from 'src/store/apps/settings'
import { fetchInvestments, setOpenEdit } from 'src/store/apps/finance/investments'
import api from 'src/@core/utils/api'

const InvestmentRowOptions = ({ id }: { id: number | string }) => {
  const { t } = useTranslation()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [suspendDialogOpen, setSuspendDialogOpen] = useState<boolean>(false)
  const { queryParams } = useAppSelector(state => state.mentors)
  const dispatch = useAppDispatch()

  const [loading, setLoading] = useState<boolean>(false)
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

  const handleDeleteInvestment = async (id: string | number) => {
    setLoading(true)
    dispatch(disablePage(true))
    await api.delete(`common/finance/investment/delete/${id}/`).then(res => {
      try {
        if (res.status == 204) {
          setLoading(false)
          const queryString = new URLSearchParams(
            Object.fromEntries(Object.entries(queryParams).map(([key, value]) => [key, String(value)]))
          ).toString()
          dispatch(fetchInvestments(queryString))
          toast.success(`${t("Investitsiya o'chirildi")}`, { position: 'top-center' })
        }
      } catch (error: any) {
        setLoading(false)
        toast.error(error)
      }
    })

    dispatch(disablePage(false))
  }

  const handleEdit = async (id: any) => {
    dispatch(setOpenEdit('edit'))
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
        <>
          <MenuItem onClick={() => handleEdit(id)} sx={{ '& svg': { mr: 2 } }}>
            <IconifyIcon icon='mdi:pencil-outline' fontSize={20} />
            {t('Tahrirlash')}
          </MenuItem>
          <MenuItem onClick={handleDelete} sx={{ '& svg': { mr: 2 } }}>
            <IconifyIcon icon='mdi:delete-outline' fontSize={20} />
            {t("O'chirish")}
          </MenuItem>
        </>
      </Menu>
      <UserSuspendDialog
        loading={loading}
        handleOk={() => handleDeleteInvestment(id)}
        open={suspendDialogOpen}
        setOpen={setSuspendDialogOpen}
      />
    </>
  )
}

export default InvestmentRowOptions