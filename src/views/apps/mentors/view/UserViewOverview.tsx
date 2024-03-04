// ** MUI Imports
import Grid from '@mui/material/Grid'


// ** Types

// ** Demo Component Imports
import UsersProjectListTable from 'src/views/apps/mentors/view/UsersProjectListTable'




const UserViewOverview = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <UsersProjectListTable />
      </Grid>
    </Grid>
  )
}

export default UserViewOverview
