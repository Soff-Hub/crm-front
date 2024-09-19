import { Box, Button } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import { useAppDispatch } from 'src/store';
import { handleOpenClientModal, handleOpenSMSModal } from 'src/store/apps/c-panel';
import SendNotificationModal from './SendNotificationModal';
import SendMessageModal from './SendMessageModal';

type Props = {}

export default function CompanyCardActions({ }: Props) {
    const { t } = useTranslation()
    const [open, setOpen] = useState<null | 'sms' | 'payment' | 'pack' | 'notification'>(null)
    const dispatch = useAppDispatch()
    const { query } = useRouter()

    return (
        <div>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: "column", gap: "10px" }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    <Button
                        variant='outlined'
                        size='small'
                        color='info'
                        onClick={() => setOpen('sms')}
                    >
                        {t('SMS yuborish')}
                    </Button>
                    <Button
                        variant='outlined'
                        size='small'
                        color='warning'
                        onClick={() => setOpen('notification')}
                    >
                        {t('Xabarnoma yuborish')}
                    </Button>
                </Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    <Button
                        variant='outlined'
                        size='small'
                        onClick={() => dispatch(handleOpenSMSModal(true))}
                    >
                        {t("SMS paket")}
                    </Button>
                    <Button
                        variant='outlined'
                        size='small'
                        color='secondary'
                        onClick={() => dispatch(handleOpenClientModal(true))}
                    >
                        {t("To'lov")}
                    </Button>
                </Box>
            </Box>

            {/* Xabarnoma yuborish */}
            <SendNotificationModal open={open} setOpen={setOpen} />
            <SendMessageModal open={open} setOpen={setOpen} />
        </div>
    )
}