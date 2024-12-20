// ** MUI Imports
import Grid from '@mui/material/Grid'
import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import VideoHeader, { videoUrls } from 'src/@core/components/video-header/video-header'
import { AuthContext } from 'src/context/AuthContext'
import useEmployee from 'src/hooks/useEmployee'

// ** Types
import { InvoiceType } from 'src/types/apps/invoiceTypes'

// ** Demo Components Imports
import UserViewLeft from 'src/views/apps/settings/ceo/view/UserViewLeft'

type Props = {
  tab: string
  invoiceData: InvoiceType[]
}

const UserView = ({ }: Props) => {
  const router = useRouter()
  const { push } = useRouter()
  const { user } = useContext(AuthContext)
  // hooks
  const { getEmployeeById, employeeData } = useEmployee()

  useEffect(() => {
    if (!user?.role.includes('ceo') && !user?.role.includes('admin') && !user?.role.includes('watcher')) {
      push("/")
      toast.error("Sizda bu sahifaga kirish huquqi yo'q!")
    }
    getEmployeeById(router.query.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <VideoHeader item={videoUrls.employees} />

      <Grid container spacing={6}>
        <Grid item xs={12} md={5} lg={4}>
          <UserViewLeft userData={employeeData} />
        </Grid>
        <Grid item xs={12} md={7} lg={8}>
          {/* <UserViewRight tab={tab} invoiceData={invoiceData} /> */}
        </Grid>
      </Grid>
    </div>
  )
}

export default UserView
