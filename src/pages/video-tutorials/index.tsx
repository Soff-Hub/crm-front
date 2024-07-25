import { Grid } from "@mui/material"
import VideoModal from "src/@core/components/video-header"
import { videoUrls } from "src/@core/components/video-header/video-header"
import MediaCard from "src/views/apps/video-tutorials/VideoCard"

const VideoTutorials = () => {
    return (
        <Grid container spacing={4}>
            {Object.entries(videoUrls).map(([key, value]) => (
                <Grid item xs={6} md={3}>
                    <MediaCard link={value?.url} title={value.title} />
                </Grid>
            ))}
            <VideoModal />
        </Grid>
    )
}

export default VideoTutorials
