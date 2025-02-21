import React, { ReactNode, useContext, useEffect, useMemo, useState } from 'react'
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputLabel,
  Select,
  TextField,
  Typography
} from '@mui/material'
import MenuItem from '@mui/material/MenuItem'
import { useRouter } from 'next/router'
import LoadingButton from '@mui/lab/LoadingButton'
import api from 'src/@core/utils/api'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'src/store'
import * as Yup from 'yup'

import {
  getAttendance,
  getDays,
  getStudents,
  setGettingAttendance,
  setUpdateStatusModal,
  studentsUpdateParams
} from 'src/store/apps/groupDetails'
import useDebounce from 'src/hooks/useDebounce'
import { getMontNumber } from 'src/@core/utils/gwt-month-name'
import { useFormik } from 'formik'
import StudentsDataTable from 'src/@core/components/table/studentsTable'
import GroupDetailRowOptions from '../../GroupDetailRowOptions'
import Link from 'next/link'
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip'
import { styled } from '@mui/material/styles'
import { useSettings } from 'src/@core/hooks/useSettings'
import { formatDateTime } from 'src/@core/utils/date-formatter'
import { Icon } from '@iconify/react'
import { formatCurrency } from 'src/@core/utils/format-currency'
import { AuthContext } from 'src/context/AuthContext'
import { Eye, EyeOff } from 'lucide-react'
export interface customTableProps {
  xs: number
  title: string
  dataIndex?: string | ReactNode
  renderItem?: (source: any) => any | undefined
  render?: (source: any) => any | undefined
}

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#f5f5f9',
    width: '300px',
    minHeight: '250px',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 300,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9'
  }
}))

export default function UserViewStudentsList() {
  const { students, studentsQueryParams, isGettingStudents, updateStatusModal, queryParams } = useAppSelector(
    state => state.groupDetails
  )
  const { settings } = useSettings()
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const [loading, setLoading] = useState<boolean>(false)
  const { user } = useContext(AuthContext)
  const [search, setSearch] = useState('')
  const debounce = useDebounce(search, 500)
  const { query, push } = useRouter()
  const [showBalance, setShowBalance] = useState(false)

  const columns: customTableProps[] = [
    {
      xs: 0.5,
      title: t('ID'),
      dataIndex: 'index',
      render: index => {
        return index
      }
    },
    {
      xs: 1.4,

      title: t('first_name'),
      dataIndex: 'id',
      renderItem: (student: any) => {
        return settings.mode == 'dark' ? (
          <HtmlTooltip
            title={
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '10px',
                  bgcolor: settings.mode != 'dark' ? 'grey.900' : 'background.paper',
                  color: settings.mode != 'dark' ? 'grey.100' : 'text.primary',
                  border: settings.mode != 'dark' ? '1px solid #444' : '1px solid #c3cccc'
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                  <Box>
                    <Typography fontSize={12}>{student?.student.first_name}</Typography>
                    <Typography variant='body2' fontSize={12}>
                      {t(student?.status)}
                    </Typography>
                  </Box>
                  <Typography variant='body2' fontSize={10}>{` ID: ${student?.student?.id} `}</Typography>
                </Box>
                <Box py={1} borderTop={`1px solid ${settings.mode != 'dark' ? '#444' : '#c3cccc'}`}>
                  <Typography variant='body2' fontSize={12}>
                    {t('phone')}
                  </Typography>
                  <Typography fontSize={12}>{student?.student.phone}</Typography>
                </Box>
                <Box py={1} borderTop={`1px solid ${settings.mode != 'dark' ? '#444' : '#c3cccc'}`}>
                  <Typography variant='body2' fontSize={12}>
                    {t('Balans')}
                  </Typography>
                  <Typography fontSize={12}>{`${student?.student.balance} so'm`}</Typography>
                </Box>
                {student.lesson_count !== 0 && (
                  <Box py={1} borderTop={`1px solid ${settings.mode != 'dark' ? '#444' : '#c3cccc'}`}>
                    <Typography variant='body2' fontSize={12}>
                      {t("To'lovgacha qolgan darslar")}
                    </Typography>
                    <Typography fontSize={12}>{`${student?.student.lesson_count} ta`}</Typography>
                  </Box>
                )}
                {studentsQueryParams.status === 'archive' ? (
                  <Box py={1} borderTop={`1px solid ${settings.mode != 'dark' ? '#444' : '#c3cccc'}`}>
                    <Typography variant='body2' fontSize={12}>
                      {t("Talaba qo'shilgan va o'chirilgan sana")}
                    </Typography>
                    <Typography fontSize={12}>
                      {student?.student?.added_at} / {student?.student?.deleted_at}
                    </Typography>
                  </Box>
                ) : (
                  <Box py={1} borderTop={`1px solid ${settings.mode != 'dark' ? '#444' : '#c3cccc'}`}>
                    <Typography variant='body2' fontSize={12}>
                      {t("Talaba qo'shilgan sana")}
                    </Typography>
                    <Typography fontSize={12}>{student?.student?.added_at}</Typography>
                  </Box>
                )}
                {student?.student?.comment && (
                  <Box py={1} borderTop={`1px solid ${settings.mode != 'dark' ? '#444' : '#c3cccc'}`}>
                    <Typography variant='body2' fontSize={12}>
                      {t('Eslatma')}
                    </Typography>
                    <Typography fontSize={12} fontStyle='italic'>
                      {student?.student?.comment.comment}
                    </Typography>
                    <Typography fontSize={12} variant='body2'>{`${student?.student?.comment.user} ${formatDateTime(
                      student?.student?.comment.created_at
                    )}`}</Typography>
                  </Box>
                )}
              </Box>
            }
          >
            <Link
              style={{ textDecoration: 'none', color: '#4C4E64' }}
              href={`/students/view/security/?student=${student?.student.id}`}
            >
              <Typography sx={{
                whiteSpace: "normal",
                wordBreak: "break-word",
                overflowWrap: "break-word",
                textAlign: "center",
                maxWidth: "100px"
              }} fontSize={12}>{student?.student.first_name}</Typography>
            </Link>
          </HtmlTooltip>
        ) : (
          <HtmlTooltip
            title={
              <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', padding: '10px' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                  <Box>
                    <Typography fontSize={12}>{student?.student?.first_name}</Typography>
                    <Typography variant='body2' fontSize={12}>
                      {t(student?.status)}
                    </Typography>
                  </Box>
                  <Typography variant='body2' fontSize={10}>{`( ID: ${student.student.id} )`}</Typography>
                </Box>
                <Box py={1} borderTop={'1px solid #c3cccc'}>
                  <Typography variant='body2' fontSize={12}>
                    {t('phone')}
                  </Typography>
                  <Typography fontSize={12}>{student?.student?.phone}</Typography>
                </Box>
                <Box py={1} borderTop={'1px solid #c3cccc'}>
                  <Typography variant='body2' fontSize={12}>
                    {t('Balans')}
                  </Typography>
                  <Typography fontSize={12}>{`${student.student.balance} so'm`}</Typography>
                </Box>
                {student.student.lesson_count != 0 ? (
                  <Box py={1} borderTop={'1px solid #c3cccc'}>
                    <Typography variant='body2' fontSize={12}>
                      {t("To'lovgacha qolgan darslar")}
                    </Typography>
                    <Typography fontSize={12}>{`${student.student.lesson_count} ta`}</Typography>
                  </Box>
                ) : (
                  ''
                )}
                {studentsQueryParams.status == 'archive' ? (
                  <Box py={1} borderTop={'1px solid #c3cccc'}>
                    <Typography variant='body2' fontSize={12}>
                      {t("Talaba qo'shilgan va o'chirilgan sana")}
                    </Typography>
                    <Typography fontSize={12}>
                      {student.student.added_at} / {student.student.deleted_at}
                    </Typography>
                  </Box>
                ) : (
                  <Box py={1} borderTop={'1px solid #c3cccc'}>
                    <Typography variant='body2' fontSize={12}>
                      {t("Talaba qo'shilgan sana")}
                    </Typography>
                    <Typography fontSize={12}>{student.student.added_at}</Typography>
                  </Box>
                )}
                {student.student.comment && (
                  <Box py={1} borderTop={'1px solid #c3cccc'}>
                    <Typography variant='body2' fontSize={12}>
                      {t('Eslatma')}
                    </Typography>
                    <Typography fontSize={12} fontStyle={'italic'}>
                      {student.student.comment.comment}
                    </Typography>
                    <Typography fontSize={12} variant='body2'>{`${student.student.comment.user} ${formatDateTime(
                      student.student.comment.created_at
                    )}`}</Typography>
                  </Box>
                )}
              </Box>
            }
          >
            <Link
              style={{ textDecoration: 'none', color: '#4C4E64' }}
              href={`/students/view/security/?student=${student?.student.id}`}
            >
              <Typography fontSize={12}>{student?.student.first_name}</Typography>
            </Link>
          </HtmlTooltip>
        )
      }
    },
    {
      xs: 1.6,
      title: t('Telefon raqam'),
      dataIndex: 'student',
      render: (student: any) => {
        return (
          <Link
            style={{ textDecoration: 'none', color: '#4C4E64' }}
            href={`/students/view/security/?student=${student?.id}`}
          >
            <Typography
              sx={{ whiteSpace: 'normal', wordBreak: 'break-word', overflowWrap: 'break-word', width: '100%' }}
              fontSize={12}
            >
              {student?.phone}
            </Typography>
          </Link>
        )
      }
    },

    {
      xs: 1.0,
      title: t('Status'),
      dataIndex: 'id',
      renderItem: (status: any) => {
        const getColorByStatus = (status: string) => {
          switch (status) {
            case 'active':
              return 'success'
            case 'archive':
              return 'error'
            case 'new':
              return 'warning'
            default:
              return 'default'
          }
        }

        return (
          <div onClick={() => dispatch(setUpdateStatusModal(status))}>
            <Chip
              label={
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {t(status?.status)}
                  {updateStatusModal ? (
                    <Icon icon='mdi:chevron-up' style={{ fontSize: '12px' }} />
                  ) : (
                    <Icon icon='mdi:chevron-down' style={{ fontSize: '12px' }} />
                  )}
                </span>
              }
              color={getColorByStatus(status?.status)}
              variant='outlined'
              size='small'
              sx={{
                cursor: 'pointer',
                fontWeight: 500,
                fontSize: '10px',
                padding: 0
              }}
            />
          </div>
        )
      }
    },
    {
      xs: 1.5,
      title: t('Balans'),
      dataIndex: 'student',
      render: (student: any) => {
        const balanceText = formatCurrency(student.balance) + " so'm";
      return(
          <Tooltip title={balanceText}>
            <Chip
               sx={{
                maxWidth: "100px",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                cursor: "pointer",
              }}
              variant='outlined'
              color={student.balance >= 0 ? 'success' : 'error'}
              label={showBalance ? <EyeOff width={15} height={15} /> : formatCurrency(student.balance) + " so'm"}
            />
          </Tooltip>
        )
      }
    },
    {
      xs: 0.8,
      dataIndex: 'id',
      title: t('Harakatlar'),
      render: actions => user?.role[0] != 'teacher' && <GroupDetailRowOptions id={actions} />
    }
  ]
  const formik = useFormik({
    initialValues: { status: updateStatusModal?.status },
    validationSchema: () =>
      Yup.object({
        status: Yup.string()
      }),
    onSubmit: async values => {
      setLoading(true)
      try {
        await api.patch(`common/group-student-update/status/${updateStatusModal?.id}/`, { status: values.status })
        toast.success("O'quvchi malumotlari o'zgartirildi", { position: 'top-center' })
        setLoading(false)
        dispatch(setUpdateStatusModal(null))
        const queryString = new URLSearchParams({ ...studentsQueryParams }).toString()
        const queryStringAttendance = new URLSearchParams(queryParams).toString()
        dispatch(setGettingAttendance(true))
        await dispatch(getStudents({ id: query.id, queryString: queryString }))
        if (query.month && query?.id) {
          await dispatch(
            getAttendance({
              date: `${query?.year || new Date().getFullYear()}-${getMontNumber(query.month)}`,
              group: query?.id,
              queryString: queryStringAttendance
            })
          )
          await dispatch(
            getDays({
              date: `${query?.year || new Date().getFullYear()}-${getMontNumber(query.month)}`,
              group: query?.id
            })
          )
        }
        dispatch(setGettingAttendance(false))
      } catch (err: any) {
        formik.setErrors(err?.response?.data)
        console.log(err?.response?.data)
        setLoading(false)
      }
    }
  })

  useEffect(() => {
    if (updateStatusModal?.status) {
      formik.setFieldValue('status', updateStatusModal?.status)
    }
  }, [updateStatusModal])

  const queryString = useMemo(() => {
    return new URLSearchParams({ ...studentsQueryParams, search: debounce }).toString()
  }, [studentsQueryParams, debounce])

  useEffect(() => {
    dispatch(getStudents({ id: query.id, queryString }))
    dispatch(studentsUpdateParams({ search: debounce }))
  }, [queryString])

  const rowClick = (id: any, item: any) => {
    push(`/students/view/security/?student=${item?.student?.id}`)
  }

  return (
    <Box width='100%'>
      <TextField
        onChange={e => setSearch(e.target.value)}
        autoComplete='off'
        placeholder={t('Qidirish')}
        size='small'
        fullWidth
      />
      <Box
        sx={{
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          mt: '10px',
          gap: '2px'
        }}
      >
        <Button
          startIcon={!showBalance ? <EyeOff /> : <Eye />}
          variant='outlined'
          onClick={() => setShowBalance(!showBalance)}
        >
          {!showBalance ? 'Balansni yopish' : "Balansni ko'rish"}
        </Button>
        <StudentsDataTable loading={isGettingStudents} columns={columns} data={students || []} />

        <Dialog open={updateStatusModal != null} onClose={() => dispatch(setUpdateStatusModal(null))}>
          <form onSubmit={formik.handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <DialogContent sx={{ maxWidth: '350px' }}>
              <Typography sx={{ fontSize: '20px', textAlign: 'center', mb: 3 }}>
                {t("O'quvchini statusini ozgartirish")}
              </Typography>

              <FormControl sx={{ maxWidth: '100%', marginBottom: 3 }} fullWidth>
                <InputLabel size='small' id='demo-simple-select-outlined-label'>
                  Status (holati)
                </InputLabel>

                {formik.values.status && (
                  <Select
                    size='small'
                    label='Status (holati)'
                    value={formik.values.status}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    id='demo-simple-select-outlined'
                    labelId='demo-simple-select-outlined-label'
                    name='status'
                    error={!!formik.errors.status && !!formik.touched.status}
                  >
                    {updateStatusModal?.choices?.map((el: any) => (
                      <MenuItem value={el} key={el}>
                        {t(el)}
                      </MenuItem>
                    ))}
                    {/* <MenuItem value={'new'}>Sinov darsi</MenuItem> */}
                    {/* <MenuItem value={'archive'}>Arxiv</MenuItem> */}
                    {/* <MenuItem value={'frozen'}>Muzlatish</MenuItem> */}
                  </Select>
                )}

                <FormHelperText error>{!!formik.errors.status ? `${formik.errors.status}` : ''}</FormHelperText>
              </FormControl>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
                <Button
                  onClick={() => {
                    dispatch(setUpdateStatusModal(null))
                  }}
                  size='small'
                  variant='outlined'
                  color='error'
                >
                  {t('Bekor qilish')}
                </Button>
                <LoadingButton loading={loading} type='submit' size='small' variant='contained'>
                  {t('Tasdiqlash')}
                </LoadingButton>
              </Box>
            </DialogContent>
          </form>
        </Dialog>

        {/* <Box sx={{ paddingX: '50px' }}>
          <EmptyContent />
        </Box> */}
      </Box>
    </Box>
  )
}
