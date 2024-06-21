import Box from '@mui/material/Box';
import { CircularProgress } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';

export default function SubLoader() {

    const { t } = useTranslation()

    return (
        <Box sx={{ my: 3, display: 'flex', alignItems: 'center', flexDirection: 'column', width: "100%", mt: '70px' }}>
            <CircularProgress sx={{ mb: 4 }} />
            <Typography variant="overline" component="h2">
                {t('Loading...')}
            </Typography>
        </Box>
    )
}
