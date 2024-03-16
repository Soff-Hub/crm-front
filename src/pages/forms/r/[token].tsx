import React, { ReactNode } from 'react'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { useState } from "react";
import { TextField, Button, Typography, Box, FormControl, FormHelperText, Input } from "@mui/material";
import Form from 'src/@core/components/form';
import LoadingButton from '@mui/lab/LoadingButton';
import useResponsive from 'src/@core/hooks/useResponsive';
import toast from 'react-hot-toast';
import api from 'src/@core/utils/api';
import { useRouter } from 'next/router';
import showResponseError from 'src/@core/utils/show-response-error';

function RequestForm() {

    const [loading, setLoading] = useState<boolean>(false);
    const [isSend, setIsSend] = useState<boolean>(false);
    const [error, setError] = useState<any>({});
    const { isMobile } = useResponsive()
    const { query } = useRouter()

    const handleSubmit = async (values: any) => {
        setLoading(true)
        const newValues = { ...values }
        if (values.phone) {
            const newPhone = `+998${values.phone}`
            Object.assign(newValues, { phone: newPhone })
        }
        try {
            await api.post(`leads/application-user/create/${query.token}`, newValues)
            setTimeout(() => {
                toast.success("Ma'lumotlaringiz yuborildi", { position: 'top-center' })
                setLoading(false)
                setIsSend(true)
            }, 500);
        } catch (err: any) {
            if (err?.response) {
                setLoading(false)
                showResponseError(err.response.data, setError)
            }
        }
    };


    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                backgroundImage: `url('/images/request-form-bg.svg')`
            }}
        >
            <Box
                sx={{
                    maxWidth: isMobile ? 400 : 450, mx: "auto",
                    minWidth: isMobile ? 350 : 400,
                    p: isMobile ? '40px 25px' : '40px 50px',
                    backgroundColor: 'white',
                    borderRadius: '0',
                    position: 'absolute',
                    top: '45%',
                    left: '50%',
                    transform: 'translate(-50%,-50%)',
                    zIndex: 10
                }}>
                <Box sx={{ display: 'flex' }}>
                    <img src='/images/soff-logo.png' width={160} style={{ margin: '10px auto' }} />
                </Box>
                <Typography align="center" mb={isMobile ? 1 : 2} sx={{ fontSize: isMobile ? '20px' : '24px' }}>
                    {isSend ? "Ma'lumot jo'natganingiz uchun raxmat!" : "Aloqa uchun kontakt qoldiring"}
                </Typography>
                {isSend ? (
                    <Box
                        sx={{
                            display: 'flex',
                            minHeight: '160px',
                            objectFit: 'cover',
                            backgroundPosition: 'center',
                            backgroundImage: `url('/images/checked.png')`,
                            backgroundSize: '70%',
                            backgroundRepeat: 'no-repeat'
                        }}></Box>
                ) : (
                    <Form id='resuf0dshfsid' onSubmit={handleSubmit} setError={setError} sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <FormControl fullWidth>
                            <Input
                                error={error?.first_name?.error}
                                fullWidth
                                placeholder="Ism Familiya"
                                name='first_name'
                                required
                                sx={{
                                    border: '1.5px solid var(--Input-focusedHighlight)',
                                    transition: 'transform .15s cubic-bezier(0.1,0.9,0.2,1)',
                                    borderRadius: 0,
                                    borderBottomLeftRadius: '64px 20px',
                                    borderBottomRightRadius: '64px 20px',
                                    padding: '5px',
                                    '&:focus-within::before': {
                                        transform: 'scaleX(1)',
                                    },
                                }}
                            />
                            <FormHelperText>{error?.first_name?.message}</FormHelperText>
                        </FormControl>

                        <FormControl fullWidth>
                            <Input
                                autoFocus
                                error={error?.phone?.error}
                                fullWidth
                                type='number'
                                startAdornment={"+998"}
                                name='phone'
                                required
                                sx={{
                                    border: '1.5px solid var(--Input-focusedHighlight)',
                                    transition: 'transform .15s cubic-bezier(0.1,0.9,0.2,1)',
                                    borderRadius: 0,
                                    borderBottomLeftRadius: '64px 20px',
                                    borderBottomRightRadius: '64px 20px',
                                    padding: '5px',
                                    '&:focus-within::before': {
                                        transform: 'scaleX(1)',
                                    },
                                }}
                            />
                            <FormHelperText error>{error?.phone?.message}</FormHelperText>
                        </FormControl>

                        <LoadingButton loading={loading} variant="contained" color='success' type="submit" size='large' sx={{ mt: 5 }} fullWidth>
                            Yuborish
                        </LoadingButton>
                    </Form>
                )}
            </Box>
            <Box sx={{ position: 'absolute', top: isMobile ? '20px' : '0', left: isMobile ? '-200px' : '10%', zIndex: 9, width: '500px', height: '500px', bgcolor: 'transparent', backdropFilter: 'invert(100%)' }}></Box>
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', zIndex: 9, width: '500px', height: '600px', bgcolor: 'transparent', backdropFilter: 'blur(20px)', transform: 'translate(-50%, -50%)' }}></Box>
        </Box>
    );
}

RequestForm.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

RequestForm.guestGuard = true

export default RequestForm