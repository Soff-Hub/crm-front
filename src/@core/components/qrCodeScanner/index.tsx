import { useState, useEffect, useRef } from 'react'
import toast from 'react-hot-toast'
import api from 'src/@core/utils/api'

export default function QRCodeScanner() {
  const [isProcessing, setIsProcessing] = useState(false)
  const scannedCodeRef = useRef('')
  const debounceTimer = useRef<NodeJS.Timeout | null>(null)

  const handleSendQrCode = async (code: string) => {
    if (!code || isProcessing) return

    try {
      setIsProcessing(true)
      const res = await api.post(`common/attendance/by-qr-code?${code}/`)
      if (res.status === 200) {
        toast.success('Muvaffaqiyatli', { style: { zIndex: 999999999 } })
      }
    } catch (err: any) {
      console.error(err)
      if (err.response?.status === 404) {
        toast.error("Ma'lumot topilmadi")
      } else {
        toast.error(err.response?.data?.msg || 'Xatolik yuz berdi')
      }
    } finally {
      scannedCodeRef.current = ''
      setIsProcessing(false)
    }
  }

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (isProcessing) return

      const key = event.key
      if (key === 'Enter') {
        handleSendQrCode(scannedCodeRef.current)
      } else {
        scannedCodeRef.current += key

        if (debounceTimer.current) {
          clearTimeout(debounceTimer.current)
        }

        debounceTimer.current = setTimeout(() => {
          handleSendQrCode(scannedCodeRef.current)
        }, 500)
      }
    }

    window.addEventListener('keypress', handleKeyPress)

    return () => {
      window.removeEventListener('keypress', handleKeyPress)
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [isProcessing])

  return (
    <div>
      {/* <h1>QR Code Scanner</h1>
      <p>
        <strong>Status:</strong> {isProcessing ? 'Processing...' : 'Waiting for input...'}
      </p>
      <p>
        <strong>Scanned Code:</strong> {scannedCodeRef.current || 'None'}
      </p> */}
    </div>
  )
}
