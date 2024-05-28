// ** React Imports
import { SyntheticEvent, useState, useEffect, useContext } from 'react'

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
import UserViewBilling from 'src/views/apps/groups/view/UserViewBilling'
import UserViewOverview from 'src/views/apps/groups/view/UserViewOverview'
import UserViewSecurity from 'src/views/apps/groups/view/UserViewSecurity'


// ** Types
import GroupExamsList from './GroupExamsList'
import { useTranslation } from 'react-i18next'
import GroupSalaries from './GroupSalaries'
import { AuthContext } from 'src/context/AuthContext'

interface Props {
  tab: string
  invoiceData: any
}

// ** Styled Tab component
const Tab = styled(MuiTab)<TabProps>(({ theme }) => ({
  minHeight: 48,
  flexDirection: 'row',
  '& svg': {
    marginBottom: '0 !important',
    marginRight: theme.spacing(1)
  }
}))

const UserViewRight = ({ tab, invoiceData }: Props) => {
  // ** State
  const [activeTab, setActiveTab] = useState<string>(tab)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { t } = useTranslation()
  const { user } = useContext(AuthContext)

  // ** Hooks
  const router = useRouter()

  const handleChange = (event: SyntheticEvent, value: string) => {
    setIsLoading(true)
    setActiveTab(value)
    const path = router.route.replace('[tab]', value.toLowerCase())

    router
      .push({
        pathname: path,
        query: { id: router.query.id, month: router.query.month }
      })
      .then(() => setIsLoading(false))
  }

  useEffect(() => {
    if (tab && tab !== activeTab) {
      setActiveTab(tab)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab])

  useEffect(() => {
    if (invoiceData) {
      setIsLoading(false)
    }
  }, [invoiceData])

  return (
    <TabContext value={activeTab}>
      <TabList
        variant='scrollable'
        scrollButtons='auto'
        onChange={handleChange}
        aria-label='forced scroll tabs example'
        sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}
      >
        <Tab value='security' label='Davomat' icon={<Icon icon='mdi:account-clock' />} />
        {!(user?.role.length === 1 && user?.role.includes('teacher')) && <Tab value='notes' label='Eslatmalar' icon={<Icon icon='mdi:notebook-check-outline' />} />}
        <Tab value='exams' label='Imtixon' icon={<Icon icon='mdi:puzzle-check-outline' />} />
        {!(user?.role.length === 1 && user?.role.includes('teacher')) && <Tab value='discount' label='Chegirmalar' icon={<Icon icon='mdi:sale' />} />}
        {!(user?.role.length === 1 && user?.role.includes('teacher')) && <Tab value='money' label="Maosh" icon={<Icon icon='mdi:money' />} />}
      </TabList>
      <Box sx={{ mt: 2 }}>
        {isLoading ? (
          <Box sx={{ mt: 6, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            <CircularProgress sx={{ mb: 4 }} />
            <Typography>{t("Loading...")}</Typography>
          </Box>
        ) : (
          <>
            <TabPanel sx={{ p: 0 }} value='security'>
              <UserViewSecurity invoiceData={invoiceData} />
            </TabPanel>
            <TabPanel sx={{ p: 0 }} value='exams'>
              <GroupExamsList />
            </TabPanel>
            <TabPanel sx={{ p: 0 }} value='notes'>
              <UserViewOverview />
            </TabPanel>
            <TabPanel sx={{ p: 0 }} value='discount'>
              <UserViewBilling />
            </TabPanel>
            <TabPanel sx={{ p: 0 }} value='money'>
              <GroupSalaries group={invoiceData} />
            </TabPanel>
          </>
        )}
      </Box>
    </TabContext>
  )
}

export default UserViewRight
