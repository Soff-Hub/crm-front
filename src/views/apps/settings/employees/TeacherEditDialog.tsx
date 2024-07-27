import { Box, Drawer, IconButton, Typography } from '@mui/material'
import IconifyIcon from 'src/@core/components/icon'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'src/store'
import { setOpenEdit } from 'src/store/apps/mentors'
import SubLoader from '../../loaders/SubLoader'
import { setEmployeeData } from 'src/store/apps/settings'
import EditEmployeeForm from './EditTeacherModal'


export default function EditEmployeeModal() {

    const { t } = useTranslation()
    const { employeeData } = useAppSelector(state => state.settings)
    const dispatch = useAppDispatch()

    function onClose() {
        dispatch(setOpenEdit(null))
    }

    return (
        <>
            <Drawer open={!!employeeData} anchor='right' variant='persistent' onClose={onClose}>
                <Box
                    className='customizer-header'
                    sx={{
                        position: 'relative',
                        p: theme => theme.spacing(3.5, 5),
                        borderBottom: theme => `1px solid ${theme.palette.divider}`
                    }}
                >
                    <Typography variant='h6' sx={{ fontWeight: 600 }}>
                        {t("O'qituvchi ma'lumotlarini tahrirlash")}
                    </Typography>
                    <IconButton
                        onClick={() => (onClose(), dispatch(setEmployeeData(null)))}
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
                    {employeeData ? <EditEmployeeForm /> : <SubLoader />}
                </Box>
            </Drawer>
        </>
    )
}