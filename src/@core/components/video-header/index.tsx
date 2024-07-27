import { Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material'
import { useAppDispatch, useAppSelector } from 'src/store'
import { closeVideoModal } from 'src/store/apps/settings'
import IconifyIcon from '../icon'
import useResponsive from 'src/@core/hooks/useResponsive'

type Props = {}

export default function VideoModal({ }: Props) {
    const { videoAnchor } = useAppSelector(state => state.settings)
    const dispatch = useAppDispatch()
    const { isMobile, isTablet } = useResponsive()

    return (
        <Dialog open={videoAnchor.open} onClose={() => dispatch(closeVideoModal())} maxWidth={isMobile ? 'xs' : isTablet ? 'md' : 'xl'}>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant='h5'>
                    {videoAnchor.title} sahifasidan foydalanish bo'yicha video qo'llanma
                </Typography>
                <IconButton onClick={() => dispatch(closeVideoModal())}>
                    <IconifyIcon icon={'mingcute:close-fill'} />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ width: '100%', }}>
                <iframe style={{ minHeight: isMobile ? '320px' : isTablet ? '420px' : '500px', minWidth: isMobile ? '320px' : isTablet ? '600px' : '1024px' }} src={videoAnchor.url} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
            </DialogContent>
        </Dialog >
    )
}