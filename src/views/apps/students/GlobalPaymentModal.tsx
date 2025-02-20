import { Dialog, DialogContent, DialogTitle } from '@mui/material'
import { useAppDispatch, useAppSelector } from 'src/store'
import { setGlobalPay } from 'src/store/apps/students'
import GlobalPaymentForm from './GlobalPaymentForm'
import { disablePage } from 'src/store/apps/page'
import { useTranslation } from 'react-i18next'
import api from 'src/@core/utils/api'
import { useEffect, useState } from 'react'

type Props = {}

export default function GlobalPaymentModal({ }: Props) {

    const { global_pay } = useAppSelector(state => state.students)
    const dispatch = useAppDispatch()
  
    
    function closeModal() {
        dispatch(setGlobalPay(false))
        dispatch(disablePage(false))
    }
    const { t } = useTranslation()

    return (
        <div>
            <Dialog open={global_pay} onClose={closeModal}>
                <DialogTitle sx={{ textAlign: 'center' }}>{t("O'quvchi uchun to'lov")}</DialogTitle>
                <DialogContent sx={{ minWidth: '450px', padding: '0 20px 40px' }}>
                    <GlobalPaymentForm />
                </DialogContent>
            </Dialog>
        </div>
    )
}