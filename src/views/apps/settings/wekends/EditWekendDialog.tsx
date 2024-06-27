import { Box, IconButton, Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import IconifyIcon from 'src/@core/components/icon'
import { CustomeDrawer } from 'src/pages/settings/office/courses'
import { useAppDispatch, useAppSelector } from 'src/store'
import { setWekendData } from 'src/store/apps/settings'
import EditWekendForm from './EditWekendForm'



type Props = {}

export default function EditWekendDialog({ }: Props) {

    const { t } = useTranslation()
    const { wekendData } = useAppSelector(state => state.settings)
    const dispatch = useAppDispatch()

    const setOpenAddGroup = () => {
        dispatch(setWekendData(null))
    }

    return (
        <CustomeDrawer open={!!wekendData} hideBackdrop anchor='right' variant='persistent'>
            <Box
                className='customizer-header'
                sx={{
                    position: 'relative',
                    p: theme => theme.spacing(3.5, 5),
                    borderBottom: theme => `1px solid ${theme.palette.divider}`
                }}
            >
                <Typography variant='h6' sx={{ fontWeight: 600 }}>
                    {t("Kunni o'zgartirish")}
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

            {wekendData && <EditWekendForm />}
        </CustomeDrawer>
    )
}