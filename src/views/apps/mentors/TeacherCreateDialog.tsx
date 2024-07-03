import React from 'react'
import { Box, IconButton, Typography, styled } from '@mui/material'
import MuiDrawer, { DrawerProps } from '@mui/material/Drawer';
import IconifyIcon from 'src/@core/components/icon'
import AddMentorsModal from './AddMentorsModal'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'src/store'
import { setOpenEdit } from 'src/store/apps/mentors'

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


export default function TeacherCreateDialog() {

    const { t } = useTranslation()
    const { openEdit } = useAppSelector(state => state.mentors)
    const dispatch = useAppDispatch()

    function onClose() {
        dispatch(setOpenEdit(null))
    }

    return (
        <>
            <Drawer open={openEdit === 'create'} anchor='right' variant='persistent' onClose={onClose}>
                <Box
                    className='customizer-header'
                    sx={{
                        position: 'relative',
                        p: theme => theme.spacing(3.5, 5),
                        borderBottom: theme => `1px solid ${theme.palette.divider}`
                    }}
                >
                    <Typography variant='h6' sx={{ fontWeight: 600 }}>
                        {t("O'qituvchi qo'shish")}
                    </Typography>
                    <IconButton
                        onClick={onClose}
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
                {openEdit && <AddMentorsModal />}
            </Drawer>
        </>
    )
}