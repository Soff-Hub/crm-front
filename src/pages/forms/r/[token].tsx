import React, { ReactNode } from 'react'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { useState } from "react";
import { TextField, Button, Typography, Box, FormControl, FormHelperText } from "@mui/material";
import Form from 'src/@core/components/form';
import LoadingButton from '@mui/lab/LoadingButton';
import useResponsive from 'src/@core/hooks/useResponsive';
import toast from 'react-hot-toast';

function RequestForm() {

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<any>({});
    const { isMobile } = useResponsive()

    const handleSubmit = (e: any) => {
        setLoading(true)
        setTimeout(() => {
            toast.success("Ma'lumotlaringiz yuborildi", { position: 'top-center' })
            setLoading(false)
        }, 700);
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
                    Aloqa uchun kontakt qoldiring
                </Typography>
                <Form id='resuf0dshfsid' onSubmit={handleSubmit} setError={setError}>
                    <FormControl fullWidth>
                        <TextField
                            error={error?.first_name?.error}
                            fullWidth
                            label="Ism Familiya"
                            margin="normal"
                            name='first_name'
                            required
                        />
                        <FormHelperText>{error?.first_name?.message}</FormHelperText>
                    </FormControl>

                    <FormControl fullWidth>
                        <TextField
                            error={error?.phone?.error}
                            fullWidth
                            label="Telefon raqam"
                            margin="normal"
                            name='phone'
                            required
                        />
                        <FormHelperText>{error?.phone?.message}</FormHelperText>
                    </FormControl>

                    <LoadingButton loading={loading} variant="contained" color='success' type="submit" size='large' sx={{ mt: 5 }} fullWidth>
                        Yuborish
                    </LoadingButton>
                </Form>
            </Box>
            <Box sx={{ position: 'absolute', top: isMobile ? '20px' : '0', left: isMobile ? '-200px' : '10%', zIndex: 9, width: '500px', height: '500px', bgcolor: 'transparent', backdropFilter: 'invert(100%)' }}></Box>
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', zIndex: 9, width: '500px', height: '600px', bgcolor: 'transparent', backdropFilter: 'blur(20px)', transform: 'translate(-50%, -50%)' }}></Box>
        </Box>
    );
}

RequestForm.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

RequestForm.guestGuard = true


export default RequestForm