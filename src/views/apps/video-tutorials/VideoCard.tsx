import { CardContent, Typography } from '@mui/material';
import Card from '@mui/material/Card';
import { useAppDispatch } from 'src/store';
import { openVideoModal } from 'src/store/apps/settings';

export default function MediaCard({ link, title }: { link: string, title: string }) {
    const dispatch = useAppDispatch()

    const clickBtn = () => {
        dispatch(openVideoModal({
            open: true,
            title: title,
            url: link
        }))
    }
    return (
        <Card onClick={clickBtn} sx={{ height: 200, position: 'relative' }}>
            <iframe
                style={{ width: "100%", height: "100%", pointerEvents: "none" }}
                src={link}
                title={title}
            />
        </Card>
    );
}
