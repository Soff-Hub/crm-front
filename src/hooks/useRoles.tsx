import { useEffect, useState } from "react"
import api from "src/@core/utils/api";


export default function useRoles() {
    const [roles, setRoles] = useState<{ id: any, name: string }[]>([])

    const getRoles = async () => {
        try {
            const resp = await api.get('auth/role-list')
            setRoles(resp.data.results)
        } catch (err) {
            return err
        }
    }

    useEffect(() => {
        getRoles()
    }, [])

    return { getRoles, roles }
}
