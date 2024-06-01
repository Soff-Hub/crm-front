import { Box, FormControl, FormLabel, Input, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
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

                <Form
                    id='create-company'
                    onSubmit={handleSubmit}
                    setError={setError}
                    sx={{
                        width: '100%',
                        display: 'flex',
                        gap: '20px',
                        flexDirection: !isMobile ? 'column' : 'row',
                        alignItems: 'center'
                    }}
                >

                    <Box sx={{
                        display: 'flex',
                        gap: '20px',
                        maxWidth: '600px',
                        width: '100%',
                        flexDirection: 'column'
                    }} >
                        <Typography sx={{ fontSize: '20px', borderBottom: '1px solid white', marginBottom: '20px' }}>Yangi o'quv markaz yaratish uchun quyidagi ma'lumotlarni to'ldiring</Typography>
                        <TextField size='small' label="Nomi" name='name' />

                        <TextField size='small' label="Direktor to'liq ismi" name='first_name' />

                        <TextField size='small' label="Masul shaxs" name='phone' defaultValue={'+998'} />

                        <Box style={{ display: 'flex', gap: '8px' }}>
                            <TextField size='small' label="Login" name='login' defaultValue={'+998'} style={{ width: '100%' }} />

                            <TextField size='small' label="Parol" name='password' style={{ width: '100%' }} />
                        </Box>

                        <Box style={{ display: 'flex', gap: '8px' }}>
                            <FormControl sx={{ width: '100%' }}>
                                <InputLabel size='small' id='demo-simple-select-outlined-label'>Holati</InputLabel>
                                <Select
                                    size='small'
                                    label="Holati"
                                    id='demo-simple-select-outlined'
                                    labelId='demo-simple-select-outlined-label'
                                    defaultValue={'active'}
                                >
                                    <MenuItem value={'active'}>{'Aktiv'}</MenuItem>
                                    <MenuItem value={'no-active'}>{'no aktiv'}</MenuItem>
                                </Select>
                            </FormControl>

                            <Input size='small' name='password' style={{ width: '100%' }} endAdornment=".soffcrm.uz" />
                        </Box>

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