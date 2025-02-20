import Tab from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'
import TabContext from '@mui/lab/TabContext'
import { useAppDispatch, useAppSelector } from 'src/store'
import { handleTabValue, handleOpen, fetchLessons, updateInterval } from 'src/store/apps/dashboard'
import { useTranslation } from 'react-i18next'
import { Box, Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material'

interface ICalendarTabsProps {
  handleUpdateWeekDays: (item: string[]) => void
}

const CalendarTabs = ({ handleUpdateWeekDays }: ICalendarTabsProps) => {
  const dispatch = useAppDispatch()
  const { tabValue, weeks } = useAppSelector(state => state.dashboard)
  const { t } = useTranslation()

  async function handleChangeInterval(interval: string) {
    dispatch(updateInterval(interval))
    await dispatch(fetchLessons({ queryWeeks: weeks, interval: interval }))
  }

  return (
    <TabContext value={tabValue}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <TabList
          sx={{ px: 2 }}
          onChange={(event, value: string) => dispatch(handleTabValue(value))}
          aria-label='centered tabs example'
        >
          <Tab
            value='1'
            label={t('Juft kunlar')}
            sx={{ px: '10px', fontSize: '9px' }}
            onClick={() => handleUpdateWeekDays(['tuesday', 'thursday', 'saturday'])}
          />
          <Tab
            value='2'
            label={t('Toq kunlar')}
            sx={{ px: '10px', fontSize: '9px' }}
            onClick={() => handleUpdateWeekDays(['monday', 'wednesday', 'friday'])}
          />
          <Tab
            value='4'
            label={t('Boshqa')}
            sx={{ px: '10px', fontSize: '9px' }}
            onClick={() => dispatch(handleOpen('week'))}
          />
        </TabList>
        <FormControl size='small' sx={{ margin: 2 }}>
          <InputLabel id='time-interval-label'>Vaqt intervali</InputLabel>
          <Select
            defaultValue={15}
            onChange={(e: any) => handleChangeInterval(e.target.value)}
            labelId='time-interval-label'
            label='Vaqt intervali'
          >
            <MenuItem value={15}>15 daqiqa</MenuItem>
            <MenuItem value={30}>30 daqiqa</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </TabContext>
  )
}

export default CalendarTabs
