import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';

export default function MediaCard({ link }: { link: string }) {
    return (
        <Card sx={{ maxWidth: 345 }}>
            <CardMedia
                sx={{ height: 140 }}
                image={link}
            />
        </Card>
    );
}