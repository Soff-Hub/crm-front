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
import MuiTab, { TabProps } from '@mui/material/Tab'
import Icon from 'src/@core/components/icon'
import UserViewBilling from 'src/views/apps/groups/view/UserViewBilling'
import UserViewOverview from 'src/views/apps/groups/view/GroupsNotes/UserViewOverview'
import UserViewSecurity from 'src/views/apps/groups/view/UserViewSecurity'
import GroupExamsList from './GroupExamList/GroupExamsList'
import { useTranslation } from 'react-i18next'
import { AuthContext } from 'src/context/AuthContext'
import { getAttendance, getAttendanceTeacher, setDays, setResultId } from 'src/store/apps/groupDetails'
import { useAppDispatch, useAppSelector } from 'src/store'
import GroupStudentGrades from './GroupStudentGrades/GroupStudentGradesList'
import AttendanceTable from './GroupAttandance'
import { Button, ButtonGroup } from '@mui/material'
import dayjs from 'dayjs'

interface Props {
  tab: string
}

const Tab = styled(MuiTab)<TabProps>(({ theme }) => ({
  minHeight: 48,
  flexDirection: 'row',
  '& svg': {
    marginBottom: '0 !important',
    marginRight: theme.spacing(1)
  }
}))

const UserViewRight = ({ tab }: Props) => {
  const [activeTab, setActiveTab] = useState<string>(tab)
  const { t } = useTranslation()
  const { user } = useContext(AuthContext)
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [buttonActive, setButtonActive] = useState(true)
  const today = dayjs().format('YYYY-MM-DD')
  const { attendance } = useAppSelector(state => state.groupDetails)
  const handleChange = (event: SyntheticEvent, value: string) => {
    setActiveTab(value)
    const path = router.route.replace('[tab]', value.toLowerCase())
    dispatch(setResultId(null))
    router.push({
      pathname: path,
      query: { id: router.query.id, month: router.query.month }
    })
  }

  async function handleChangeButton(status: boolean) {
    if (status === false) {
      dispatch(
        getAttendanceTeacher({ date: today, group: router.query.id, queryString: 'status=active&is_teacher=true' })
      )
    }
    setButtonActive(status)
  }

  useEffect(() => {
    if (tab && tab !== activeTab) {
      setActiveTab(tab)
    }
  }, [tab])

  

  return (
    <TabContext value={activeTab}>
      <Box>
        {/* {user?.role.length == 1 && user.role.includes('teacher') && (
          <ButtonGroup fullWidth aria-label='Basic button group'>
            <Button
              variant={buttonActive ? 'contained' : 'outlined'}
              onClick={() => {
                handleChangeButton(true), setActiveTab('security')
              }}
            >
              Oylik
            </Button>
            <Button
              variant={!buttonActive ? 'contained' : 'outlined'}
              onClick={() => {
                handleChangeButton(false), setActiveTab('attendance')
              }}
            >
              Kunlik
            </Button>
          </ButtonGroup>
        )} */}
        <TabList
          variant='scrollable'
          scrollButtons='auto'
          onChange={handleChange}
          aria-label='forced scroll tabs example'
          sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}
        >
          {buttonActive && <Tab value='security' label={t('Davomat')} icon={<Icon icon='tabler:user-check' />} />}
          {!buttonActive && <Tab value='attendance' label={t('Davomatlar')} icon={<Icon icon='tabler:user-check' />} />}
          {buttonActive && <Tab value='grade' label={t('Baho')} icon={<Icon icon='mdi:school' />} />}
          {!(user?.role.length === 1 && user?.role.includes('teacher')) && (
            <Tab value='notes' label={t('Eslatmalar')} icon={<Icon icon='fluent:note-add-48-regular' />} />
          )}
          {<Tab value='exams' label={t('Imtixon')} icon={<Icon icon='maki:racetrack' />} />}
          {!(user?.role.length === 1 && user?.role.includes('teacher')) && (
            <Tab value='discount' label={t('Chegirmalar')} icon={<Icon icon='mdi:sale' />} />
          )}
        </TabList>
      </Box>
      <Box sx={{ mt: 2 }}>
        <TabPanel sx={{ p: 0 }} value='security'>
          <UserViewSecurity />
        </TabPanel>
        {!buttonActive && (
          <TabPanel sx={{ p: 0 }} value='attendance'>
            <AttendanceTable attendance={attendance} />
          </TabPanel>
        )}
        <TabPanel sx={{ p: 0 }} value='grade'>
          <GroupStudentGrades />
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
      </Box>
    </TabContext>
  )
}

export default UserViewRight
