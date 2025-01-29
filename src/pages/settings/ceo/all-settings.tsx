import { useContext, useEffect, useRef, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogContent,
  IconButton,
  Skeleton,
  Switch,
  TextField,
  Tooltip,
  Typography
} from '@mui/material'
import IconifyIcon from 'src/@core/components/icon'
import useResponsive from 'src/@core/hooks/useResponsive'
import usePayment from 'src/hooks/usePayment'
import useBranches from 'src/hooks/useBranch'
import LoadingButton from '@mui/lab/LoadingButton'
import api from 'src/@core/utils/api'
import { setCompanyInfo } from 'src/store/apps/user'
import { styled } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'
import showResponseError from 'src/@core/utils/show-response-error'
import { useAppDispatch, useAppSelector } from 'src/store'
import { AuthContext } from 'src/context/AuthContext'
import VideoHeader, { videoUrls } from 'src/@core/components/video-header/video-header'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/router'
import { Icon } from '@iconify/react'

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1
})

export default function AllSettings() {
  const { isMobile } = useResponsive()

  const [editable, setEditable] = useState<
    | null
    | 'title'
    | 'logo'
    | 'start-time'
    | 'end-time'
    | 'birthdate'
    | 'absend'
    | 'payment'
    | 'score'
    | 'attend'
    | 'debtor'
  >(null)
  const [createble, setCreatable] = useState<null | 'branch' | 'payment-type'>(null)
  const [id, setId] = useState<null | { key: 'branch' | 'payment-type'; id: any }>(null)
  const [deleteId, setDeleteId] = useState<null | { open: null | 'payment-type' | 'branch'; id: any }>(null)
  const [name, setName] = useState<string>('')
  const [loading, setLoading] = useState<
    | 'name'
    | 'branch'
    | 'paytype'
    | 'start-time'
    | 'end-time'
    | 'birthdate'
    | 'absend'
    | 'delete'
    | 'payment'
    | 'score'
    | 'attend'
    | 'debtor'
    | null
  >(null)
  const [error, setError] = useState<any>({})
  const [errorMessage, setErrorMessage] = useState<null | string>(null)
  const { push } = useRouter()

  const { getPaymentMethod, paymentMethods, createPaymentMethod, updatePaymentMethod } = usePayment()
  const { getBranches, branches } = useBranches()
  const dispatch = useAppDispatch()
  const { companyInfo } = useAppSelector((state: any) => state.user)
  const { t } = useTranslation()
  const [settinsLoading, setSettingsLoading] = useState(false)
  const { setUser, user } = useContext(AuthContext)
  // const birthday_text = localStorage.getItem('birthday_text')
  // const absent_text = localStorage.getItem('absent_text')
  // const payment_text = localStorage.getItem('payment_text')
  // const score_text = localStorage.getItem('score_text')
  // const attend_text = localStorage.getItem('attend_text')

  async function getSettingsList() {
    setSettingsLoading(true)
    await api.get('common/settings/list/').then(res => {
      dispatch(setCompanyInfo(res.data[0]))
    })
    setSettingsLoading(false)
  }

  useEffect(() => {
    getSettingsList()
  }, [])

  const inputRef = useRef<any | null>(null)

  useEffect(() => {
    if (createble === 'branch' || (createble === 'payment-type' && inputRef.current)) {
      inputRef.current.focus()
    }
  }, [createble])

  const reloadProfile = async () => {
    await api.get('auth/profile/').then(async response => {
      setUser({
        phone: response.data?.gpa,
        gpa: response.data?.gpa,
        id: response.data.id,
        fullName: response.data.first_name,
        username: response.data.phone,
        password: 'null',
        avatar: response.data.image,
        payment_page: response.data.payment_page,
        role: response.data.roles.filter((el: any) => el.exists).map((el: any) => el.name?.toLowerCase()),
        balance: response.data?.balance || 0,
        branches: response.data.branches.filter((item: any) => item.exists === true),
        active_branch: response.data.active_branch,
        qr_code: response.data.qr_code
      })
    })
  }

  const createPaymentType = async () => {
    setLoading('paytype')
    try {
      await createPaymentMethod({ name })
      setTimeout(() => {
        setLoading(null)
        setCreatable(null)
        getPaymentMethod()
      }, 400)
    } catch (err) {
      setLoading(null)
      console.log(err)
    }
  }

  const createBranch = async () => {
    setLoading('branch')
    try {
      await api.post(`/common/branch/create`, { name })
      await reloadProfile()
      setTimeout(() => {
        setLoading(null)
        setCreatable(null)
        getBranches()
      }, 400)
    } catch (err) {
      setLoading(null)
      console.log(err)
    }
  }

  const updateBranch = async () => {
    setLoading('branch')
    try {
      await api.patch(`/common/branch/update/${id?.id}`, { name })
      await reloadProfile()
      setCreatable(null)
      setLoading(null)
      getBranches()
      setId(null)
    } catch (err) {
      setLoading(null)
      console.log(err)
    }
  }

  console.log(loading)

  const updateSettings = async (key: any, value: any) => {
    if (key === 'training_center_name') {
      setLoading('name')
    } else if (key === 'work_start_time') {
      setLoading('start-time')
    } else if (key === 'work_end_time') {
      setLoading('end-time')
    }

    try {
      const formData: any = new FormData()
      formData.append(key, value)
      console.log(key, value)

      if (
        key === 'on_birthday' ||
        key === 'birthday_text' ||
        key === 'on_absent' ||
        key === 'absent_text' ||
        key === 'payment_warning' ||
        key === 'payment_text' ||
        key === 'on_score' ||
        key === 'score_text' ||
        key === 'on_attend' ||
        key === 'attend_text' ||
        key === 'debt_text' ||
        key === 'for_debtor'
      ) {
        if (key === 'on_birthday') {
          setLoading('birthdate')
          formData.append('birthday_text', companyInfo?.auto_sms?.birthday_text)
          formData.append('on_absent', companyInfo?.auto_sms?.on_absent)
          formData.append('absent_text', companyInfo?.auto_sms?.absent_text)
          formData.append('payment_warning', companyInfo?.auto_sms?.payment_warning)
          formData.append('payment_text', companyInfo?.auto_sms?.payment_text)
          formData.append('on_score', companyInfo?.auto_sms?.on_score)
          formData.append('score_text', companyInfo?.auto_sms?.score_text)
          formData.append('on_attend', companyInfo?.auto_sms?.on_attend)
          formData.append('attend_text', companyInfo?.auto_sms?.attend_text)
          formData.append('for_debtor', companyInfo?.auto_sms?.for_debtor)
          formData.append('debt_text', companyInfo?.auto_sms?.debt_text)
        } else if (key === 'birthday_text') {
          setLoading('birthdate')
          formData.append('on_birthday', true)
          formData.append('on_absent', companyInfo?.auto_sms?.on_absent)
          formData.append('absent_text', companyInfo?.auto_sms?.absent_text)
          formData.append('payment_warning', companyInfo?.auto_sms?.payment_warning)
          formData.append('payment_text', companyInfo?.auto_sms?.payment_text)
          formData.append('on_score', companyInfo?.auto_sms?.on_score)
          formData.append('score_text', companyInfo?.auto_sms?.score_text)
          formData.append('on_attend', companyInfo?.auto_sms?.on_attend)
          formData.append('attend_text', companyInfo?.auto_sms?.attend_text)
          formData.append('for_debtor', companyInfo?.auto_sms?.for_debtor)
          formData.append('debt_text', companyInfo?.auto_sms?.debt_text)
        } else if (key === 'payment_warning') {
          setLoading('payment')
          formData.append('payment_text', companyInfo?.auto_sms?.payment_text)
          formData.append('on_absent', companyInfo?.auto_sms?.on_absent)
          formData.append('absent_text', companyInfo?.auto_sms?.absent_text)
          formData.append('on_birthday', companyInfo?.auto_sms?.on_birthday)
          formData.append('birthday_text', companyInfo?.auto_sms?.birthday_text)
          formData.append('on_score', companyInfo?.auto_sms?.on_score)
          formData.append('score_text', companyInfo?.auto_sms?.score_text)
          formData.append('on_attend', companyInfo?.auto_sms?.on_attend)
          formData.append('attend_text', companyInfo?.auto_sms?.attend_text)
          formData.append('for_debtor', companyInfo?.auto_sms?.for_debtor)
          formData.append('debt_text', companyInfo?.auto_sms?.debt_text)
        } else if (key === 'payment_text') {
          setLoading('payment')
          formData.append('payment_warning', true)
          formData.append('on_absent', companyInfo?.auto_sms?.on_absent)
          formData.append('absent_text', companyInfo?.auto_sms?.absent_text)
          formData.append('on_birthday', companyInfo?.auto_sms?.on_birthday)
          formData.append('birthday_text', companyInfo?.auto_sms?.birthday_text)
          formData.append('on_score', companyInfo?.auto_sms?.on_score)
          formData.append('score_text', companyInfo?.auto_sms?.score_text)
          formData.append('on_attend', companyInfo?.auto_sms?.on_attend)
          formData.append('attend_text', companyInfo?.auto_sms?.attend_text)
          formData.append('for_debtor', companyInfo?.auto_sms?.for_debtor)
          formData.append('debt_text', companyInfo?.auto_sms?.debt_text)
        } else if (key === 'on_score') {
          setLoading('score')
          formData.append('payment_warning', companyInfo?.auto_sms?.payment_warning)
          formData.append('payment_text', companyInfo?.auto_sms?.payment_text)
          formData.append('on_absent', companyInfo?.auto_sms?.on_absent)
          formData.append('absent_text', companyInfo?.auto_sms?.absent_text)
          formData.append('on_birthday', companyInfo?.auto_sms?.on_birthday)
          formData.append('birthday_text', companyInfo?.auto_sms?.birthday_text)
          formData.append('score_text', companyInfo?.auto_sms?.score_text)
          formData.append('on_attend', companyInfo?.auto_sms?.on_attend)
          formData.append('attend_text', companyInfo?.auto_sms?.attend_text)
          formData.append('for_debtor', companyInfo?.auto_sms?.for_debtor)
          formData.append('debt_text', companyInfo?.auto_sms?.debt_text)
        } else if (key === 'score_text') {
          setLoading('score')
          formData.append('on_score', true)
          formData.append('payment_warning', companyInfo?.auto_sms?.payment_warning)
          formData.append('payment_text', companyInfo?.auto_sms?.payment_text)
          formData.append('on_absent', companyInfo?.auto_sms?.on_absent)
          formData.append('absent_text', companyInfo?.auto_sms?.absent_text)
          formData.append('on_birthday', companyInfo?.auto_sms?.on_birthday)
          formData.append('birthday_text', companyInfo?.auto_sms?.birthday_text)
          formData.append('on_attend', companyInfo?.auto_sms?.on_attend)
          formData.append('attend_text', companyInfo?.auto_sms?.attend_text)
          formData.append('for_debtor', companyInfo?.auto_sms?.for_debtor)
          formData.append('debt_text', companyInfo?.auto_sms?.debt_text)
        } else if (key === 'on_attend') {
          setLoading('attend')
          formData.append('payment_warning', companyInfo?.auto_sms?.payment_warning)
          formData.append('payment_text', companyInfo?.auto_sms?.payment_text)
          formData.append('on_absent', companyInfo?.auto_sms?.on_absent)
          formData.append('absent_text', companyInfo?.auto_sms?.absent_text)
          formData.append('on_birthday', companyInfo?.auto_sms?.on_birthday)
          formData.append('birthday_text', companyInfo?.auto_sms?.birthday_text)
          formData.append('score_text', companyInfo?.auto_sms?.score_text)
          formData.append('attend_text', companyInfo?.auto_sms?.attend_text)
          formData.append('for_debtor', companyInfo?.auto_sms?.for_debtor)
          formData.append('debt_text', companyInfo?.auto_sms?.debt_text)
        } else if (key === 'attend_text') {
          setLoading('attend')
          formData.append('on_attend', true)
          formData.append('payment_warning', companyInfo?.auto_sms?.payment_warning)
          formData.append('payment_text', companyInfo?.auto_sms?.payment_text)
          formData.append('on_absent', companyInfo?.auto_sms?.on_absent)
          formData.append('absent_text', companyInfo?.auto_sms?.absent_text)
          formData.append('on_birthday', companyInfo?.auto_sms?.on_birthday)
          formData.append('birthday_text', companyInfo?.auto_sms?.birthday_text)
          formData.append('on_score', companyInfo?.auto_sms?.on_score)
          formData.append('for_debtor', companyInfo?.auto_sms?.for_debtor)
          formData.append('debt_text', companyInfo?.auto_sms?.debt_text)
        } else if (key === 'for_debtor') {
          setLoading('debtor')
          formData.append('debt_text', companyInfo?.auto_sms?.attend_text)
          formData.append('payment_warning', companyInfo?.auto_sms?.payment_warning)
          formData.append('payment_text', companyInfo?.auto_sms?.payment_text)
          formData.append('on_absent', companyInfo?.auto_sms?.on_absent)
          formData.append('absent_text', companyInfo?.auto_sms?.absent_text)
          formData.append('on_birthday', companyInfo?.auto_sms?.on_birthday)
          formData.append('birthday_text', companyInfo?.auto_sms?.birthday_text)
          formData.append('score_text', companyInfo?.auto_sms?.score_text)
          formData.append('attend_text', companyInfo?.auto_sms?.attend_text)
          formData.append('on_attend', companyInfo?.auto_sms?.on_attend)
        } else if (key === 'debt_text') {
          setLoading('debtor')
          formData.append('for_debtor', true)
          formData.append('on_attend', companyInfo?.auto_sms?.on_attend)
          formData.append('attend_text', companyInfo?.auto_sms?.attend_text)
          formData.append('payment_warning', companyInfo?.auto_sms?.payment_warning)
          formData.append('payment_text', companyInfo?.auto_sms?.payment_text)
          formData.append('on_absent', companyInfo?.auto_sms?.on_absent)
          formData.append('absent_text', companyInfo?.auto_sms?.absent_text)
          formData.append('on_birthday', companyInfo?.auto_sms?.on_birthday)
          formData.append('birthday_text', companyInfo?.auto_sms?.birthday_text)
          formData.append('on_score', companyInfo?.auto_sms?.on_score)
        } else if (key === 'on_absent') {
          setLoading('absend')
          formData.append(
            'absent_text',
            'Assalomu Alaykum, siz kecha dars qoldirdingiz iltimos sababini bildirishni unurtmang'
          )
          formData.append('on_birthday', companyInfo?.auto_sms?.on_birthday)
          formData.append('birthday_text', companyInfo?.auto_sms?.birthday_text)
          formData.append('payment_warning', companyInfo?.auto_sms?.payment_warning)
          formData.append('payment_text', companyInfo?.auto_sms?.payment_text)
          formData.append('on_score', companyInfo?.auto_sms?.on_score)
          formData.append('score_text', companyInfo?.auto_sms?.score_text)
          formData.append('on_attend', companyInfo?.auto_sms?.on_attend)
          formData.append('attend_text', companyInfo?.auto_sms?.attend_text)
          formData.append('for_debtor', companyInfo?.auto_sms?.for_debtor)
          formData.append('debt_text', companyInfo?.auto_sms?.debt_text)
        } else {
          setLoading('absend')
          formData.append('on_absent', true)
          formData.append('on_birthday', companyInfo?.auto_sms?.on_birthday)
          formData.append('birthday_text', companyInfo?.auto_sms?.birthday_text)
          formData.append('payment_warning', companyInfo?.auto_sms?.payment_warning)
          formData.append('payment_text', companyInfo?.auto_sms?.payment_text)
          formData.append('on_score', companyInfo?.auto_sms?.on_score)
          formData.append('score_text', companyInfo?.auto_sms?.score_text)
          formData.append('on_attend', companyInfo?.auto_sms?.on_attend)
          formData.append('attend_text', companyInfo?.auto_sms?.attend_text)
          formData.append('for_debtor', companyInfo?.auto_sms?.for_debtor)
          formData.append('debt_text', companyInfo?.auto_sms?.debt_text)
        }

        await api.put('common/auto-sms/update/', formData)
        setName('')
      } else {
        await api.patch('common/settings/update/', formData)
      }

      const getresp = await api.get('common/settings/list/')

      dispatch(setCompanyInfo(getresp.data[0]))
      setEditable(null)
      setId(null)
    } catch (err: any) {
      if (err?.response?.data) {
        showResponseError(err?.response?.data, setError)
      }
    } finally {
      setLoading(null)
    }
  }

  function handleClose() {
    setDeleteId(null)
    setErrorMessage(null)
  }

  useEffect(() => {
    if (
      !user?.role.includes('ceo') &&
      !user?.role.includes('admin') &&
      !user?.role.includes('watcher') &&
      !user?.role.includes('marketolog')
    ) {
      push('/')
      toast.error("Sizda bu sahifaga kirish huquqi yo'q!")
    }
    Promise.all([getPaymentMethod(), getBranches()])
  }, [])

  return (
    <div>
      <VideoHeader item={videoUrls.all_settings} />

      <Box sx={{ display: 'flex', gap: '15px', flexDirection: isMobile ? 'column' : 'row', px: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '100%' }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
                <Typography sx={{ minWidth: isMobile ? '90px' : '180px', fontSize: isMobile ? '13px' : '16px' }}>
                  {t('Tashkilot nomi')}:
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {editable === 'title' ? (
                    <>
                      <TextField
                        size='small'
                        focused
                        defaultValue={companyInfo?.training_center_name}
                        onChange={e => setName(e.target.value)}
                      />
                      <IconifyIcon
                        icon={loading === 'name' ? 'line-md:loading-loop' : 'ic:baseline-check'}
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          updateSettings('training_center_name', name)
                        }}
                      />
                    </>
                  ) : (
                    <>
                      <TextField
                        value={companyInfo?.training_center_name}
                        size='small'
                        placeholder={t('Tashkilot nomi')}
                        onBlur={e => console.log(e.target.value)}
                      />
                      <IconifyIcon
                        icon={'basil:edit-outline'}
                        style={{ cursor: 'pointer' }}
                        onClick={() => setEditable('title')}
                      />
                    </>
                  )}
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <Typography sx={{ minWidth: isMobile ? '90px' : '180px', fontSize: isMobile ? '13px' : '16px' }}>
                  {t('Logo')}:
                </Typography>
                <img src={companyInfo?.logo} height={35} />
                <Button
                  component='label'
                  role={undefined}
                  variant='contained'
                  size='small'
                  tabIndex={-1}
                  startIcon={<IconifyIcon icon={'mynaui:upload'} />}
                >
                  {t('Yangilash')}
                  <VisuallyHiddenInput
                    type='file'
                    onChange={(e: any) => {
                      updateSettings('logo', e.target.files[0])
                    }}
                  />
                </Button>
              </Box>
            </CardContent>
          </Card>

          {settinsLoading ? (
            <>
              <Box
                sx={{
                  display: 'flex',
                  maxHeight: 200,
                  borderRadius: '8px',
                  flexDirection: 'column',
                  gap: '15px',
                  width: '100%'
                }}
                className='p-4  rounded-lg bg-white shadow-sm'
              >
                <Box display='flex' alignItems='center' gap={2} mb={1}>
                  <Skeleton variant='text' width={180} />
                  <Skeleton variant='circular' width={34} />
                </Box>

                <Skeleton variant='text' width='90%' height={16} sx={{ mb: 2 }} />

                <Skeleton variant='text' width={120} height={20} sx={{ mb: 1 }} />

                <Skeleton variant='rectangular' width='100%' height={80} sx={{ borderRadius: '8px' }} />
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  maxHeight: 200,
                  borderRadius: '8px',
                  flexDirection: 'column',
                  gap: '15px',
                  width: '100%'
                }}
                className='p-4  rounded-lg bg-white shadow-sm'
              >
                <Box display='flex' alignItems='center' gap={2} mb={1}>
                  <Skeleton variant='text' width={180} />
                  <Skeleton variant='circular' width={34} />
                </Box>

                <Skeleton variant='text' width='90%' height={16} sx={{ mb: 2 }} />

                <Skeleton variant='text' width={120} height={20} sx={{ mb: 1 }} />

                <Skeleton variant='rectangular' width='100%' height={80} sx={{ borderRadius: '8px' }} />
              </Box>
            </>
          ) : (
            <>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', gap: '20px' }}>
                    <Typography sx={{ minWidth: isMobile ? '90px' : '180px', fontSize: isMobile ? '13px' : '16px' }}>
                      {t('Filiallar')}:
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      {branches.map((branch: any) => (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }} key={branch.id}>
                          {id?.id === branch.id && id?.key === 'branch' ? (
                            <TextField
                              size='small'
                              focused
                              defaultValue={branch.name}
                              onChange={e => setName(e.target.value)}
                              onBlur={updateBranch}
                            />
                          ) : (
                            <TextField size='small' value={branch.name} />
                          )}
                          {id?.id === branch.id && id?.key === 'branch' ? (
                            <IconifyIcon
                              icon={loading === 'branch' ? 'line-md:loading-loop' : 'ic:baseline-check'}
                              style={{ cursor: 'pointer' }}
                              onClick={updateBranch}
                            />
                          ) : (
                            <IconifyIcon
                              icon={'basil:edit-outline'}
                              style={{ cursor: 'pointer' }}
                              onClick={() => setId({ id: branch.id, key: 'branch' })}
                            />
                          )}
                          <IconifyIcon
                            icon={'fluent:delete-20-regular'}
                            style={{ cursor: 'pointer' }}
                            onClick={() => setDeleteId({ open: 'branch', id: branch.id })}
                          />
                        </Box>
                      ))}
                      {createble === 'branch' && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <TextField
                            size='small'
                            inputRef={inputRef}
                            placeholder={t('Yangi filial')}
                            onChange={e => setName(e.target.value)}
                          />
                          <IconifyIcon
                            icon={loading === 'branch' ? 'line-md:loading-loop' : 'ic:baseline-check'}
                            style={{ cursor: 'pointer' }}
                            onClick={createBranch}
                          />
                          <IconifyIcon
                            icon={'ic:outline-close'}
                            style={{ cursor: 'pointer' }}
                            onClick={() => setCreatable(null)}
                          />
                        </Box>
                      )}
                      <Button
                        size='small'
                        startIcon={<IconifyIcon icon={'ic:outline-add'} />}
                        variant='outlined'
                        onClick={() => setCreatable('branch')}
                      >
                        {t('Yangi')}
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', gap: '20px' }}>
                    <Typography sx={{ minWidth: isMobile ? '90px' : '180px', fontSize: isMobile ? '13px' : '16px' }}>
                      {t('Tolov usullari')}:
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      {paymentMethods.map((method: any) => (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }} key={method.id}>
                          {id?.id === method.id && id?.key === 'payment-type' ? (
                            <TextField
                              size='small'
                              focused
                              defaultValue={method.name}
                              onBlur={async e => {
                                setLoading('paytype')
                                await updatePaymentMethod(method.id, { name: e.target.value })
                                setLoading(null)
                              }}
                            />
                          ) : (
                            <TextField size='small' value={method.name} onBlur={e => console.log(e.target.value)} />
                          )}
                          {id?.id === method.id && id?.key === 'payment-type' ? (
                            <IconifyIcon
                              icon={loading === 'paytype' ? 'line-md:loading-loop' : 'ic:baseline-check'}
                              style={{ cursor: 'pointer' }}
                              onClick={() => setId(null)}
                            />
                          ) : (
                            <IconifyIcon
                              icon={'basil:edit-outline'}
                              style={{ cursor: 'pointer' }}
                              onClick={() => setId({ id: method.id, key: 'payment-type' })}
                            />
                          )}
                          <IconifyIcon
                            icon={'fluent:delete-20-regular'}
                            style={{ cursor: 'pointer' }}
                            onClick={() => setDeleteId({ open: 'payment-type', id: method.id })}
                          />
                        </Box>
                      ))}
                      {createble === 'payment-type' && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <TextField
                            size='small'
                            inputRef={inputRef}
                            placeholder="To'lov turi"
                            onChange={e => setName(e.target.value)}
                          />
                          <IconifyIcon
                            icon={loading === 'paytype' ? 'line-md:loading-loop' : 'ic:baseline-check'}
                            style={{ cursor: 'pointer' }}
                            onClick={createPaymentType}
                          />
                          <IconifyIcon
                            icon={'ic:outline-close'}
                            style={{ cursor: 'pointer' }}
                            onClick={() => setCreatable(null)}
                          />
                        </Box>
                      )}
                      <Button
                        size='small'
                        startIcon={<IconifyIcon icon={'ic:outline-add'} />}
                        variant='outlined'
                        onClick={() => setCreatable('payment-type')}
                      >
                        {t('Yangi')}
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </>
          )}
        </Box>
        {settinsLoading ? (
          <>
            <Box
              sx={{
                display: 'flex',
                maxHeight: 250,
                borderRadius: '8px',
                flexDirection: 'column',
                gap: '15px',
                width: '100%'
              }}
              className='p-4  rounded-lg bg-white shadow-sm'
            >
              <Box display='flex' alignItems='center' gap={2} mb={1}>
                <Skeleton variant='text' width={180} />
                <Skeleton variant='circular' width={34} />
              </Box>

              <Skeleton variant='text' width='90%' height={16} sx={{ mb: 2 }} />

              <Skeleton variant='text' width={120} height={20} sx={{ mb: 1 }} />

              <Skeleton variant='rectangular' width='100%' height={80} sx={{ borderRadius: '8px' }} />
            </Box>
          </>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '100%' }}>
            <Card>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <Typography sx={{ minWidth: isMobile ? '90px' : '180px', fontSize: isMobile ? '13px' : '16px' }}>
                    {t('Ish boshlanish vaqti')}:
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {editable === 'start-time' ? (
                      <>
                        <TextField
                          type='time'
                          size='small'
                          focused
                          defaultValue={companyInfo?.work_start_time}
                          onChange={e => setName(e.target.value)}
                          onBlur={e => {
                            updateSettings('work_start_time', e.target.value)
                          }}
                        />
                        <IconifyIcon
                          icon={loading === 'start-time' ? 'line-md:loading-loop' : 'ic:baseline-check'}
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            updateSettings('work_start_time', name)
                          }}
                        />
                      </>
                    ) : (
                      <>
                        <TextField
                          type='text'
                          value={`${companyInfo?.work_start_time}`}
                          size='small'
                          placeholder={t('Ish boshlanish vaqti')}
                          onBlur={e => console.log(e.target.value)}
                        />
                        <IconifyIcon
                          icon={'basil:edit-outline'}
                          style={{ cursor: 'pointer' }}
                          onClick={() => setEditable('start-time')}
                        />
                      </>
                    )}
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <Typography sx={{ minWidth: isMobile ? '90px' : '180px', fontSize: isMobile ? '13px' : '16px' }}>
                    {t('Ish tugash vaqti')}:
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {editable === 'end-time' ? (
                      <>
                        <TextField
                          type='time'
                          size='small'
                          focused
                          defaultValue={companyInfo?.work_end_time}
                          onBlur={e => {
                            updateSettings('work_end_time', e.target.value)
                          }}
                        />
                        <IconifyIcon
                          icon={loading === 'end-time' ? 'line-md:loading-loop' : 'ic:baseline-check'}
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            updateSettings('work_end_time', name)
                          }}
                        />
                      </>
                    ) : (
                      <>
                        <TextField
                          type='text'
                          value={`${companyInfo?.work_end_time}`}
                          size='small'
                          placeholder={t('Boshlanish vaqti')}
                          onBlur={e => console.log(e.target.value)}
                        />
                        <IconifyIcon
                          icon={'basil:edit-outline'}
                          style={{ cursor: 'pointer' }}
                          onClick={() => setEditable('end-time')}
                        />
                      </>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <Box>
                    <Typography sx={{ minWidth: isMobile ? '90px' : '180px', fontSize: isMobile ? '13px' : '16px' }}>
                      {t("Tug'ilgan kunda sms bilan tabriklash")}:
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {loading === 'birthdate' ? (
                      <CircularProgress disableShrink size={'20px'} sx={{ margin: '10px 0', marginLeft: '15px' }} />
                    ) : (
                      <Switch
                        checked={Boolean(companyInfo?.auto_sms?.on_birthday)}
                        onChange={async (e, i) => {
                          await updateSettings('on_birthday', i)
                        }}
                      />
                    )}
                  </Box>
                </Box>
                <Typography sx={{ marginBottom: 5 }} fontSize={12}>
                  {"Xabar matniga talaba ismini qo'shish uchun ${first_name} kalit so'zi qoldiring."}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '20px', flexDirection: 'column' }}>
                  <Typography sx={{ minWidth: isMobile ? '90px' : '180px', fontSize: isMobile ? '13px' : '16px' }}>
                    {t('SMS Matni')}:
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '10px', width: '100%' }}>
                    {editable === 'birthdate' ? (
                      <>
                        <TextField
                          multiline
                          rows={4}
                          size='small'
                          focused
                          value={companyInfo?.auto_sms?.birthday_text}
                          onBlur={e => {
                            updateSettings('birthday_text', e.target.value)
                          }}
                          onChange={e => {
                            setName(e.target.value), localStorage.setItem('birthday_text', e.target.value)
                          }}
                          fullWidth
                        />
                        <IconifyIcon
                          icon={loading === 'birthdate' ? 'line-md:loading-loop' : 'ic:baseline-check'}
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            updateSettings('birthday_text', name)
                          }}
                        />
                      </>
                    ) : (
                      <>
                        <TextField
                          fullWidth
                          multiline
                          rows={4}
                          type='text'
                          value={`${companyInfo?.auto_sms?.birthday_text}`}
                          size='small'
                          placeholder={t('SMS Matni')}
                          onBlur={e => console.log(e.target.value)}
                        />
                        <IconifyIcon
                          icon={'basil:edit-outline'}
                          style={{ cursor: 'pointer' }}
                          onClick={() => setEditable('birthdate')}
                        />
                      </>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <Typography sx={{ minWidth: isMobile ? '90px' : '180px', fontSize: isMobile ? '13px' : '16px' }}>
                    {t('Darsga kelmaganlarga sms yuborish')}:
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {loading === 'absend' ? (
                      <CircularProgress disableShrink size={'20px'} sx={{ margin: '10px 0', marginLeft: '15px' }} />
                    ) : (
                      <Switch
                        checked={Boolean(companyInfo?.auto_sms?.on_absent)}
                        onChange={async (e, i) => {
                          setLoading('absend')
                          await updateSettings('on_absent', i)
                        }}
                      />
                    )}
                  </Box>
                </Box>
                <Typography sx={{ marginBottom: 5 }} fontSize={12}>
                  {"Xabar matniga talaba ismini qo'shish uchun ${first_name} kalit so'zi qoldiring."}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '20px', flexDirection: 'column' }}>
                  <Typography sx={{ minWidth: isMobile ? '90px' : '180px', fontSize: isMobile ? '13px' : '16px' }}>
                    {t(`SMS matnini kiriting (kelmagan o'quvchiga ertasi kuni yuboriladi)`)}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '10px', width: '100%' }}>
                    {editable === 'absend' ? (
                      <>
                        <TextField
                          multiline
                          rows={4}
                          size='small'
                          focused
                          defaultValue={companyInfo?.auto_sms?.absent_text}
                          onBlur={e => {
                            updateSettings('absent_text', e.target.value)
                          }}
                          onChange={e => {
                            setName(e.target.value), localStorage.setItem('absent_text', e.target.value)
                          }}
                          fullWidth
                        />
                        <IconifyIcon
                          icon={loading === 'absend' ? 'line-md:loading-loop' : 'ic:baseline-check'}
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            updateSettings('absent_text', name)
                          }}
                        />
                      </>
                    ) : (
                      <>
                        <TextField
                          fullWidth
                          multiline
                          rows={4}
                          type='text'
                          value={`${companyInfo?.auto_sms?.absent_text}`}
                          size='small'
                          placeholder={t('Boshlanish vaqti')}
                          onBlur={e => console.log(e.target.value)}
                        />
                        <IconifyIcon
                          icon={'basil:edit-outline'}
                          style={{ cursor: 'pointer' }}
                          onClick={() => setEditable('absend')}
                        />
                      </>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <Typography sx={{ minWidth: isMobile ? '90px' : '180px', fontSize: isMobile ? '13px' : '16px' }}>
                    {t('Darsga kelganlarga sms yuborish')}:
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {loading === 'attend' ? (
                      <CircularProgress disableShrink size={'20px'} sx={{ margin: '10px 0', marginLeft: '15px' }} />
                    ) : (
                      <Switch
                        checked={companyInfo?.auto_sms?.on_attend}
                        onChange={async (e, i) => {
                          setLoading('attend')
                          await updateSettings('on_attend', i)
                        }}
                      />
                    )}
                  </Box>
                </Box>
                <Typography sx={{ marginBottom: 5 }} fontSize={12}>
                  {"Xabar matniga talaba ismini qo'shish uchun ${first_name} kalit so'zi qoldiring."}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '20px', flexDirection: 'column' }}>
                  <Typography sx={{ minWidth: isMobile ? '90px' : '180px', fontSize: isMobile ? '13px' : '16px' }}>
                    {t(`SMS matnini kiriting (kelgan o'quvchiga ertasi kuni yuboriladi)`)}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '10px', width: '100%' }}>
                    {editable === 'attend' ? (
                      <>
                        <TextField
                          multiline
                          rows={4}
                          size='small'
                          focused
                          defaultValue={companyInfo?.auto_sms?.attend_text}
                          onBlur={e => {
                            updateSettings('attend_text', e.target.value)
                          }}
                          onChange={e => {
                            setName(e.target.value), localStorage.setItem('attend_text', e.target.value)
                          }}
                          fullWidth
                        />
                        <IconifyIcon
                          icon={loading === 'attend' ? 'line-md:loading-loop' : 'ic:baseline-check'}
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            updateSettings('attend_text', name)
                          }}
                        />
                      </>
                    ) : (
                      <>
                        <TextField
                          fullWidth
                          multiline
                          rows={4}
                          type='text'
                          value={companyInfo?.auto_sms?.attend_text || 'Text'}
                          size='small'
                          placeholder={t('Boshlanish vaqti')}
                          onBlur={e => console.log(e.target.value)}
                        />
                        <IconifyIcon
                          icon={'basil:edit-outline'}
                          style={{ cursor: 'pointer' }}
                          onClick={() => setEditable('attend')}
                        />
                      </>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <Typography sx={{ minWidth: isMobile ? '90px' : '180px', fontSize: isMobile ? '13px' : '16px' }}>
                    {t("To'lovi yaqin qolganlarni ogohlantirish")}:{' '}
                    <Tooltip
                      title={
                        <Typography
                          color='white'
                          sx={{
                            minWidth: isMobile ? '90px' : '180px',
                            fontSize: isMobile ? '10px' : '13px'
                          }}
                        >
                          {t("Xabar to'lovga 7 kun qolganda yuboriladi")}
                        </Typography>
                      }
                      arrow
                    >
                      <span style={{ cursor: 'pointer' }}>
                        <Icon
                          icon='mdi:help-circle-outline'
                          style={{ fontSize: isMobile ? '16px' : '20px', marginLeft: '5px' }}
                        />
                      </span>
                    </Tooltip>
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {loading === 'payment' ? (
                      <CircularProgress disableShrink size={'20px'} sx={{ margin: '10px 0', marginLeft: '15px' }} />
                    ) : (
                      <Switch
                        checked={Boolean(companyInfo?.auto_sms?.payment_warning)}
                        onChange={async (e, i) => {
                          await updateSettings('payment_warning', i)
                        }}
                      />
                    )}
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '20px', flexDirection: 'column' }}>
                  <Typography sx={{ minWidth: isMobile ? '90px' : '180px', fontSize: isMobile ? '13px' : '16px' }}>
                    {t('SMS Matni')}:
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '10px', width: '100%' }}>
                    {editable === 'payment' ? (
                      <>
                        <TextField
                          multiline
                          rows={4}
                          size='small'
                          focused
                          defaultValue={companyInfo?.auto_sms?.payment_text || ''}
                          onBlur={e => {
                            updateSettings('payment_text', e.target.value)
                          }}
                          onChange={e => {
                            setName(e.target.value), localStorage.setItem('payment_text', e.target.value)
                          }}
                          fullWidth
                        />
                        <IconifyIcon
                          icon={loading === 'payment' ? 'line-md:loading-loop' : 'ic:baseline-check'}
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            updateSettings('payment_text', name)
                          }}
                        />
                      </>
                    ) : (
                      <>
                        <TextField
                          fullWidth
                          multiline
                          rows={4}
                          type='text'
                          value={`${companyInfo?.auto_sms?.payment_text}`}
                          size='small'
                          placeholder={t('SMS Matni')}
                          onBlur={e => console.log(e.target.value)}
                        />
                        <IconifyIcon
                          icon={'basil:edit-outline'}
                          style={{ cursor: 'pointer' }}
                          onClick={() => setEditable('payment')}
                        />
                      </>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <Typography sx={{ minWidth: isMobile ? '90px' : '180px', fontSize: isMobile ? '13px' : '16px' }}>
                    {t('Qarzdorlarni ogohlantirish')}:{' '}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {loading === 'debtor' ? (
                      <CircularProgress disableShrink size={'20px'} sx={{ margin: '10px 0', marginLeft: '15px' }} />
                    ) : (
                      <Switch
                        checked={Boolean(companyInfo?.auto_sms?.for_debtor)}
                        onChange={async (e, i) => {
                          await updateSettings('for_debtor', i)
                        }}
                      />
                    )}
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '20px', flexDirection: 'column' }}>
                  <Typography sx={{ minWidth: isMobile ? '90px' : '180px', fontSize: isMobile ? '13px' : '16px' }}>
                    {t('SMS Matni')}:
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '10px', width: '100%' }}>
                    {editable === 'debtor' ? (
                      <>
                        <TextField
                          multiline
                          rows={4}
                          size='small'
                          focused
                          defaultValue={companyInfo?.auto_sms?.debt_text || ''}
                          onBlur={e => {
                            updateSettings('debt_text', e.target.value)
                          }}
                          onChange={e => {
                            setName(e.target.value), localStorage.setItem('debt_text', e.target.value)
                          }}
                          fullWidth
                        />
                        <IconifyIcon
                          icon={loading === 'debtor' ? 'line-md:loading-loop' : 'ic:baseline-check'}
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            updateSettings('debt_text', name)
                          }}
                        />
                      </>
                    ) : (
                      <>
                        <TextField
                          fullWidth
                          multiline
                          rows={4}
                          type='text'
                          value={companyInfo?.auto_sms?.debt_text || 'Text'}
                          size='small'
                          placeholder={t('SMS Matni')}
                          onBlur={e => console.log(e.target.value)}
                        />
                        <IconifyIcon
                          icon={'basil:edit-outline'}
                          style={{ cursor: 'pointer' }}
                          onClick={() => setEditable('debtor')}
                        />
                      </>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <Typography sx={{ minWidth: isMobile ? '90px' : '180px', fontSize: isMobile ? '13px' : '16px' }}>
                    {t('Imtihon natijalarini sms yuborish')}:
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {loading === 'score' ? (
                      <CircularProgress disableShrink size={'20px'} sx={{ margin: '10px 0', marginLeft: '15px' }} />
                    ) : (
                      <Switch
                        checked={Boolean(companyInfo?.auto_sms?.on_score)}
                        onChange={async (e, i) => {
                          setLoading('score')
                          await updateSettings('on_score', i)
                        }}
                      />
                    )}
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '20px', flexDirection: 'column' }}>
                  <Typography sx={{ minWidth: isMobile ? '90px' : '180px', fontSize: isMobile ? '13px' : '16px' }}>
                    {t(`SMS matnini kiriting (kelmagan o'quvchiga ertasi kuni yuboriladi)`)}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '10px', width: '100%' }}>
                    {editable === 'score' ? (
                      <>
                        <TextField
                          multiline
                          rows={4}
                          size='small'
                          focused
                          defaultValue={companyInfo?.auto_sms?.score_text}
                          onBlur={e => {
                            updateSettings('score_text', e.target.value)
                          }}
                          onChange={e => {
                            setName(e.target.value), localStorage.setItem('score_text', e.target.value)
                          }}
                          fullWidth
                        />
                        <IconifyIcon
                          icon={loading === 'score' ? 'line-md:loading-loop' : 'ic:baseline-check'}
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            updateSettings('score_text', name)
                          }}
                        />
                      </>
                    ) : (
                      <>
                        <TextField
                          fullWidth
                          multiline
                          rows={4}
                          type='text'
                          value={companyInfo?.auto_sms?.score_text}
                          size='small'
                          placeholder={t('Boshlanish vaqti')}
                          onBlur={e => console.log(e.target.value)}
                        />
                        <IconifyIcon
                          icon={'basil:edit-outline'}
                          style={{ cursor: 'pointer' }}
                          onClick={() => setEditable('score')}
                        />
                      </>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        )}

        <Dialog open={deleteId?.open === 'payment-type'} onClose={() => setDeleteId(null)}>
          <DialogContent>
            <Typography sx={{ fontSize: '20px', margin: '10px 10px 20px' }}>{t("O'chirishni tasdiqlang")}</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant='outlined' onClick={() => setDeleteId(null)}>
                Bekor qilish
              </Button>
              <LoadingButton
                loading={loading === 'delete'}
                variant='contained'
                color='error'
                onClick={async () => {
                  setLoading('delete')
                  try {
                    await updatePaymentMethod(deleteId?.id, { is_active: false })
                    setDeleteId(null)
                    setLoading(null)
                  } catch {
                    setLoading(null)
                  }
                }}
              >
                Ok
              </LoadingButton>
            </Box>
          </DialogContent>
        </Dialog>

        <Dialog open={deleteId?.open === 'branch'} onClose={handleClose}>
          <DialogContent>
            <Typography sx={{ fontSize: '20px', margin: '10px 10px 20px' }}>{t("O'chirishni tasdiqlang")}</Typography>
            {errorMessage && (
              <Typography sx={{ color: 'red', fontSize: '15px', marginBottom: '20px', marginX: '10px' }}>
                {errorMessage}
              </Typography>
            )}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant='outlined' onClick={handleClose}>
                {t('Bekor qilish')}
              </Button>
              <LoadingButton
                loading={loading === 'delete'}
                variant='contained'
                color='error'
                onClick={async () => {
                  setLoading('delete')
                  try {
                    await api
                      .delete(`common/branch/delete/${deleteId?.id}`)
                      .then(res => {
                        reloadProfile()
                        setDeleteId(null)
                        getBranches()
                        setLoading(null)
                      })
                      .catch(error => {
                        console.log(error)
                        setErrorMessage(error.response.data.msg)
                        setLoading(null)
                      })
                  } catch {
                    setLoading(null)
                  }
                }}
              >
                Ok
              </LoadingButton>
            </Box>
          </DialogContent>
        </Dialog>
      </Box>
    </div>
  )
}
