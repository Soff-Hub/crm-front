import { useState } from "react"
import api from "src/@core/utils/api";
import ceoConfigs from "src/configs/ceo"

interface BranchTypes {
    id: string,
    name: string
}

export default function useCourses() {
    const [courses, setCourses] = useState<BranchTypes[]>([])

    const getCourses = async () => {
        try {
            const resp = await api.get(ceoConfigs.courses)
            setCourses(resp.data.results)
        } catch (err) {
            return err
        }
    }

    return { getCourses, courses }
}
