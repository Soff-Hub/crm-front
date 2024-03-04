import { useState } from "react"
import api from "src/@core/utils/api";
import ceoConfigs from "src/configs/ceo";

interface UsersType {
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
    avatar: '/images/avatars/4.png',
}




export default function useEmployee() {
    const [employees, setEmployees] = useState([])
    const [employeeData, setEmployeeData] = useState<UsersType | undefined>(undefined)

    const getEmployees = async () => {
        try {
            const resp = await api.get(ceoConfigs.employee)
            setEmployees(resp.data.results)
        } catch (err) {
            console.log(err)
        }
    }

    const getEmployeeById = async (id: any) => {
        try {
            const resp = await api.get(ceoConfigs.employee_detail + id)
            setEmployeeData(resp.data)
            
            return resp.data
        } catch (err) {
            console.log(err)
        }
    }

    const updateEmployee = async (id: any, data: any, update: "list" | "one") => {
        try {
            const resp = await api.patch(ceoConfigs.employee_update + id, data)
            setEmployeeData(undefined)
            if (update === "list") {
                getEmployees()
            }
            else {
                return resp.data
            }
        } catch (err) {
            return Promise.reject(err)
        }
    }

    return { employees, getEmployees, getEmployeeById, employeeData, updateEmployee, setEmployeeData }
}
