import { Box, Button, Chip, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import IconifyIcon from 'src/@core/components/icon';
import Status from 'src/@core/components/status';
import { useAppDispatch, useAppSelector } from 'src/store';
import { setOpenEdit } from 'src/store/apps/students';

const StudentsPageHeader = () => {
    const { studentsCount, isLoading } = useAppSelector(state => state.students)

    const { t } = useTranslation()
    const dispatch = useAppDispatch()

    return (
        <div>
            <Box
                className='groups-page-header'
                sx={{ display: 'flex', justifyContent: 'space-between', margin: '10px 0' }}
                py={2}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <Typography variant='h5'>{t("O'quvchilar")}</Typography>
                    {!isLoading && <Chip label={`${studentsCount}`} variant='outlined' color="primary" size="medium" />}

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Status color='error' />
                        <Typography variant='caption'>{t("Qarzdor")}</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Status color='warning' />
                        <Typography variant='caption'>{t("To'lov sanasi yaqin")}</Typography>
                    </Box>
                </Box>
                <Button
                    onClick={() => dispatch(setOpenEdit('create'))}
                    variant='contained'
                    size='small'
                    startIcon={<IconifyIcon icon='ic:baseline-plus' />}
                >
                    {t("Yangi qo'shish")}
                </Button>
            </Box>
        </div>
    );
}

export default StudentsPageHeader;
