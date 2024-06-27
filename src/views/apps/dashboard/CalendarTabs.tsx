import Tab from '@mui/material/Tab';
import TabList from '@mui/lab/TabList';
import TabContext from '@mui/lab/TabContext';
import { useAppDispatch, useAppSelector } from "src/store";
import { handleTabValue, handleOpen } from 'src/store/apps/dashboard';
import { useTranslation } from "react-i18next";

interface ICalendarTabsProps {
    handleUpdateWeekDays: (item: string[]) => void
}

const CalendarTabs = ({ handleUpdateWeekDays }: ICalendarTabsProps) => {
    const dispatch = useAppDispatch()
    const { tabValue } = useAppSelector((state) => state.dashboard)
    const { t } = useTranslation()

    return (
        <TabContext value={tabValue}>
            <TabList onChange={(event, value: string) => dispatch(handleTabValue(value))} aria-label='centered tabs example'>
                <Tab value='1' label={t('Juft kunlar')} sx={{ p: '0 !important', fontSize: '9px' }} onClick={() => handleUpdateWeekDays(['tuesday', 'thursday', 'saturday'])} />
                <Tab value='2' label={t('Toq kunlar')} sx={{ p: '0 !important', fontSize: '9px' }} onClick={() => handleUpdateWeekDays(['monday', 'wednesday', 'friday'])} />
                <Tab value='4' label={t('Boshqa')} sx={{ p: '0 !important', fontSize: '9px' }} onClick={() => dispatch(handleOpen("week"))} />
            </TabList>
        </TabContext>
    )
}

export default CalendarTabs
