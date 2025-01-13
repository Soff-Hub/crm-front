import { useRouter } from "next/router";
import { useState } from "react"
import api from "src/@core/utils/api";
import ceoConfigs from "src/configs/ceo"

export interface StudentTypes {
    id: string | number
    first_name: string
    phone: string
    school_data: {
        id: number,
        name:string
    }
    birth_date: string
    gender: 'male' | 'female'
    body: string
    start_date: string
    end_date: string
    balance: string
    groups: {
        id: string | number
        group_data: {
            id: number
            name: string
        }
        course_name: string
        start_at: string
        date: string
        teacher: {
            id: number | string
            first_name: string
            phone: string
        }
    }[]
    comments: {
        id: string | number
        created_at: string
        description: string
    }[]
}

export default function useStudent() {
    const [students, setStudents] = useState<{ count: number, data: StudentTypes[] }>({ count: 0, data: [] })
    const [studentData, setStudentData] = useState<StudentTypes | null>(null)
    const { query } = useRouter()

    const getStudents = async (search: string) => {
        try {
            const resp = await api.get(ceoConfigs.students, { params: { ...query, search } })
            setStudents({
                count: resp.data.count,
                data: resp.data.results
            })
        } catch (err) {
            return err
        }
    }

    const getStudentById = async (id: any) => {
        try {
            const resp = await api.get(ceoConfigs.students_detail + id)
            setStudentData(resp.data)

            return resp.data
        } catch (err) {
            return Promise.reject(err)
        }
    }

    const updateStudent = async (id: any, data: any) => {
        try {
            const resp = await api.patch(ceoConfigs.students_update + id, data)

            return resp.data
        } catch (err) {
            return Promise.reject(err)
        }
    }

    const createStudent = async (data: any) => {
        try {
            return await api.post(ceoConfigs.students_create, data)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    const deleteStudent = async (id: any) => {
        try {
            const resp = await api.post(ceoConfigs.students_delete, { pk: +id })

            return resp.data
        } catch (err) {
            return err
        }
    }

    return { getStudents, students, getStudentById, studentData, updateStudent, setStudentData, createStudent, deleteStudent }
}
