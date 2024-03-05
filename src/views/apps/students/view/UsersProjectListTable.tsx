// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'



// interface CellType {
//   row: ProjectListDataType
// }
// const Img = styled('img')(({ theme }) => ({
//   width: 32,
//   height: 32,
//   borderRadius: '50%',
//   marginRight: theme.spacing(3)
// }))

const InvoiceListTable = () => {
  // ** State
  const [value, setValue] = useState<string>('')

 
  return (
    <Card>
      <CardHeader title="User's Projects List" />
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          <Typography variant='body2' sx={{ mr: 2 }}>
            Search:
          </Typography>
          <TextField size='small' placeholder='Search Project' value={value} onChange={e => setValue(e.target.value)} />
        </Box>
      </CardContent>
    </Card>
  )
}

export default InvoiceListTable
