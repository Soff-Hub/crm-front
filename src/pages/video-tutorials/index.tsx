import { Grid } from "@mui/material"
import MediaCard from "src/views/apps/video-tutorials/VideoCard"

const VideoTutorials = () => {
    return (
        <Grid container spacing={2}>
            <Grid item xs={6} md={3}>
                <MediaCard link="" />
            </Grid>
        </Grid>
    )
}

export default VideoTutorials
