import { Box, Button, FormControl, FormHelperText, TextField, Typography } from "@mui/material"
import Router from "next/router"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import useResponsive from "src/@core/hooks/useResponsive"
import api from "src/@core/utils/api"
import showResponseError from "src/@core/utils/show-response-error"
import Form from "../form"
import LoadingButton from "@mui/lab/LoadingButton"

export default function CreateCeo({ slug }: any) {

    const [error, setError] = useState<any>({})
    const { isMobile } = useResponsive()
    const { t } = useTranslation()
    const [loading, setLoading] = useState<boolean>(false)

    async function handleSubmit(values: any) {
        setLoading(true)
        try {
            await api.post(`/owner/user/`, { ...values, client_id: slug })
            Router.push('/c-panel')
        } catch (err: any) {
            showResponseError(err?.response?.data, setError)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Box>
            <Box
                sx={{
                    padding: '0px 30px'
                }}
            >
                <Form
                    valueTypes='json'
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
                        <Typography sx={{ fontSize: '20px', borderBottom: '1px solid white', marginBottom: '20px' }}>{t("Yangi foydalanuvchi yaratish uchun quyidagi ma'lumotlarni to'ldiring")}</Typography>

                        <FormControl fullWidth>
                            <TextField error={error?.first_name} size='small' label={t("first_name")} name='first_name' />
                            <FormHelperText error={error?.first_name}>{error?.first_name}</FormHelperText>
                        </FormControl>

                        <FormControl fullWidth>
                            <TextField error={error?.phone} size='small' label={t("phone")} name='phone' defaultValue={'+998'} />
                            <FormHelperText error={error?.phone}>{error?.phone}</FormHelperText>
                        </FormControl>

                        <FormControl fullWidth>
                            <TextField size='small' label={t("password")} name='password' style={{ width: '100%' }} />
                            <FormHelperText error={error?.password}>{error?.password}</FormHelperText>
                        </FormControl>

                        <LoadingButton
                            loading={loading}
                            variant="contained"
                            type='submit'
                        >
                            {t('Saqlash')}
                        </LoadingButton>
                    </Box>
                </Form>
            </Box>
        </Box>
    )
}