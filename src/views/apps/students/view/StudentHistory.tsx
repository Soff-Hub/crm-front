import { Box } from "@mui/material"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import api from "src/@core/utils/api"

interface IStudentHistory {
    count: number
    next: string | null
    previous: string | null
    results: {
        description: string
        id: number
    }[]
}

export default function StudentHistory() {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState<null | IStudentHistory>(null)
    const { query } = useRouter()

    const getHistory = async () => {
        setLoading(true)
        try {
            const resp = await api.get(`auth/student/logs/${query.student}/`)
            setData(resp.data)
            setLoading(false)
        } catch (err: any) {
            setLoading(false)
        }
    }

    useEffect(() => {
        getHistory()
    }, [])

    return (
        <Box sx={{ width: "100%" }}>
            {data?.results.map(item => (
                <Box key={item.id} sx={{ marginBottom: 5, }}>
                    <div dangerouslySetInnerHTML={{ __html: item.description }} />
                </Box>
            ))}
        </Box>
    )
}
