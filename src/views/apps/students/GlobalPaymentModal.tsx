import { Dialog, DialogContent, DialogTitle } from '@mui/material'
import React from 'react'
import { useAppDispatch, useAppSelector } from 'src/store'
import { setGlobalPay } from 'src/store/apps/students'
import GlobalPaymentForm from './GlobalPaymentForm'
import { disablePage } from 'src/store/apps/page'

type Props = {}

export default function GlobalPaymentModal({ }: Props) {

    const { global_pay } = useAppSelector(state => state.students)
    const dispatch = useAppDispatch()

    function closeModal() {
        dispatch(setGlobalPay(false))
        dispatch(disablePage(false))
    }

    return (
        <div>
            <Dialog open={global_pay} onClose={closeModal}>
                <DialogTitle sx={{ textAlign: 'center' }}>O'quvchi uchun to'lov</DialogTitle>
                <DialogContent sx={{ minWidth: '450px', padding: '0 20px 40px' }}>
                    <GlobalPaymentForm />
                </DialogContent>
            </Dialog>
        </div>
    )
}