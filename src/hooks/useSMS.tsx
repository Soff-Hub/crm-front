import { useState } from "react"
import api from "src/@core/utils/api";


export default function useSMS() {
    const [smsTemps, setSMSTemps] = useState<[]>([])

    const getSMSTemps = async () => {
        try {
            const resp = await api.get('common/sms-form/list/')
            setSMSTemps(resp.data)
        } catch (err) {
            return err
        }
    }


    return { getSMSTemps, smsTemps }
}
