import { useState } from "react"
import api from "src/@core/utils/api";

// interface BranchTypes {
//     id: string,
//     name: string
// }

export default function usePayment() {
    const [paymentMethods, setPaymentMethods] = useState<any>([])
    const [paymentData, setPaymentData] = useState<any>(null)

    const getPaymentMethod = async () => {
        try {
            const resp = await api.get('payment-type/list/')
            setPaymentMethods(resp.data.results)
        } catch (err) {
            return err
        }
    }

    const createPaymentMethod = async (data: any) => {
        try {
            await api.post('payment-type/create/', data)
        } catch (err) {
            return err
        }
    }

    const createPayment = async (data: any) => {
        try {
            await api.post('student-payment/create/', data)
        } catch (err) {
            return err
        }
    }

    const getPaymentList = async (id: any) => {
        try {
            const resp = await api.get('student-payment/list/' + id)
            setPaymentData(resp.data)
        } catch (err) {
            return err
        }
    }

    return { getPaymentMethod, paymentMethods, createPaymentMethod, paymentData, getPaymentList, createPayment }
}
