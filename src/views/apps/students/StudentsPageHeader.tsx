import { Box, Button, Typography } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import IconifyIcon from 'src/@core/components/icon';
import { useAppDispatch } from 'src/store';
import { setOpenEdit } from 'src/store/apps/students';

const StudentsPageHeader = () => {

    const { t } = useTranslation()
    const dispatch = useAppDispatch()

    return (
        <div>
            <Box
                className='groups-page-header'
                sx={{ display: 'flex', justifyContent: 'space-between', margin: '10px 0' }}
                py={2}
            >
                <Typography variant='h5'>{t("O'quvchilar")}</Typography>
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
