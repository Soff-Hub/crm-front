import { Box, Button, CardContent, Tooltip } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import IconifyIcon from 'src/@core/components/icon'
import { useAppDispatch } from 'src/store'

type Props = {}

export default function StudentActionsBox({ }: Props) {
    const { t } = useTranslation()
    const dispatch = useAppDispatch()


    function handleEditClickOpen(value: any) {

    }

    return (
        <>
            <CardContent sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                    size='small'
                    variant='outlined'
                    startIcon={<IconifyIcon icon={'icon-park-twotone:add-web'} />}
                    onClick={() => handleEditClickOpen('group')}
                >
                    {t("Guruhga qo'shish")}
                </Button>
                <Button
                    color='warning'
                    size='small'
                    startIcon={<IconifyIcon icon={'mdi:cash-plus'} />}
                    variant='outlined'
                    onClick={async () => {
                        // await getPaymentMethod()
                        handleEditClickOpen('payment')
                    }}
                >
                    {t("To'lov")}
                </Button>
            </CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'center', pb: 3 }}>
                <Tooltip title={t('Xabar (sms)')} placement='bottom'>
                    <Button
                        size='small'
                        color="warning"
                    // onClick={() => (getSMSTemps(), handleEditClickOpen('sms'))}
                    >
                        <IconifyIcon icon='material-symbols-light:sms-outline' />
                    </Button>
                </Tooltip>
                <Tooltip title={t("Tahrirlash")} placement='bottom'>
                    <Button
                        size='small'
                        color='success'
                        onClick={() => handleEditClickOpen('edit')}
                    >
                        <IconifyIcon icon='iconamoon:edit-thin' />
                    </Button>
                </Tooltip>
            </Box>
        </>
    )
}