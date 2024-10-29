import * as React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import { TextField } from '@mui/material'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  border: 'none',
  bgcolor: 'background.paper',
  boxShadow: 24,
    borderRadius: 1,
  marginBottom: '1rem',
  p: 5
}

interface ModalProps {
  isModalOpen: boolean
  setIsModalOpen: (status: boolean) => void
}

export default function StudentEditProfileModal({ isModalOpen, setIsModalOpen }: ModalProps) {
  const handleClose = () => setIsModalOpen(false)

  return (
    <div>
      <Button onClick={() => setIsModalOpen}>Open modal</Button>
      <Modal
        open={isModalOpen}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={style}>
          <Typography id='modal-modal-title' variant='h6' component='h2'>
            Parolni ozgartirish
          </Typography>

          <TextField size='small' label={"parol"} sx={{ width: '100%' }} placeholder='parol' />
        </Box>
      </Modal>
    </div>
  )
}
