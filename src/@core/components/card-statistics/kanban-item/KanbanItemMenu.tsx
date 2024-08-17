import { Box, Menu, MenuItem } from '@mui/material'
import { useAppSelector } from 'src/store'
import IconifyIcon from '../../icon'
import { useTranslation } from 'react-i18next'

type Props = {
    anchorEl: any
    setAnchorEl: any
    getSMSTemps: any
    getGroups: any
    getBranches: any
    setOpen: any
}

export default function KanbanItemMenu({
    anchorEl,
    setAnchorEl,
    getSMSTemps,
    getGroups,
    getBranches,
    setOpen: setOpenNative
}: Props) {

    const { queryParams } = useAppSelector(state => state.leads)
    const { t } = useTranslation()
    const rowOptionsOpen = Boolean(anchorEl)

    const handleRowOptionsClose = () => {
        setAnchorEl(null)
    }

    function setOpen(value: any) {
        setAnchorEl(null)
        setOpenNative(value)
    }


    return (
        <Menu
            keepMounted
            anchorEl={anchorEl}
            open={rowOptionsOpen}
            onClose={handleRowOptionsClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
            }}
            PaperProps={{ style: { minWidth: '8rem' } }}
        >
            {
                queryParams.is_active ? (
                    <Box>
                        <MenuItem onClick={() => setOpen('note')} sx={{ '& svg': { mr: 2 } }}>
                            <IconifyIcon icon='ph:flag-light' fontSize={20} />
                            {t("Yangi eslatma")}
                        </MenuItem>
                        <MenuItem onClick={() => (getSMSTemps(), setOpen('sms'))} sx={{ '& svg': { mr: 2 } }}>
                            <IconifyIcon icon='mdi:sms' fontSize={20} />
                            {t("SMS yuborish")}
                        </MenuItem>
                        <MenuItem onClick={() => (getBranches(), setOpen('branch'))} sx={{ '& svg': { mr: 2 } }}>
                            <IconifyIcon icon='system-uicons:branch' fontSize={20} />
                            {t("Boshqa Filialga")}
                        </MenuItem>
                        <MenuItem onClick={() => setOpen('merge-to')} sx={{ '& svg': { mr: 2 } }}>
                            <IconifyIcon icon='subway:round-arrow-2' fontSize={17} />
                            {t("Boshqa bo'limga")}
                        </MenuItem>
                        <MenuItem onClick={() => (getGroups(), setOpen('add-group'))} sx={{ '& svg': { mr: 2 } }}>
                            <IconifyIcon icon='material-symbols:group-add' fontSize={17} />
                            {t("Guruhga qo'shish")}
                        </MenuItem>
                        <MenuItem onClick={() => setOpen('edit')} sx={{ '& svg': { mr: 2 } }}>
                            <IconifyIcon icon='mdi:edit' fontSize={20} />
                            {t("Tahrirlash")}
                        </MenuItem>
                        <MenuItem onClick={() => setOpen('delete')} sx={{ '& svg': { mr: 2 } }}>
                            <IconifyIcon icon='mdi:delete' fontSize={20} />
                            {t("O'chirish")}
                        </MenuItem>
                    </Box>
                ) : (
                    <>
                        <MenuItem onClick={() => (getSMSTemps(), setOpen('sms'))} sx={{ '& svg': { mr: 2 } }}>
                            <IconifyIcon icon='mdi:sms' fontSize={20} />
                            {t("SMS yuborish")}
                        </MenuItem>
                        <MenuItem onClick={() => setOpen('recover')} sx={{ '& svg': { mr: 2 } }}>
                            <IconifyIcon icon='mdi:reload' fontSize={20} />
                            {t("Tiklash")}
                        </MenuItem>
                    </>
                )
            }
        </Menu>
    )
}