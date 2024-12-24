import { Box, IconButton, Typography, styled } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import IconifyIcon from 'src/@core/components/icon'
import MuiDrawer, { DrawerProps } from '@mui/material/Drawer'
import { setOpenEditSms } from 'src/store/apps/settings'
import { useAppDispatch, useAppSelector } from 'src/store'
import EditSmsform from './EditSmsForm'
import SubLoader from '../../loaders/SubLoader'



const Drawer = styled(MuiDrawer)<DrawerProps>(({ theme }) => ({
    width: 400,
    zIndex: theme.zIndex.modal,
    '& .MuiFormControlLabel-root': {
        marginRight: '0.6875rem'
    },
    '& .MuiDrawer-paper': {
        border: 0,
        width: 400,
        zIndex: theme.zIndex.modal,
        boxShadow: theme.shadows[9]
    }
}))

type Props = {}

export default function EditSmsDialog({ }: Props) {

    const { t } = useTranslation()
    const dispatch = useAppDispatch()
    const { openEditSms } = useAppSelector(state => state.settings)
     console.log(openEditSms);
     
    const setOpenAddGroup = () => {
        dispatch(setOpenEditSms(null))
    }

    return (
        <Drawer open={!!openEditSms} hideBackdrop anchor='right' variant='persistent'>
            <Box
                className='customizer-header'
                sx={{
                    position: 'relative',
                    p: theme => theme.spacing(3.5, 5),
                    borderBottom: theme => `1px solid ${theme.palette.divider}`
                }}
            >
                <Typography variant='h6' sx={{ fontWeight: 600 }}>
                   {openEditSms?.parent ?"Shablonni o'zgartirish": "Kategoriyani o'zgartirish"} 
                </Typography>
                <IconButton
                    onClick={setOpenAddGroup}
                    sx={{
                        right: 20,
                        top: '50%',
                        position: 'absolute',
                        color: 'text.secondary',
                        transform: 'translateY(-50%)'
                    }}
                >
                    <IconifyIcon icon='mdi:close' fontSize={20} />
                </IconButton>
            </Box>

            {openEditSms ? <EditSmsform initialValues={openEditSms} /> : <SubLoader />}
        </Drawer>
    )
}