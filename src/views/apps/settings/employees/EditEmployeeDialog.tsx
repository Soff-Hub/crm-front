import { Box, IconButton, Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import IconifyIcon from 'src/@core/components/icon'
import { CustomeDrawer } from 'src/pages/settings/office/courses'
import { useAppDispatch, useAppSelector } from 'src/store'
import { setEmployeeData, setOpenCreateSms } from 'src/store/apps/settings'
import EditEmployeeForm from './EditEmployeeForm'



type Props = {}

export default function EditEmployeeDialog({ }: Props) {

    const { t } = useTranslation()
    const { employeeData } = useAppSelector(state => state.settings)
    const dispatch = useAppDispatch()

    const setOpenAddGroup = () => {
        dispatch(setEmployeeData(null))
    }

    return (
        <CustomeDrawer open={!!employeeData} hideBackdrop anchor='right' variant='persistent'>
            <Box
                className='customizer-header'
                sx={{
                    position: 'relative',
                    p: theme => theme.spacing(3.5, 5),
                    borderBottom: theme => `1px solid ${theme.palette.divider}`
                }}
            >
                <Typography variant='h6' sx={{ fontWeight: 600 }}>
                    {t("Yangi qo'shish")}
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

            {employeeData && <EditEmployeeForm />}
        </CustomeDrawer>
    )
}