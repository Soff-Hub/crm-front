'use client'
import type React from 'react'
import toast from 'react-hot-toast'
import api from 'src/@core/utils/api'
import { useAppDispatch } from 'src/store'

import { fetchAmoCrmPipelines, fetchDepartmentList, updateDepartmentStudent } from 'src/store/apps/leads'

interface Props {
  children: React.ReactNode
  data?: any
}

export default function DragAndDrop({ children, data }: Props) {
  const dispatch = useAppDispatch()

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const onDrop = async (e: React.DragEvent<HTMLDivElement>, department: any) => {
    e.preventDefault()
    const droppedData = JSON.parse(e.dataTransfer.getData('application/json'))

    if (droppedData?.department !== data?.id) {
      try {
        console.log('ishladi')
        const response = await api.patch(`leads/anonim-user/update/${droppedData?.id}/`, { department })
        if (response?.status === 200 || response?.status === 201) {
          toast.success('Muvaffaqiyatli ko‘chirildi')
          await dispatch(fetchAmoCrmPipelines({}))
          await dispatch(fetchDepartmentList())
        } else if (response?.status >= 400) {
          toast.error(response.data?.message || 'Xatolik yuz berdi')
        }
      } catch (error) {
        toast.error('Xatolik yuz berdi!')
      }
    }
  }

  return (
    <div className='w-100' onDragOver={onDragOver} onDrop={e => onDrop(e, data?.id)}>
      {children}
    </div>
  )
}
