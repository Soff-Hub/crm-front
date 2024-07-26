import { CardContent, Typography } from '@mui/material';
import Card from '@mui/material/Card';
import { useAppDispatch } from 'src/store';
import { openVideoModal } from 'src/store/apps/settings';

export default function MediaCard({ link, index, title }: { index: number, link: string, title: string }) {
    const dispatch = useAppDispatch()

    const clickBtn = () => {
        dispatch(openVideoModal({
            open: true,
            title: title,
            url: link
        }))
    }
    return (
        <Card onClick={clickBtn} sx={{ minHeight: 200, position: 'relative' }}>
            <iframe
                style={{ width: "100%", minHeight: "200px", pointerEvents: "none" }}
                src={link}
                title={title}
            />
            <CardContent sx={{ padding: "10px 15px", display: "flex", alignItems: "start", justifyContent: "flex-start", gap: "5px" }}>
                <Typography variant="body1" fontWeight="bold" color="text.primary">
                    {index + 1}.
                </Typography>
                <Typography variant="body1" fontWeight="bold" color="text.primary">
                    {title}{" "} sahifasidan to'g'ri foydalanish
                </Typography>
            </CardContent>

        </Card >
    );
}
