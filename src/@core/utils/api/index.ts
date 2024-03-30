import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL
import authConfg from 'src/configs/auth'

const api = axios.create({
    baseURL
})

api.interceptors.request.use(
    (config: any) => {

        const storedToken = localStorage.getItem(authConfg.storageTokenKeyName)

        if (storedToken) {
            config.headers['Authorization'] = `Bearer ${storedToken}`
            config.headers['Accept-Language'] = `uz`
        }

        return config
    },
    (err) => err
)

export default api