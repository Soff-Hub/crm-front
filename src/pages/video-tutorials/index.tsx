import { Alert, Box, Grid, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"
import VideoModal from "src/@core/components/video-header"
import { videoUrls } from "src/@core/components/video-header/video-header"
import UseBgColor from "src/@core/hooks/useBgColor"
import useResponsive from "src/@core/hooks/useResponsive"
import Header from "src/views/apps/video-tutorials/Header"
import MediaCard from "src/views/apps/video-tutorials/VideoCard"

const VideoTutorials = () => {
    const bgColors = UseBgColor()
    const { t } = useTranslation()
    const { isMobile } = useResponsive()

    return (
        <>
            <Header />
            <Box sx={{ display: 'flex', maxWidth: "500px", gap: '10px', flexDirection: 'column', mb: '20px' }}>
                <Alert icon={false} sx={{ py: 2, mb: 0, ...bgColors.primaryLight, '& .MuiAlert-message': { p: 0 } }}>
                    <Typography variant='caption' sx={{ display: 'block', fontWight: "bold", color: 'primary.main' }}>
                        {t("Video qo'llanmalarni berilgan tartib raqam bo'yicha ko'rib, ma'lumotlarni kiritish orqali o'z markazingizni aftomatlashtirishingiz mumkin.")}
                    </Typography>
                </Alert>
            </Box>
            <Grid container spacing={4}>
                {Object.entries(videoUrls).map(([key, value], index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <MediaCard index={index} link={value?.url} title={value.title} />
                    </Grid>
                ))}
                <VideoModal />
            </Grid>
        </>
    )
}

export default VideoTutorials
