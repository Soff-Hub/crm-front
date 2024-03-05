import { useState } from "react"
import api from "src/@core/utils/api";
import ceoConfigs from "src/configs/ceo"

interface BranchTypes {
    id: string,
    name: string
}

export default function useRooms() {
    const [rooms, setRooms] = useState<BranchTypes[]>([])

    const getRooms = async () => {
        try {
            const resp = await api.get(ceoConfigs.rooms)
            setRooms(resp.data.results)
        } catch (err) {
            return err
        }
    }

    return { getRooms, rooms }
}
