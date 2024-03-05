// ** MUI Imports
import { Box, Card, CardContent } from '@mui/material'


// ** Types

// ** Demo Component Imports
import { UserViewStudentsItem } from './UserViewStudentsList'


interface ItemTypes {
  data: {
    id: number
    created_at: string
    description: string
    current_user: string | null
  }[]
}



const UserViewOverview = ({ data }: ItemTypes) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {
        data ? data.map(el => (
          <Card sx={{ maxWidth: '450px' }} key={el.id}>
            <CardContent>
              <UserViewStudentsItem key={el.id} item={el} />
            </CardContent>
          </Card>

        )) : ''
      }
    </Box>
  )
}

export default UserViewOverview
