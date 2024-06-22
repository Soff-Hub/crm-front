import { Box } from "@mui/material";

export default function EmptyContent() {
    return (
        <Box sx={{ display: "flex", justifyContent: "center", height: "400px" }}>
            <img style={{ height: "100%" }} src="/images/empty state.png" alt="" />
        </Box>
    )
}
