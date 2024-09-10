import { useState } from "react";
import api from "src/@core/utils/api";

interface BranchTypes {
    id: string,
    name: string
}

export default function useCourses() {
    const [courses, setCourses] = useState<BranchTypes[]>([])

    const getCourses = async () => {
        try {
            const resp = await api.get("common/course/checklist/")
            setCourses(resp.data)
        } catch (err) {
            return err
        }
    }

    return { getCourses, courses }
}
