import axios from "axios";
import toast from "react-hot-toast";



import authConfg from 'src/configs/auth'

const api = axios.create()

api.interceptors.request.use(
    (config: any) => {
        const storedToken = localStorage.getItem(authConfg.storageTokenKeyName)
        const subdomain = location.hostname.split('.')
        const baseURL = subdomain.length < 3 ? `https://${process.env.NEXT_PUBLIC_BASE_URL}` : `https://${subdomain[0]}.${process.env.NEXT_PUBLIC_BASE_URL}`

        config.baseURL = baseURL

        if (storedToken) {
            config.headers['Authorization'] = `Bearer ${storedToken}`
            config.headers['Accept-Language'] = localStorage.getItem('i18nextLng')
        }

        return config
    },
    (err) => err
)

api.interceptors.response.use(
    (resp) => resp,
    (err) => {

        if (err.response && [403, 401].includes(err.response.status)) {
            toast.error(`${err.response.config.url} ${err.response.data.detail}`)
            localStorage.removeItem(authConfg.storageTokenKeyName)
            window.location.href = '/'
            return Promise.reject({ message: err.response.data })
        }

        return Promise.reject(err)
    }
)

export default api