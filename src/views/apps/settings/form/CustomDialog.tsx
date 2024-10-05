import { Dialog, DialogContent, Box, Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

const CustomDialog = ({ open, onClose, title, content, loading, onConfirm, confirmText, cancelText }: any) => (
    <Dialog open={open} onClose={onClose}>
        <DialogContent sx={{ height: "auto", }}>
            <Typography variant="h5" sx={{ fontSize: '20px', marginBottom: '20px' }}>
                {title}
            </Typography>
            {content}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: '12px', mt: 2 }}>
                <LoadingButton variant='outlined' color='error' onClick={onClose}>{cancelText}</LoadingButton>
                <LoadingButton loading={loading} variant='contained' onClick={onConfirm}>{confirmText}</LoadingButton>
            </Box>
        </DialogContent>
    </Dialog>
);

export default CustomDialog;
