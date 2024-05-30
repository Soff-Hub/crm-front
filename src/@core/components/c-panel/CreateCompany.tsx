import { Box, FormControl, FormLabel, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import Form from '../form'
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import IconifyIcon from '../icon';
import useResponsive from 'src/@core/hooks/useResponsive';

type Props = {
    slug?: number | undefined
}


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



export default function CreateCompany({ slug }: Props) {

    const [error, setError] = useState<any>({})
    const { isMobile } = useResponsive()

    function handleSubmit(values: any) {
        console.log(values);
    }

    return (
        <Box>
            <Box
                sx={{
                    padding: '0px 30px'
                }}
            >
                <Typography sx={{ fontSize: '20px', borderBottom: '1px solid white', marginBottom: '30px' }}>Yangi o'quv markaz yaratish uchun quyidagi ma'lumotlarni to'ldiring</Typography>

                <Form
                    id='create-company'
                    onSubmit={handleSubmit}
                    setError={setError}
                    sx={{
                        width: '100%',
                        display: 'flex',
                        gap: '20px',
                        flexDirection: isMobile ? 'column' : 'row'
                    }}
                >

                    <Box sx={{
                        display: 'flex',
                        gap: '20px',
                        maxWidth: '300px',
                        width: '100%',
                        flexDirection: 'column'
                    }} >
                        <TextField size='small' label="Nomi" name='name' />

                        <TextField size='small' label="Direktor to'liq ismi" name='first_name' />


                    </Box>

                    <Box sx={{
                        display: 'flex',
                        gap: '20px',
                        maxWidth: '300px',
                        width: '100%',
                        flexDirection: 'column'
                    }} >
                        <TextField size='small' label="Aloqa uchun raqam" name='phone' />

                        <TextField size='small' label="Direktor login" name='login' />
                    </Box>


                    <Box sx={{
                        display: 'flex',
                        gap: '20px',
                        maxWidth: '300px',
                        width: '100%',
                        flexDirection: 'column'
                    }} >
                        <TextField size='small' label="Parol" name='password' />

                        <Button
                            component="label"
                            role={undefined}
                            variant="outlined"
                            startIcon={<IconifyIcon icon={'lets-icons:upload'} />}
                        >
                            Logo yuklash
                            <VisuallyHiddenInput name='logo' type="file" />
                        </Button>
                    </Box>

                    <Box sx={{
                        display: 'flex',
                        gap: '20px',
                        maxWidth: '200px',
                        width: '100%',
                        flexDirection: 'column'
                    }} >
                        <Button
                            variant="contained"
                            startIcon={<IconifyIcon icon={'fluent:save-16-regular'} />}
                            type='submit'
                        >
                            Saqlash
                        </Button>
                    </Box>
                </Form>
            </Box>
        </Box>
    )
}