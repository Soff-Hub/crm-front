import { Box, Typography } from "@mui/material";

export default function EmptyContent() {
    return (
        <Box sx={{ display: "flex", justifyContent: "center", height: "300px", position: 'relative', flexDirection: 'column', alignItems: 'center' }}>
            <img style={{ height: "80%" }} src="/images/empty state.png" alt="" />
            <Typography
                sx={{
                    fontSize: '16px'
                }}
                variant="body2"
            >
                Ma'lumot yo'q
            </Typography>
        </Box>
    )
}
