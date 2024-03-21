import React, { useEffect, useState } from 'react'
import { Box, Button, TextField, Typography } from '@mui/material'
import IconifyIcon from 'src/@core/components/icon'
import useResponsive from 'src/@core/hooks/useResponsive'
import usePayment from 'src/hooks/usePayment'
import useBranches from 'src/hooks/useBranch'

export default function AllSettings() {

    const { isMobile } = useResponsive()
    const [editable, setEditable] = useState<null | 'title' | 'logo'>(null)
    const [createble, setCreatable] = useState<null | 'branch' | 'payment-type'>(null)
    const [id, setId] = useState<null | { key: 'branch' | 'payment-type', id: any }>(null)
    const [name, setName] = useState<string>('')
    const [loading, setLoading] = useState<null | 'create'>(null)


    const { getPaymentMethod, paymentMethods, createPaymentMethod } = usePayment()
    const { getBranches, branches } = useBranches()


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


    useEffect(() => {
        getPaymentMethod()
        getBranches()
    }, [])

    return (
        <Box sx={{ display: 'flex', gap: '15px', flexDirection: isMobile ? 'column' : 'row' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <Typography sx={{ minWidth: isMobile ? '90px' : '120px', fontSize: isMobile ? '13px' : '16px' }}>Tashkilot nomi:</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <TextField value={'Soff Study'} size='small' placeholder='Tashkilot Nomi' onBlur={(e) => console.log(e.target.value)} />
                        <IconifyIcon icon={'basil:edit-outline'} style={{ cursor: 'pointer' }} />
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <Typography sx={{ minWidth: isMobile ? '90px' : '120px', fontSize: isMobile ? '13px' : '16px' }}>Logo:</Typography>
                    <img src='/images/soff-logo.png' width={120} />
                    <IconifyIcon icon={'basil:edit-outline'} style={{ cursor: 'pointer' }} />
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
                                            <TextField size='small' value={branch.name} onBlur={(e) => console.log(e.target.value)} />
                                        )
                                    }
                                    <IconifyIcon icon={'basil:edit-outline'} style={{ cursor: 'pointer' }} onClick={() => setId({ id: branch.id, key: 'branch' })} />
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
                                            <TextField size='small' focused defaultValue={method.name} onBlur={(e) => console.log(e.target.value)} />
                                        ) : (
                                            <TextField size='small' value={method.name} onBlur={(e) => console.log(e.target.value)} />
                                        )
                                    }
                                    <IconifyIcon icon={'basil:edit-outline'} style={{ cursor: 'pointer' }} onClick={() => setId({ id: method.id, key: 'payment-type' })} />
                                    <IconifyIcon icon={'fluent:delete-20-regular'} style={{ cursor: 'pointer' }} />
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
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '100%' }}></Box>
        </Box>
    )
}
