// ** React Imports
import { SyntheticEvent, useState, useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import MuiTab, { TabProps } from '@mui/material/Tab'
import CircularProgress from '@mui/material/CircularProgress'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Demo Components Imports
import UserViewOverview from 'src/views/apps/students/view/UserViewOverview'
import UserViewSecurity from 'src/views/apps/students/view/UserViewSecurity'
import UserSmsList from './UserSmsList'
import { useTranslation } from 'react-i18next'
import StudentHistory from './StudentHistory'


// ** Styled Tab component
const Tab = styled(MuiTab)<TabProps>(({ theme }) => ({
  minHeight: 48,
  flexDirection: 'row',
  '& svg': {
    marginBottom: '0 !important',
    marginRight: theme.spacing(1)
  }
}))

const UserViewRight = ({ tab, invoiceData, groupData, rerender }: any) => {
  const [activeTab, setActiveTab] = useState<string>(tab)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { t } = useTranslation()

  const router = useRouter()

  const handleChange = (event: SyntheticEvent, value: string) => {
    setIsLoading(true)
    setActiveTab(value)
    const path = router.route.replace('[tab]', value.toLowerCase())

    router
      .push({
        pathname: path,
        query: { student: groupData.id }
      }).finally(() => setIsLoading(false))
  }

  useEffect(() => {
    if (tab && tab !== activeTab) {
      setActiveTab(tab)
    }
  }, [tab])

  useEffect(() => {
    if (groupData) {
      setIsLoading(false)
    }
  }, [groupData])

  return (
    <TabContext value={activeTab}>
      <TabList
        variant='scrollable'
        scrollButtons='auto'
        onChange={handleChange}
        aria-label='forced scroll tabs example'
        sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}
      >
        <Tab value='security' label={t('Guruhlar')} icon={<Icon icon='uil:layer-group' />} />
        <Tab value='comments' label={t('Izoh va Eslatmalar')} icon={<Icon icon='fluent:note-add-48-regular' />} />
        <Tab value='sms' label={t('SMS')} icon={<Icon fontSize={"28px"} icon='bitcoin-icons:message-outline' />} />
        <Tab value='history' label={t("O'quvchi tarixi")} icon={<Icon fontSize={"22px"} icon='material-symbols:history' />} />
      </TabList>
      <Box sx={{ mt: 6 }}>
        {isLoading ? (
          <Box sx={{ mt: 6, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            <CircularProgress sx={{ mb: 4 }} />
            <Typography>{t("Loading...")}</Typography>
          </Box>
        ) : (
          <>
            <TabPanel sx={{ p: 0 }} value='security'>
              <UserViewSecurity/>
            </TabPanel>
            <TabPanel sx={{ p: 0 }} value='comments'>
              <UserViewOverview data={groupData?.comments || []} />
            </TabPanel>
            <TabPanel sx={{ p: 0 }} value='sms'>
              <UserSmsList />
            </TabPanel>
            <TabPanel sx={{ p: 0 }} value='history'>
              <StudentHistory />
            </TabPanel>
          </>
        )}
      </Box>
    </TabContext>
  )
}

export default UserViewRight
