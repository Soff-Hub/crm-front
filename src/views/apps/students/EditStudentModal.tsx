import React, { useEffect } from 'react'

// ** Components
import MuiDrawer, { DrawerProps } from '@mui/material/Drawer';
import { Box, IconButton, Typography, styled } from '@mui/material';
import IconifyIcon from 'src/@core/components/icon';
import EditStudentForm from './EditStudentForm';

// ** Assets
import { useTranslation } from 'react-i18next';

// ** Store
import { useAppDispatch, useAppSelector } from 'src/store';
import useResponsive from 'src/@core/hooks/useResponsive';
import { setOpenEdit } from 'src/store/apps/students';
import SubLoader from '../loaders/SubLoader';
import { handleOpenAddModal } from 'src/store/apps/groups';

const Drawer = styled(MuiDrawer)<DrawerProps>(({ theme }) => ({
    width: 400,
    zIndex: theme.zIndex.modal,
    '& .MuiFormControlLabel-root': {
        marginRight: '0.6875rem'
    },
    '& .MuiDrawer-paper': {
        border: 0,
        zIndex: theme.zIndex.modal,
        boxShadow: theme.shadows[9]
    }
}))


export default function EditStudentModal() {

    // ** Hooks
    const { t } = useTranslation()
    const dispatch = useAppDispatch()
    const { isMobile } = useResponsive()
    const { openEdit, studentData } = useAppSelector(state => state.students)



    function onClose() {
        dispatch(setOpenEdit(null))
    }


    useEffect(() => {

        return () => {
            dispatch(handleOpenAddModal(false))
        }
    }, [])


    return (
        <Drawer open={openEdit === 'edit'} hideBackdrop anchor='right' variant='persistent'>
            <Box
                className='customizer-header'
                sx={{
                    position: 'relative',
                    p: theme => theme.spacing(3.5, 5),
                    borderBottom: theme => `1px solid ${theme.palette.divider}`
                }}
            >
                <Typography variant='h6' sx={{ fontWeight: 600 }}>
                    {t("O'quvchi malumotlarini tahrirlash")}
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
            <Box width={'100%'}>
                {studentData ? <EditStudentForm /> : <Box sx={{ minWidth: isMobile ? '330px' : '400px' }}>
                    <SubLoader />
                </Box>}
            </Box>
        </Drawer>
    )
}