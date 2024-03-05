import { useState } from "react"
import api from "src/@core/utils/api";
import ceoConfigs from "src/configs/ceo"

interface BranchTypes {
    id: string,
    name: string
}

export default function useBranches() {
    const [branches, setBranches] = useState<BranchTypes[]>([])

    const getBranches = async () => {
        try {
            const resp = await api.get(ceoConfigs.barnchs)
            setBranches(resp.data.results)
        } catch (err) {
            return err
        }
    }

    return { getBranches, branches }
}
