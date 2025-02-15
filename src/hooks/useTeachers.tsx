import { useState } from "react"
import api from "src/@core/utils/api";
import ceoConfigs from "src/configs/ceo";

export interface TeacherType {
    id: 1,
    first_name: string,
    birth_date: string,
    password: string,
    branches: {
        id: number,
        name: string,
        exists: boolean
    }[],
    gender: 'male' | 'female',
    phone: string,
    roles: {
        id: number,
        name: string,
        exists: boolean
    }[],
    image: string | null,
    _groups: any[]
}


export default function useTeachers() {
    const [teachers, setTeachers] = useState<TeacherType[]>([])
    const [teacherData, setTeachersData] = useState<TeacherType | undefined>(undefined)
    const [loading, setLoading] = useState<boolean>(false)

    const getTeachers = async () => {
        try {
            const resp = await api.get(ceoConfigs.teachers)
            setTeachers(resp.data.results)
        } catch (err) {
            console.log(err)
        }
    }

    const getTeacherById = async (id: any) => {
        try {
            const resp = await api.get(ceoConfigs.teachers + id)
            setTeachersData(resp.data)
        } catch (err) {
            console.log(err)
        }
    }

    const createTeacher = async (data: any) => {
        setLoading(true)
        try {
            const resp = await api.post(ceoConfigs.create_teacher, data)
            setLoading(false)

            return resp.data
        } catch (err) {
            setLoading(false)

            return Promise.reject(err)
        }
    }

    const updateTeacher = async (id: any, data: any) => {
        try {
            const resp = await api.patch(ceoConfigs.employee_update + id, data)

            return resp.data
        } catch (err) {
            return Promise.reject(err)
        }
    }


    const deleteTeacher = async (id: string | number) => {
        setLoading(true)
        try {
            await api.delete(ceoConfigs.employee_delete + id)
            setTeachers((c) => (c.filter(el => el.id !== id)))
            setLoading(false)

            return true
        } catch (err) {
            setLoading(false)
            
            return Promise.reject(err)
        }
    }

    return { createTeacher, teachers, getTeachers, updateTeacher, getTeacherById, teacherData, loading, deleteTeacher, setLoading, setTeachersData }
}
