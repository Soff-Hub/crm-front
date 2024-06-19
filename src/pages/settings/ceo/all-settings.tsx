import React, { useEffect, useState } from 'react'
import { Box, Button, CircularProgress, Dialog, DialogContent, Switch, TextField, Typography } from '@mui/material'
import IconifyIcon from 'src/@core/components/icon'
import useResponsive from 'src/@core/hooks/useResponsive'
import usePayment from 'src/hooks/usePayment'
import useBranches from 'src/hooks/useBranch'
import LoadingButton from '@mui/lab/LoadingButton'
import api from 'src/@core/utils/api'
import { useDispatch } from 'react-redux'
import { setCompanyInfo } from 'src/store/apps/user'
import { useSelector } from 'react-redux'
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next'
import showResponseError from 'src/@core/utils/show-response-error'

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

export default function AllSettings() {

    const { isMobile } = useResponsive()
    const [editable, setEditable] = useState<null | 'title' | 'logo' | 'start-time' | 'end-time'>(null)
    const [createble, setCreatable] = useState<null | 'branch' | 'payment-type'>(null)
    const [id, setId] = useState<null | { key: 'branch' | 'payment-type', id: any }>(null)
    const [deleteId, setDeleteId] = useState<null | { open: null | 'payment-type' | 'branch', id: any }>(null)
    const [name, setName] = useState<string>('')
    const [loading, setLoading] = useState<null | 'create' | 'delete' | any>(null)
    const [error, setError] = useState<any>({})


    const { getPaymentMethod, paymentMethods, createPaymentMethod, updatePaymentMethod } = usePayment()
    const { getBranches, branches } = useBranches()
    const dispatch = useDispatch()
    const { companyInfo } = useSelector((state: any) => state.user)
    const { t } = useTranslation()



    const createPaymentType = async () => {
        setLoading('create')
        try {
            await createPaymentMethod({ name })
            setTimeout(() => {
                setLoading(null)
                setCreatable(null)
                getPaymentMethod()
            }, 400);
        } catch (err) {
            setLoading(null)
            console.log(err)
        }
    }

    const createBranch = async () => {
        setLoading('create')
        try {
            await api.post(`/common/branch/create`, { name })
            setTimeout(() => {
                setLoading(null)
                setCreatable(null)
                getBranches()
            }, 400);
        } catch (err) {
            setLoading(null)
            console.log(err)
        }
    }

    const updateBranch = async () => {
        setLoading('create')
        try {
            await api.patch(`/common/branch/update/${id?.id}`, { name })
            setCreatable(null)
            setLoading(null)
            getBranches()
            setId(null)
        } catch (err) {
            setLoading(null)
            console.log(err)
        }
    }

    // const getSettings = async () => {
    //     try {
    //         const resp = await api.get('common/settings/list/')
    //         dispatch(setCompanyInfo(resp.data[0]))
    //     } catch (err) {
    //         console.log(err)
    //     }
    // }

    const updateSettings = async (key: any, value: any) => {
        try {
            const formData: any = new FormData()
            formData.append(key, value)

            if (key === 'on_birthday' || key === 'birthday_text' || key === 'on_absent' || key === 'absent_text') {

                if (key === 'on_birthday') {
                    formData.append('birthday_text', 'Text')
                    formData.append('on_absent', companyInfo?.auto_sms?.on_absent)
                    formData.append('absent_text', companyInfo?.auto_sms?.absent_text)
                }

                else if (key === 'birthday_text') {
                    formData.append('on_birthday', true)
                    formData.append('on_absent', companyInfo?.auto_sms?.on_absent)
                    formData.append('absent_text', companyInfo?.auto_sms?.absent_text)
                }

                else if (key === 'on_absent') {
                    formData.append('absent_text', 'Assalomu Alaykum, siz kecha dars qoldirdingiz iltimos sababini bildirishni unurtmang')
                    formData.append('on_birthday', companyInfo?.auto_sms?.on_birthday)
                    formData.append('birthday_text', companyInfo?.auto_sms?.birthday_text)
                }
                else {
                    formData.append('on_absent', true)
                    formData.append('on_birthday', companyInfo?.auto_sms?.on_birthday)
                    formData.append('birthday_text', companyInfo?.auto_sms?.birthday_text)
                }

                await api.put('common/auto-sms/update/', formData)
            } else {
                await api.patch(key === 'on_birthday' ? 'common/auto-sms/update/' : 'common/settings/update/', formData)
            }
            
            const getresp = await api.get('common/settings/list/')
            dispatch(setCompanyInfo(getresp.data[0]))
            setEditable(null)
            setId(null)
        } catch (err: any) {
            console.log(err)
            if (err?.response?.data) {
                showResponseError(err?.response?.data, setError)
            }
        } finally {
            setLoading(null)
        }
    }


    useEffect(() => {
        getPaymentMethod()
        getBranches()
    }, [])

    return (
        <Box sx={{ display: 'flex', gap: '15px', flexDirection: isMobile ? 'column' : 'row', px: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <Typography sx={{ minWidth: isMobile ? '90px' : '180px', fontSize: isMobile ? '13px' : '16px' }}>{t('Tashkilot nomi')}:</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {
                            editable === 'title' ? (
                                <>
                                    <TextField size='small' focused defaultValue={companyInfo?.training_center_name} onChange={(e) => setName(e.target.value)} />
                                    <IconifyIcon icon={'ic:baseline-check'} style={{ cursor: 'pointer' }} onClick={() => {
                                        updateSettings('training_center_name', name)
                                    }} />
                                </>
                            ) : (
                                <>
                                    <TextField value={companyInfo?.training_center_name} size='small' placeholder={t('Tashkilot nomi')} onBlur={(e) => console.log(e.target.value)} />
                                    <IconifyIcon icon={'basil:edit-outline'} style={{ cursor: 'pointer' }} onClick={() => setEditable('title')} />
                                </>
                            )
                        }
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <Typography sx={{ minWidth: isMobile ? '90px' : '180px', fontSize: isMobile ? '13px' : '16px' }}>{t('Logo')}:</Typography>
                    <img src={companyInfo?.logo} height={35} />
                    <Button
                        component="label"
                        role={undefined}
                        variant="contained"
                        size='small'
                        tabIndex={-1}
                        startIcon={<IconifyIcon icon={'mynaui:upload'} />}
                    >
                        {t('Yangilash')}
                        <VisuallyHiddenInput type="file" onChange={(e: any) => {
                            updateSettings('logo', e.target.files[0])
                        }} />
                    </Button>
                </Box>

                <Box sx={{ display: 'flex', gap: '20px' }}>
                    <Typography sx={{ minWidth: isMobile ? '90px' : '180px', fontSize: isMobile ? '13px' : '16px' }}>{t('Filiallar')}:</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        {
                            branches.map((branch: any) => (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }} key={branch.id}>
                                    {
                                        id?.id === branch.id && id?.key === 'branch' ? (
                                            <TextField size='small' focused defaultValue={branch.name} onChange={(e) => setName(e.target.value)} onBlur={updateBranch} />
                                        ) : (
                                            <TextField size='small' value={branch.name} />
                                        )
                                    }
                                    {
                                        id?.id === branch.id && id?.key === 'branch' ? (
                                            <IconifyIcon icon={'ic:baseline-check'} style={{ cursor: 'pointer' }} onClick={updateBranch} />
                                        ) : (
                                            <IconifyIcon icon={'basil:edit-outline'} style={{ cursor: 'pointer' }} onClick={() => setId({ id: branch.id, key: 'branch' })} />
                                        )
                                    }
                                    <IconifyIcon icon={'fluent:delete-20-regular'} style={{ cursor: 'pointer' }} onClick={() => setDeleteId({ open: 'branch', id: branch.id })} />
                                </Box>
                            ))
                        }
                        {
                            createble === 'branch' && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <TextField size='small' placeholder={t("Yangi filial")} onChange={(e) => setName(e.target.value)} />
                                    <IconifyIcon icon={loading === 'create' ? 'line-md:loading-loop' : 'ic:baseline-check'} style={{ cursor: 'pointer' }} onClick={createBranch} />
                                    <IconifyIcon icon={'ic:outline-close'} style={{ cursor: 'pointer' }} onClick={() => setCreatable(null)} />
                                </Box>
                            )
                        }
                        <Button size='small' startIcon={<IconifyIcon icon={'ic:outline-add'} />} variant='outlined' onClick={() => setCreatable('branch')}>{t('Yangi')}</Button>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: '20px' }}>
                    <Typography sx={{ minWidth: isMobile ? '90px' : '180px', fontSize: isMobile ? '13px' : '16px' }}>{t('Tolov usullari')}:</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        {
                            paymentMethods.map((method: any) => (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }} key={method.id}>
                                    {
                                        id?.id === method.id && id?.key === 'payment-type' ? (
                                            <TextField size='small' focused defaultValue={method.name} onBlur={(e) => updatePaymentMethod(method.id, { name: e.target.value })} />
                                        ) : (
                                            <TextField size='small' value={method.name} onBlur={(e) => console.log(e.target.value)} />
                                        )
                                    }
                                    {
                                        id?.id === method.id && id?.key === 'payment-type' ? (
                                            <IconifyIcon icon={'ic:baseline-check'} style={{ cursor: 'pointer' }} onClick={() => setId(null)} />
                                        ) : (
                                            <IconifyIcon icon={'basil:edit-outline'} style={{ cursor: 'pointer' }} onClick={() => setId({ id: method.id, key: 'payment-type' })} />
                                        )
                                    }
                                    <IconifyIcon icon={'fluent:delete-20-regular'} style={{ cursor: 'pointer' }} onClick={() => setDeleteId({ open: 'payment-type', id: method.id })} />
                                </Box>
                            ))
                        }
                        {
                            createble === 'payment-type' && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <TextField size='small' placeholder="To'lov turi" onChange={(e) => setName(e.target.value)} />
                                    <IconifyIcon icon={loading === 'create' ? 'line-md:loading-loop' : 'ic:baseline-check'} style={{ cursor: 'pointer' }} onClick={createPaymentType} />
                                    <IconifyIcon icon={'ic:outline-close'} style={{ cursor: 'pointer' }} onClick={() => setCreatable(null)} />
                                </Box>
                            )
                        }
                        <Button size='small' startIcon={<IconifyIcon icon={'ic:outline-add'} />} variant='outlined' onClick={() => setCreatable('payment-type')}>{t('Yangi')}</Button>
                    </Box>
                </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <Typography sx={{ minWidth: isMobile ? '90px' : '180px', fontSize: isMobile ? '13px' : '16px' }}>{t('Ish boshlanish vaqti')}:</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {
                            editable === 'start-time' ? (
                                <>
                                    <TextField
                                        type='time'
                                        size='small'
                                        focused
                                        defaultValue={companyInfo?.work_start_time}
                                        onBlur={(e) => {
                                            updateSettings('work_start_time', e.target.value)
                                        }}
                                    />
                                    <IconifyIcon icon={'ic:baseline-check'} style={{ cursor: 'pointer' }} onClick={() => {
                                        updateSettings('work_start_time', name)
                                    }} />
                                </>
                            ) : (
                                <>
                                    <TextField type='text' value={`${companyInfo?.work_start_time}`} size='small' placeholder={t('Ish boshlanish vaqti')} onBlur={(e) => console.log(e.target.value)} />
                                    <IconifyIcon icon={'basil:edit-outline'} style={{ cursor: 'pointer' }} onClick={() => setEditable('start-time')} />
                                </>
                            )
                        }
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <Typography sx={{ minWidth: isMobile ? '90px' : '180px', fontSize: isMobile ? '13px' : '16px' }}>{t('Ish tugash vaqti')}:</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {
                            editable === 'end-time' ? (
                                <>
                                    <TextField
                                        type='time'
                                        size='small'
                                        focused
                                        defaultValue={companyInfo?.work_end_time}
                                        onBlur={(e) => {
                                            updateSettings('work_end_time', e.target.value)
                                        }}
                                    />
                                    <IconifyIcon icon={'ic:baseline-check'} style={{ cursor: 'pointer' }} onClick={() => {
                                        updateSettings('work_end_time', name)
                                    }} />
                                </>
                            ) : (
                                <>
                                    <TextField type='text' value={`${companyInfo?.work_end_time}`} size='small' placeholder={t('Boshlanish vaqti')} onBlur={(e) => console.log(e.target.value)} />
                                    <IconifyIcon icon={'basil:edit-outline'} style={{ cursor: 'pointer' }} onClick={() => setEditable('end-time')} />
                                </>
                            )
                        }
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <Typography sx={{ minWidth: isMobile ? '90px' : '180px', fontSize: isMobile ? '13px' : '16px' }}>{t("Tug'ilgan kunda sms bilan tabriklash")}:</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {
                            loading === 'on_birthday' ? <CircularProgress disableShrink size={'20px'} sx={{ margin: '10px 0', marginLeft: '15px' }} /> : (
                                <Switch
                                    checked={Boolean(companyInfo?.auto_sms?.on_birthday)}
                                    onChange={async (e, i) => {
                                        setLoading('on_birthday')
                                        await updateSettings('on_birthday', i)
                                    }}
                                />
                            )
                        }
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '20px', flexDirection: 'column' }}>
                    <Typography sx={{ minWidth: isMobile ? '90px' : '180px', fontSize: isMobile ? '13px' : '16px' }}>{t('SMS Matni')}:</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '10px', width: '100%' }}>
                        {
                            loading === 'birthday_text' ? (
                                <>
                                    <TextField
                                        multiline
                                        rows={4}
                                        size='small'
                                        focused
                                        defaultValue={companyInfo?.auto_sms?.birthday_text}
                                        onBlur={(e) => {
                                            updateSettings('birthday_text', e.target.value)
                                        }}
                                        fullWidth
                                    />
                                    <IconifyIcon icon={'ic:baseline-check'} style={{ cursor: 'pointer' }} onClick={() => {
                                        updateSettings('birthday_text', name)
                                    }} />
                                </>
                            ) : (
                                <>
                                    <TextField fullWidth multiline rows={4} type='text' value={`${companyInfo?.auto_sms?.birthday_text}`} size='small' placeholder={t('SMS Matni')} onBlur={(e) => console.log(e.target.value)} />
                                    <IconifyIcon icon={'basil:edit-outline'} style={{ cursor: 'pointer' }} onClick={() => setLoading('birthday_text')} />
                                </>
                            )
                        }
                    </Box>
                </Box>


                <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <Typography sx={{ minWidth: isMobile ? '90px' : '180px', fontSize: isMobile ? '13px' : '16px' }}>{t("Darsga kelmaganlarga sms yuborish")}:</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {
                            loading === 'on_absent' ? <CircularProgress disableShrink size={'20px'} sx={{ margin: '10px 0', marginLeft: '15px' }} /> : (
                                <Switch
                                    checked={Boolean(companyInfo?.auto_sms?.on_absent)}
                                    onChange={async (e, i) => {
                                        setLoading('on_absent')
                                        await updateSettings('on_absent', i)
                                    }}
                                />
                            )
                        }
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '20px', flexDirection: 'column' }}>
                    <Typography sx={{ minWidth: isMobile ? '90px' : '180px', fontSize: isMobile ? '13px' : '16px' }}>{t(`SMS matnini kiriting (kelmagan o'quvchiga ertasi kuni yuboriladi)`)}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '10px', width: '100%' }}>
                        {
                            loading === 'absent_text' ? (
                                <>
                                    <TextField
                                        multiline
                                        rows={4}
                                        size='small'
                                        focused
                                        defaultValue={companyInfo?.auto_sms?.absent_text}
                                        onBlur={(e) => {
                                            updateSettings('absent_text', e.target.value)
                                        }}
                                        fullWidth
                                    />
                                    <IconifyIcon icon={'ic:baseline-check'} style={{ cursor: 'pointer' }} onClick={() => {
                                        updateSettings('absent_text', name)
                                    }} />
                                </>
                            ) : (
                                <>
                                    <TextField fullWidth multiline rows={4} type='text' value={`${companyInfo?.auto_sms?.absent_text}`} size='small' placeholder={t('Boshlanish vaqti')} onBlur={(e) => console.log(e.target.value)} />
                                    <IconifyIcon icon={'basil:edit-outline'} style={{ cursor: 'pointer' }} onClick={() => setLoading('absent_text')} />
                                </>
                            )
                        }
                    </Box>
                </Box>
            </Box>


            <Dialog open={deleteId?.open === 'payment-type'} onClose={() => setDeleteId(null)}>
                <DialogContent>
                    <Typography sx={{ fontSize: '20px', margin: '10px 10px 20px' }}>{t("O'chirishni tasdiqlang")}</Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button variant='outlined' color='success' onClick={() => setDeleteId(null)}>Bekor qilish</Button>
                        <LoadingButton loading={loading === 'delete'} variant='contained' color='error' onClick={async () => {
                            setLoading('delete')
                            try {
                                await updatePaymentMethod(deleteId?.id, { is_active: false })
                                setDeleteId(null)
                            } catch {

                            }
                        }}>Ok</LoadingButton>
                    </Box>
                </DialogContent>
            </Dialog>

            <Dialog open={deleteId?.open === 'branch'} onClose={() => setDeleteId(null)}>
                <DialogContent>
                    <Typography sx={{ fontSize: '20px', margin: '10px 10px 20px' }}>{t("O'chirishni tasdiqlang")}</Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button variant='outlined' color='success' onClick={() => setDeleteId(null)}>{t('Bekor qilish')}</Button>
                        <LoadingButton loading={loading === 'delete'} variant='contained' color='error' onClick={async () => {
                            setLoading('delete')
                            try {
                                await api.delete(`common/branch/delete/${deleteId?.id}`)
                                setDeleteId(null)
                                getBranches()
                            } catch {
                            }
                        }}>Ok</LoadingButton>
                    </Box>
                </DialogContent>
            </Dialog>
        </Box>
    )
}
