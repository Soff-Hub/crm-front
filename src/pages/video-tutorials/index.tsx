import { Alert, Box, Grid, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"
import VideoModal from "src/@core/components/video-header"
import { videoUrls } from "src/@core/components/video-header/video-header"
import UseBgColor from "src/@core/hooks/useBgColor"
import Header from "src/views/apps/video-tutorials/Header"
import MediaCard from "src/views/apps/video-tutorials/VideoCard"

const VideoTutorials = () => {
    const bgColors = UseBgColor()
    const { t } = useTranslation()

    return (
        <>
            <Header />
            <Box sx={{ display: 'flex', maxWidth: "500px", gap: '10px', flexDirection: 'column', mb: '20px' }}>
                <Alert icon={false} sx={{ py: 2, mb: 0, ...bgColors.primaryLight, '& .MuiAlert-message': { p: 0 } }}>
                    <Typography variant='caption' sx={{ display: 'block', color: 'primary.main' }}>
                        {t("Platformadan foydalanishni ushbu ketma-ketlik bilan boshlang")}
                    </Typography>
                </Alert>
            </Box>
            <Grid container spacing={4}>
                {Object.entries(videoUrls).map(([key, value], index) => (
                    <Grid item xs={6} md={3}>
                        <MediaCard index={index} link={value?.url} title={value.title} />
                    </Grid>
                ))}
                <VideoModal />
            </Grid>
        </>
    )
}

export default VideoTutorials
