import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import api from 'src/@core/utils/api'

export default function QRCodeScanner() {
  const [scannedCode, setScannedCode] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSendQrCode = async (code: string) => {
    if (!code) return

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
      if (isProcessing) return // Avoid processing if already handling a code
      const key = event.key

      if (key === 'Enter') {
        // Process scanned code
        handleSendQrCode(scannedCode)
      } else {
        // Add the key to the scanned code
        setScannedCode(prev => prev + key)

        // Automatically process the code after 500ms of inactivity
        clearTimeout(timer)
        timer = setTimeout(() => {
          handleSendQrCode(scannedCode)
        }, 500)
      }
    }

    window.addEventListener('keypress', handleKeyPress)

    return () => {
      window.removeEventListener('keypress', handleKeyPress)
      clearTimeout(timer) // Clear timer on component unmount
    }
  }, [scannedCode, isProcessing])

  return (
    <div>
      {/* Optional UI for debugging or status */}
      {/* <h1>QR Code Scanner</h1>
      <p>
        <strong>Status:</strong> {isProcessing ? 'Processing...' : 'Waiting for input...'}
      </p>
      <p>
        <strong>Scanned Code:</strong> {scannedCode || 'None'}
      </p> */}
    </div>
  )
}
