import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Checkbox from '@mui/material/Checkbox'
import FormControl from '@mui/material/FormControl'
import Button from '@mui/material/Button'
import IconifyIcon from 'src/@core/components/icon'
import { useAppDispatch, useAppSelector } from "src/store"
import { handleOpen, handleChangeWeeks } from 'src/store/apps/dashboard'
import { TranslateWeekName } from "src/pages/groups"
import useResponsive from "src/@core/hooks/useResponsive"

interface IWeekDaysDialogProps {
    handleUpdateWeekDays: (week: string[]) => void
}

const WeekDaysDialog = ({ handleUpdateWeekDays }: IWeekDaysDialogProps) => {
    const dispatch = useAppDispatch()
    const { weekDays, open, weeks } = useAppSelector((state) => state.dashboard)
    const { isMobile } = useResponsive()

    return (
        <Dialog open={open === 'week'} onClose={() => dispatch(handleOpen(null))}>
            <DialogTitle sx={{ minWidth: isMobile ? '' : '300px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                Hafta kunlari
                <IconifyIcon icon={'ic:baseline-close'} onClick={() => dispatch(handleOpen(null))} />
            </DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    {weekDays.map(week => (
                        <FormControl key={week}>
                            <label style={{ display: 'flex', alignItems: 'center', flexDirection: 'row-reverse', justifyContent: 'flex-end' }}>
                                <span>{TranslateWeekName[week]}</span>
                                <Checkbox checked={weeks?.includes(week)} onClick={() => dispatch(handleChangeWeeks(week))} />
                            </label>
                        </FormControl>
                    ))}
                    <Button
                        variant='contained'
                        onClick={() => {
                            handleUpdateWeekDays(weeks)
                            dispatch(handleOpen(null))
                        }}
                    >
                        Ko'rish
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    )
}

export default WeekDaysDialog
