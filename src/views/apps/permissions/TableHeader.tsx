// ** React Imports
import { FormEvent, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import FormControlLabel from '@mui/material/FormControlLabel'
import { useTranslation } from 'react-i18next'

interface TableHeaderProps {
  value: string
  handleFilter: (val: string) => void
}

const TableHeader = (props: TableHeaderProps) => {
  // ** Props
  const { value, handleFilter } = props

  const {t}=useTranslation()

  // ** State
  const [open, setOpen] = useState<boolean>(false)

  const handleDialogToggle = () => setOpen(!open)

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    setOpen(false)
    e.preventDefault()
  }

  return (
    <>
      <Box
        sx={{ p: 5, pb: 3, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <TextField
          size='small'
          value={value}
          sx={{ mr: 4, mb: 2.5 }}
          placeholder={t("Qidiruv ruxsati")}
          onChange={e => handleFilter(e.target.value)}
        />
        <Button sx={{ mb: 2.5 }} variant='contained' onClick={handleDialogToggle}>
       {t(" Ruxsat qo'shish")}
        </Button>
      </Box>
      <Dialog fullWidth maxWidth='sm' onClose={handleDialogToggle} open={open}>
        <DialogTitle sx={{ pt: 12, mx: 'auto', textAlign: 'center' }}>
          <Typography variant='h5' component='span' sx={{ mb: 2 }}>
          {t("Yangi ruxsat qo'shing")}
          </Typography>
          <Typography variant='body2'>{t("Foydalanuvchilaringizga foydalanishingiz va belgilashingiz mumkin bo'lgan ruxsatlar.")}</Typography>
        </DialogTitle>
        <DialogContent sx={{ pb: 12, mx: 'auto' }}>
          <Box
            component='form'
            onSubmit={e => onSubmit(e)}
            sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
          >
            <TextField
              fullWidth
              label={t("Ruxsat nomini kiriting")}
              sx={{ mb: 1, maxWidth: 360 }}
              placeholder={t("Ruxsat nomini kiriting")}
            />
            <FormControlLabel control={<Checkbox />} label={t("Asosiy ruxsat sifatida o'rnating")} />
            <Box className='demo-space-x' sx={{ '& > :last-child': { mr: '0 !important' } }}>
              <Button size='large' type='submit' variant='contained'>
              {t("{Ruxsat yaratish")}
              </Button>
              <Button type='reset' size='large' variant='outlined' color='secondary' onClick={handleDialogToggle}>
              {t("Bekor qilish")}
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default TableHeader
