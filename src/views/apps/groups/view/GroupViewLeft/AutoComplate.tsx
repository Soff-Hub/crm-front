import TextField from '@mui/material/TextField'
import Autocomplete, { AutocompleteChangeReason, AutocompleteChangeDetails } from '@mui/material/Autocomplete'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { StudentDetailType } from 'src/types/apps/studentsTypes'
import useDebounce from 'src/hooks/useDebounce'
import api from 'src/@core/utils/api'
import { AutocompleteValue } from '@mui/material'
import { FormikProps } from 'formik'

interface AutoCompleteProps {
  formik: FormikProps<{ student: number | null }>
  setSelectedStudents: (id: number | null) => void
  selectedStudent: any
}

export default function AutoComplete({ formik, setSelectedStudents, selectedStudent }: AutoCompleteProps) {
  const { t } = useTranslation()
  const [searchData, setSearchData] = useState<{ label: string; id: number }[]>([])
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)

  const searchStudent = async () => {
    setSearchData([])
    const resp = await api.get('student/list/?search=' + search)
    setSearchData(resp.data.results?.map((item: StudentDetailType) => ({ label: item?.first_name, id: item?.id })))
  }

  useEffect(() => {
    if (search !== '') {
      searchStudent()
    } else {
      setSearchData([])
    }
  }, [search])


    
  return (
    <Autocomplete
    
      open={search === '' || selectedStudent ? false : true}
      // disablePortal
      onChange={(
        event: React.SyntheticEvent,
        value: AutocompleteValue<{ label: string; id: number }, false, false, false>,
        reason: AutocompleteChangeReason,
        details?: AutocompleteChangeDetails<{ label: string; id: number }>
      ) => setSelectedStudents(value ? value.id : null)}
      onInputChange={(event: React.SyntheticEvent, value: string) => setSearch(value)}
      id='combo-box-demo'
      options={searchData}
      noOptionsText={"Ma'lumot yoq"}
      renderInput={params => (
        <TextField
          {...params}
          label={t("O'quvchini qidiring")}
          error={!!formik.errors.student && formik.touched.student}
          helperText={formik.errors.student && formik.touched.student ? formik.errors.student : ''}
        />
      )}
    />
  )
}
