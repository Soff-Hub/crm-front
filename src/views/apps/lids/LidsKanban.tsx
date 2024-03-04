import * as React from 'react';
import { Box, Button, Typography } from '@mui/material';
import AccordionCustom from 'src/@core/components/accordion';
import KanbanItem from 'src/@core/components/card-statistics/kanban-item';
import IconifyIcon from 'src/@core/components/icon';

interface Props {
    title: string
    status: "pending" | "new" | "success",
    items: any[],
    setOpenItem: any,
    id: any,
    setOpenLid: any
}


export default function HomeKanban({ title, status, items, setOpenItem, id, setOpenLid }: Props) {

    return (
        <Box sx={{ width: "100%", display: 'flex', flexDirection: 'column', maxWidth: 350, minWidth: '300px' }}>
            <Box display={"flex"} alignItems={"center"} marginBottom={5}>
                <Typography fontSize={22}>{title}</Typography>
                <Button
                    sx={{ marginLeft: 'auto' }}
                    size='small'
                    
                    // color={status === "new" ? "secondary" : status === "pending" ? "warning" : status}
                    color='warning'
                    onClick={() => setOpenLid(id)}
                >
                    <IconifyIcon icon={'system-uicons:user-add'} />
                </Button>
                <Button
                    size='small'
                    color={status === "new" ? "secondary" : status === "pending" ? "warning" : status}
                    onClick={() => setOpenItem(id)}
                >
                    <IconifyIcon icon={'iconoir:grid-add'} />
                </Button>
            </Box>

            <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start', width: '100%', flexDirection: 'column' }}>
                {
                    items.map(lead => (
                        <AccordionCustom item={lead} key={lead.id} onView={() => console.log("aa")}>
                            <KanbanItem status={status} title={lead.name} phone='+998931231177' />
                        </AccordionCustom>
                    ))
                }
            </Box>
        </Box >
    );
}
