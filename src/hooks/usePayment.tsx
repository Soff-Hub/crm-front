import { useState } from 'react'
import api from 'src/@core/utils/api'

export default function usePayment() {
  const [paymentMethods, setPaymentMethods] = useState<any>([])
  const [paymentData, setPaymentData] = useState<any>(null)

  const getPaymentMethod = async () => {
    try {
      const resp = await api.get('common/payment-type/list/')
      setPaymentMethods(resp.data.results)
    } catch (err) {
      return err
    }
  }

  const createPaymentMethod = async (data: any) => {
    try {
      await api.post('common/payment-type/create/', data)

      return true
    } catch (err) {
      return Promise.reject(err)
    }
  }

  const updatePaymentMethod = async (id: any, data: any) => {
    try {
      await api.patch(`common/payment-type/update/${id}/`, data)
      getPaymentMethod()

      return true
    } catch (err) {
      return Promise.reject(err)
    }
  }

  const getPaymentList = async (id: any) => {
    try {
      const resp = await api.get('common/student-payment/list/' + id + '/')
      setPaymentData(resp.data)
    } catch (err) {
      return err
    }
  }

  const createPayment = async (data: any) => {
    try {
      return (await api.post('common/student-payment/create/', data)).data
    } catch (err) {
      return Promise.reject(err)
    }
  }

  const updatePayment = async (id: any, data: any) => {
    try {
      await api.patch(`common/student-payment/${id}/`, data)
    } catch (err) {
      return Promise.reject(err)
    }
  }

  const deletePayment = async (id: any) => {
    try {
      await api.delete(`common/student-payment/delete/${id}/`)
    } catch (err) {
      return Promise.reject(err)
    }
  }

  return {
    getPaymentMethod,
    paymentMethods,
    createPaymentMethod,
    paymentData,
    getPaymentList,
    createPayment,
    updatePaymentMethod,
    updatePayment,
    deletePayment
  }
}
