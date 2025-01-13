import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from 'src/@core/utils/api';

export default function QRCodeScanner() {
  const [scannedCode, setScannedCode] = useState(''); // State to store the scanned code
  const [isScanning, setIsScanning] = useState(false); // Indicate scanning activity

  const handleSendQrCode = async (code:any) => {
    if (code) {
      try {
        const res = await api.post(`common/attendance/by-qr-code/${code}/`);
        if (res.status === 200) {
          toast.success('Muvaffaqiyatli', {
            style: { zIndex: 999999999 },
          });
        }
      } catch (err:any) {
        console.error(err);
        if (err.response?.status === 404) {
          toast.error("Ma'lumot topilmadi");
        } else {
          toast.error(err.response?.data?.msg || 'Xatolik yuz berdi');
        }
      } finally {
        setScannedCode(''); // Reset scanned code after processing
        setIsScanning(false);
      }
    }
  };

  useEffect(() => {
    const handleKeyPress = (event:any) => {
      setIsScanning(true);

      if (event.key === 'Enter') {
        if (scannedCode) {
          handleSendQrCode(scannedCode);
        }
      } else {
        setScannedCode((prev) => prev + event.key);
      }
    };

    window.addEventListener('keypress', handleKeyPress);

    return () => {
      window.removeEventListener('keypress', handleKeyPress);
    };
  }, [scannedCode]);

  return (
    <div>
      {/* <h1>QR Code Scanner</h1>
      <p>
        <strong>Status:</strong> {isScanning ? 'Scanning...' : 'Idle'}
      </p>
      <p>
        <strong>Scanned Code:</strong> {scannedCode || 'None'}
      </p> */}
    </div>
  );
}
