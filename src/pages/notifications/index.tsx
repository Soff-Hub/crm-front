import { Box, BoxProps, IconButton, styled, Typography, TypographyProps } from "@mui/material";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import IconifyIcon from "src/@core/components/icon";

const MenuItemTitle = styled(Typography)<TypographyProps>(({ theme }) => ({
    fontWeight: 600,
    flex: '1 1 100%',
    overflow: 'hidden',
    fontSize: '1.2rem',
    textOverflow: 'initial',
    marginBottom: theme.spacing(0.75),
    [theme.breakpoints.down('sm')]: {
        fontSize: '1rem',
    },
}))

const MenuItemSubtitle = styled(Typography)<TypographyProps>(({ theme }) => ({
    flex: '1 1 100%',
    overflow: 'hidden',
    textOverflow: 'initial',
    fontSize: '1rem',
    [theme.breakpoints.down('sm')]: {
        fontSize: '0.8rem',
    },
}))

const NotificationContainer = styled(Box)<BoxProps>(({ theme }) => ({
    [theme.breakpoints.down('lg')]: {
        maxWidth: "100%",
    },
    [theme.breakpoints.up('lg')]: {
        maxWidth: "fit-content",
        minWidth: "500px",
    },
}));


export default function Notifications() {
    const { t } = useTranslation()
    const { back } = useRouter()
    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <Box
                className='groups-page-header'
                sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <IconButton color='primary'>
                        <IconifyIcon icon={'ep:back'} style={{ cursor: 'pointer' }} onClick={back} />
                    </IconButton>
                    <Typography variant='h5'>{t("Xabarnomalar")}</Typography>
                </Box>
            </Box>
            <NotificationContainer sx={{ display: "flex", flexDirection: "column", gap: "10px" }} >
                <Box sx={{ bgcolor: "#F8EFE0", p: 3, borderRadius: "10px" }}>
                    <Box sx={{ flex: '1 1', display: 'flex', fontSize: "12px", overflow: 'hidden', flexDirection: 'column' }}>
                        <MenuItemTitle>{"Salom!"}</MenuItemTitle>
                        <MenuItemSubtitle variant='body2'>{"CRM uchun tolov esdan chiqmasin"}</MenuItemSubtitle>
                    </Box>
                </Box>
                <Box sx={{ bgcolor: "#F8EFE0", p: 3, borderRadius: "10px" }}>
                    <Box sx={{ flex: '1 1', display: 'flex', overflow: 'hidden', flexDirection: 'column' }}>
                        <MenuItemTitle>{"Assalomu alaykum!"}</MenuItemTitle>
                        <MenuItemSubtitle variant='body2'>{"G-001 guruhi uchun iyun aoyi uchu ohirgi darsga 5 kun qoldi imtihon tashkillashni esdan chiqarmang"}</MenuItemSubtitle>
                    </Box>
                </Box>
            </NotificationContainer >
        </Box >
    )
}
