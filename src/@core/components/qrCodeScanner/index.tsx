import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import api from 'src/@core/utils/api'

export default function QRCodeScanner() {
  const [scannedCode, setScannedCode] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

  const handleSendQrCode = async (code: string) => {
    if (!uuidRegex.test(code)) return

    try {
      setIsProcessing(true)
      const res = await api.post(`common/attendance/by-qr-code/${code}/`)
      if (res.status === 200) {
        toast.success('Muvaffaqiyatli', {
          style: { zIndex: 999999999 }
        })
      }
    } catch (err: any) {
      console.error(err)
      if (err.response?.status === 404) {
        toast.error("Ma'lumot topilmadi")
      } else {
        toast.error(err.response?.data?.msg || 'Xatolik yuz berdi')
      }
    } finally {
      setScannedCode('')
      setIsProcessing(false)
    }
  }

  useEffect(() => {
    let timer: NodeJS.Timeout

    const handleKeyPress = (event: KeyboardEvent) => {
      if (isProcessing) return
      const key = event.key

      if (key === 'Enter') {
        if (uuidRegex.test(scannedCode)) {
          handleSendQrCode(scannedCode)
        } else {
          toast.error(`${scannedCode}`)
          setScannedCode('')
        }
      } else {
        setScannedCode(prev => prev + key)

        clearTimeout(timer)
        timer = setTimeout(() => {
          if (uuidRegex.test(scannedCode)) {
            handleSendQrCode(scannedCode)
          } else {
            setScannedCode('')
          }
        }, 500)
      }
    }

    window.addEventListener('keypress', handleKeyPress)

    return () => {
      window.removeEventListener('keypress', handleKeyPress)
      clearTimeout(timer)
    }
  }, [scannedCode, isProcessing])

  return <div />
}
