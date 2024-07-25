import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function Header() {
    const { t } = useTranslation()

    return (
        <Box
            className='groups-page-header'
            sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}
            py={2}
        >
            <Typography variant='h5'>{t("Platformadan foydalanish uchun video qo'llanmalar")}</Typography>
        </Box>
    )
}
