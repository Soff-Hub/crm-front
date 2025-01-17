import { Button } from '@mui/material'
import { VscodeIconsFileTypeExcel2 } from './ExcelIcon'
import api from 'src/@core/utils/api'

interface ExcelProps {
  queryString?: string
  url: string
  variant?: 'text' | 'outlined' | 'contained'
  color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning'
  size?: 'small' | 'medium' | 'large'
  args?: any
}

export default function ExcelStudents({
  queryString = '',
  variant = 'outlined',
  color = 'success',
  size = 'small',
  url,
  ...args
}: ExcelProps) {
  const handleDownload = async () => {
    try {
      const response = await api.get(`${url}?${queryString}&export=true`)
      const { download_url } = response.data

      if (download_url) {
        const fullUrl = download_url.startsWith('http')
          ? download_url // Already absolute
          : `http://${download_url}` // Add `http://` to make it absolute

        // Create a link element and trigger the download
        const link = document.createElement('a')
        link.href = fullUrl
        link.setAttribute('download', '') // Optional: Specify filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } else {
        console.error('No download URL provided by the backend')
      }
    } catch (error) {
      console.error('Failed to download the file:', error)
    }
  }

  return (
    <Button
      onClick={handleDownload}
      startIcon={<VscodeIconsFileTypeExcel2 />}
      {...args}
      variant={variant}
          color={color}
          fullWidth
    >
      Excel
    </Button>
  )
}
