import * as React from 'react';
import { Box, Button, Dialog, DialogContent, FormControl, InputLabel, TextField, Typography } from '@mui/material';
import AccordionCustom from 'src/@core/components/accordion';
import IconifyIcon from 'src/@core/components/icon';
import LoadingButton from '@mui/lab/LoadingButton';

interface Props {
    title: string
    status: "pending" | "new" | "success",
    items: any[],
    setOpenItem: any,
    id: any,
    setOpenLid: any
}


export default function HomeKanban({ title, items, setOpenItem, id, setOpenLid }: Props) {
    const [open, setOpen] = React.useState<'delete' | 'edit' | null>(null)
    const [loading, setLoading] = React.useState<any>(false)
    const [name, setName] = React.useState<any>(title)
    const [nameVal, setNameVal] = React.useState<any>(title)

    const editSubmit = async () => {
        setLoading(true)
        setTimeout(() => {
            setName(nameVal)
            setLoading(false)
            setOpen(null)
        }, 1500);
    }

    return (
        <Box sx={{ width: "100%", display: 'flex', flexDirection: 'column', maxWidth: 350, minWidth: '300px' }}>
            <Box display={"flex"} alignItems={"center"} marginBottom={5}>
                <Typography fontSize={22}>{name}</Typography>
                <IconifyIcon icon={'system-uicons:user-add'} color='orange' onClick={() => setOpenLid(id)} style={{ cursor: 'pointer', marginLeft: 'auto' }} />
                <IconifyIcon icon={'iconoir:grid-add'} color='orange' onClick={() => setOpenItem(id)} style={{ cursor: 'pointer', margin: '0 10px' }} />
                <IconifyIcon icon={'mingcute:edit-line'} color='orange' onClick={() => setOpen('edit')} style={{ cursor: 'pointer', fontSize: '20px', marginRight: '5px' }} />
                <IconifyIcon icon={'mingcute:delete-line'} color='red' onClick={() => setOpen('delete')} style={{ cursor: 'pointer', fontSize: '20px' }} />
            </Box>

            <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start', width: '100%', flexDirection: 'column' }}>
                {
                    items.map(lead => (
                        <AccordionCustom item={lead} key={lead.id} onView={() => console.log("aa")} />
                    ))
                }
            </Box>

            <Dialog open={open === 'delete'}>
                <DialogContent sx={{ minWidth: '320px', padding: '20px 0' }}>
                    <Typography sx={{ fontSize: '24px', textAlign: 'center' }}>
                        O'chirmoqchimisiz?
                    </Typography>
                </DialogContent>
                <Box sx={{ padding: '0 0 20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                    <Button color='error' variant='contained' onClick={() => setOpen(null)}>
                        Bekor qilish
                    </Button>
                    <LoadingButton loading={loading} color='primary' variant='outlined'>
                        O'chirish
                    </LoadingButton>
                </Box>
            </Dialog>

            <Dialog open={open === 'edit'}>
                <DialogContent sx={{ minWidth: '320px', padding: '20px' }}>
                    <FormControl fullWidth>
                        <TextField label="Nomi" onChange={(e) => setNameVal(e.target.value)} defaultValue={name} />
                    </FormControl>
                </DialogContent>
                <Box sx={{ padding: '0 0 20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                    <Button color='error' variant='contained' onClick={() => setOpen(null)}>
                        Bekor qilish
                    </Button>
                    <LoadingButton loading={loading} color='primary' variant='outlined' onClick={editSubmit}>
                        Saqlash
                    </LoadingButton>
                </Box>
            </Dialog>
        </Box >
    );
}
