import React, { useEffect, useState } from 'react'
import { Box, Button, Dialog, DialogContent, TextField, Typography } from '@mui/material'
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
    const [deleteId, setDeleteId] = useState<null | { open: null | 'payment-type', id: any }>(null)
    const [name, setName] = useState<string>('')
    const [loading, setLoading] = useState<null | 'create' | 'delete'>(null)



    const { getPaymentMethod, paymentMethods, createPaymentMethod, updatePaymentMethod } = usePayment()
    const { getBranches, branches } = useBranches()
    const dispatch = useDispatch()
    const { companyInfo } = useSelector((state: any) => state.user)



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
            const resp = await api.patch('common/settings/update/', formData)
            dispatch(setCompanyInfo(resp.data))
            setEditable(null)
        } catch (err) {
            console.log(err)
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
                    <Typography sx={{ minWidth: isMobile ? '90px' : '120px', fontSize: isMobile ? '13px' : '16px' }}>Tashkilot nomi:</Typography>
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
                                    <TextField value={companyInfo?.training_center_name} size='small' placeholder='Tashkilot Nomi' onBlur={(e) => console.log(e.target.value)} />
                                    <IconifyIcon icon={'basil:edit-outline'} style={{ cursor: 'pointer' }} onClick={() => setEditable('title')} />
                                </>
                            )
                        }
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <Typography sx={{ minWidth: isMobile ? '90px' : '120px', fontSize: isMobile ? '13px' : '16px' }}>Logo:</Typography>
                    <img src={companyInfo?.logo} height={35} />
                    <Button
                        component="label"
                        role={undefined}
                        variant="contained"
                        size='small'
                        tabIndex={-1}
                        startIcon={<IconifyIcon icon={'mynaui:upload'} />}
                    >
                        Yangilash
                        <VisuallyHiddenInput type="file" onChange={(e: any) => {
                            updateSettings('logo', e.target.files[0])
                        }} />
                    </Button>
                </Box>

                <Box sx={{ display: 'flex', gap: '20px' }}>
                    <Typography sx={{ minWidth: isMobile ? '90px' : '120px', fontSize: isMobile ? '13px' : '16px' }}>Filiallar:</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        {
                            branches.map((branch: any) => (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }} key={branch.id}>
                                    {
                                        id?.id === branch.id && id?.key === 'branch' ? (
                                            <TextField size='small' focused defaultValue={branch.name} onBlur={(e) => console.log(e.target.value)} />
                                        ) : (
                                            <TextField size='small' value={branch.name} />
                                        )
                                    }
                                    {
                                        id?.id === branch.id && id?.key === 'branch' ? (
                                            <IconifyIcon icon={'ic:baseline-check'} style={{ cursor: 'pointer' }} />
                                        ) : (
                                            <IconifyIcon icon={'basil:edit-outline'} style={{ cursor: 'pointer' }} onClick={() => setId({ id: branch.id, key: 'branch' })} />
                                        )
                                    }
                                    <IconifyIcon icon={'fluent:delete-20-regular'} style={{ cursor: 'pointer' }} />
                                </Box>
                            ))
                        }
                        {
                            createble === 'branch' && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <TextField size='small' placeholder="Yangi filial" onChange={(e) => setName(e.target.value)} />
                                    <IconifyIcon icon={loading === 'create' ? 'line-md:loading-loop' : 'ic:baseline-check'} style={{ cursor: 'pointer' }} onClick={createPaymentType} />
                                    <IconifyIcon icon={'ic:outline-close'} style={{ cursor: 'pointer' }} onClick={() => setCreatable(null)} />
                                </Box>
                            )
                        }
                        <Button size='small' startIcon={<IconifyIcon icon={'ic:outline-add'} />} variant='outlined' onClick={() => setCreatable('branch')}>Yangi</Button>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: '20px' }}>
                    <Typography sx={{ minWidth: isMobile ? '90px' : '120px', fontSize: isMobile ? '13px' : '16px' }}>Tolov usullari:</Typography>
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
                        <Button size='small' startIcon={<IconifyIcon icon={'ic:outline-add'} />} variant='outlined' onClick={() => setCreatable('payment-type')}>Yangi</Button>
                    </Box>
                </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <Typography sx={{ minWidth: isMobile ? '90px' : '120px', fontSize: isMobile ? '13px' : '16px' }}>Ish boshlanish vaqti:</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {
                            editable === 'start-time' ? (
                                <>
                                    <TextField
                                        type='time'
                                        size='small'
                                        focused
                                        defaultValue={companyInfo?.work_start_time}
                                        onChange={(e) => setName(e.target.value)}
                                        onBlur={() => {
                                            updateSettings('work_start_time', name)
                                        }}
                                    />
                                    <IconifyIcon icon={'ic:baseline-check'} style={{ cursor: 'pointer' }} onClick={() => {
                                        updateSettings('work_start_time', name)
                                    }} />
                                </>
                            ) : (
                                <>
                                    <TextField type='text' value={`${companyInfo?.work_start_time}`} size='small' placeholder='Boshlanish vaqti' onBlur={(e) => console.log(e.target.value)} />
                                    <IconifyIcon icon={'basil:edit-outline'} style={{ cursor: 'pointer' }} onClick={() => setEditable('start-time')} />
                                </>
                            )
                        }
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <Typography sx={{ minWidth: isMobile ? '90px' : '160px', fontSize: isMobile ? '13px' : '16px' }}>Ish tugash vaqti:</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {
                            editable === 'end-time' ? (
                                <>
                                    <TextField
                                        type='time'
                                        size='small'
                                        focused
                                        defaultValue={companyInfo?.work_end_time}
                                        onChange={(e) => setName(e.target.value)}
                                        onBlur={() => {
                                            updateSettings('work_end_time', name)
                                        }}
                                    />
                                    <IconifyIcon icon={'ic:baseline-check'} style={{ cursor: 'pointer' }} onClick={() => {
                                        updateSettings('work_end_time', name)
                                    }} />
                                </>
                            ) : (
                                <>
                                    <TextField type='text' value={`${companyInfo?.work_end_time}`} size='small' placeholder='Boshlanish vaqti' onBlur={(e) => console.log(e.target.value)} />
                                    <IconifyIcon icon={'basil:edit-outline'} style={{ cursor: 'pointer' }} onClick={() => setEditable('end-time')} />
                                </>
                            )
                        }
                    </Box>
                </Box>
            </Box>


            <Dialog open={deleteId?.open === 'payment-type'} onClose={() => setDeleteId(null)}>
                <DialogContent>
                    <Typography sx={{ fontSize: '20px', margin: '10px 10px 20px' }}>O'chirishni tasdiqlang</Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button variant='outlined' color='success' onClick={() => setDeleteId(null)}>Bekor qilish</Button>
                        <LoadingButton loading={loading === 'delete'} variant='contained' color='error' onClick={async () => {
                            setLoading('delete')
                            try {
                                await updatePaymentMethod(deleteId?.id, { is_active: false })
                                setDeleteId(null)
                                setLoading(null)
                            } catch {
                                setLoading(null)
                            }
                        }}>Ok</LoadingButton>
                    </Box>
                </DialogContent>
            </Dialog>
        </Box>
    )
}
