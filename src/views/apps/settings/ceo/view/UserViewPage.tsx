// ** MUI Imports
import Grid from '@mui/material/Grid'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
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

  // hooks
  const { getEmployeeById, employeeData } = useEmployee()

  useEffect(() => {
    getEmployeeById(router.query.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={5} lg={4}>
        <UserViewLeft userData={employeeData} />
      </Grid>
      <Grid item xs={12} md={7} lg={8}>
        {/* <UserViewRight tab={tab} invoiceData={invoiceData} /> */}
      </Grid>
    </Grid>
  )
}

export default UserView
