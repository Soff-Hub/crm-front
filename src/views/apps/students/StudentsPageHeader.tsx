import { Box, Button, Typography } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import IconifyIcon from 'src/@core/components/icon';
import Status from 'src/@core/components/status';
import { useAppDispatch, useAppSelector } from 'src/store';
import { setOpenEdit } from 'src/store/apps/students';

const StudentsPageHeader = () => {
    const { studentsCount } = useAppSelector(state => state.students)

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
                    <Typography
                        style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '0 10px', border: '1px solid #c3cccc', borderRadius: '10px' }}
                    >
                        {studentsCount} ta
                    </Typography>
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
