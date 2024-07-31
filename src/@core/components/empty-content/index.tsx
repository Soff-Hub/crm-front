import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function EmptyContent({ title = "Ma'lumot yo'q" }: { title?: string }) {
    const { t } = useTranslation()

    return (
        <Box sx={{ display: "flex", justifyContent: "center", height: "300px", position: 'relative', flexDirection: 'column', alignItems: 'center' }}>
            <img style={{ height: "80%" }} src="/images/empty state.png" alt="" />
            <Typography
                sx={{
                    fontSize: '16px'
                }}
                variant="body2"
            >
                {t(title)}
            </Typography>
        </Box>
    )
}
