import axios, { AxiosError } from 'axios'
import { NextApiRequest, NextApiResponse } from 'next/types'
import { store } from 'src/store'

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const state = store.getState()
  try {
    const resp = await axios.post('http://192.168.1.45:8001/api/v1/auth/login/', req.body)
    res.status(200).json({ success: true })
  } catch (err: any) {
    res.status(400).send(err?.response?.data)
  }
}
