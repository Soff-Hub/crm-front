import React, { ReactNode, useEffect } from 'react'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { useState } from "react";
import { TextField, Button, Typography, Box, FormControl, FormHelperText, Input, Checkbox } from "@mui/material";
import Form from 'src/@core/components/form';
import LoadingButton from '@mui/lab/LoadingButton';
import useResponsive from 'src/@core/hooks/useResponsive';
import toast from 'react-hot-toast';
import api from 'src/@core/utils/api';
import { useRouter } from 'next/router';
import showResponseError from 'src/@core/utils/show-response-error';
import { useTranslation } from 'react-i18next';
import { GetServerSidePropsContext, InferGetStaticPropsType } from 'next/types';


export function CreatedComponent({
    type,
    label,
    variants,
    setResponse,
    id,
    response,
    error
}: {
    type: 'varchar' | 'description' | 'single' | 'multiple',
    label: string,
    variants: any[],
    setResponse: any,
    id: any,
    response: any,
    error: any
}) {

    const [values, setValues] = useState<any>([])
    const [isError, setIsError] = useState<any>(null)

    const handleChange = (value: any) => {
        if (type === 'single') {
            setResponse((c: any) => ({ ...c, [id]: { value: [value], type } }))
        }
        else if (type === 'multiple') {
            setResponse((c: any) => ({ ...c, [id]: { value, type } }))
        } else if (type === 'description' || type === 'varchar') {
            setResponse((c: any) => ({ ...c, [id]: { value, type } }))
        }
    }

    useEffect(() => {
        if (values && values?.length) {
            handleChange(values)
        }
    }, [values])

    useEffect(() => {
        if (error?.[id]) {
            setIsError(error?.[id])
        } else {
            setIsError(null)
        }
    }, [error])


    // console.log(response);

    if (type === "varchar") {
        return (
            <FormControl fullWidth>
                <TextField error={isError} label={label} size='small' variant='filled' onChange={(e) => handleChange(e.target.value)} />
                <FormHelperText error={isError}>{isError}</FormHelperText>
            </FormControl>
        )
    }

    else if (type === "description") {
        return (
            <FormControl fullWidth>
                <TextField error={isError} multiline label={label} rows={4} size='small' variant='filled' onChange={(e) => handleChange(e.target.value)} />
            </FormControl>
        )
    }


    else if (type === "single") {
        return (
            <FormControl fullWidth>
                <Typography style={isError ? { color: 'red' } : { color: 'rgba(76, 78, 100, 0.87)' }}>{label} * {isError}</Typography>
                <Box>
                    {
                        variants.map((el, i) => (
                            <label key={i} style={{ display: 'flex', alignItems: 'center' }}>
                                <Checkbox checked={Number(response?.[id]?.value) === Number(el.id)} onChange={() => handleChange(el.id)} />
                                <Typography>{el.value}</Typography>
                            </label>
                        ))
                    }
                </Box>
            </FormControl>
        )
    }

    else if (type === "multiple") {
        return (
            <FormControl fullWidth>
                <Typography>{label} *</Typography>
                <Box>
                    {
                        variants.map((el, i) => (
                            <label key={i} style={{ display: 'flex', alignItems: 'center' }}>
                                <Checkbox checked={values.includes(el.id)} onChange={() => {
                                    if (values.includes(el.id)) {
                                        setValues([...values.filter((item: number) => item !== el.id)])
                                    } else {
                                        setValues([...values, el.id])
                                    }
                                }} />
                                <Typography>{el.value}</Typography>
                            </label>
                        ))
                    }
                </Box>
            </FormControl>
        )
    }

    else {
        return <></>
    }
}


function RequestForm({ uuid }: InferGetStaticPropsType<typeof getServerSideProps>) {

    const [loading, setLoading] = useState<boolean>(false);
    const [isSend, setIsSend] = useState<boolean>(false);
    const [error, setError] = useState<any>(null);
    const [components, setComponents] = useState<any>([])
    const [formData, setFormData] = useState<any>({})

    const [response, setResponse] = useState<any>({})

    const { isMobile } = useResponsive()
    const { query } = useRouter()
    const { t } = useTranslation()

    const handleSubmit = async (values: any) => {
        setLoading(true)
        const application_answer: any[] = []

        Object.keys(response).forEach(key => {
            if (response[key].type === "description" || response[key].type === "varchar") {
                application_answer.push({ question: Number(key), description: response[key].value, answer: [] })
            } else {
                application_answer.push({ question: Number(key), answer: response[key].value })
            }
        })

        const newValues = { ...values, application_answer }
        if (values.phone) {
            const newPhone = `${values.phone}`
            Object.assign(newValues, { phone: newPhone })
        }
        try {
            await api.post(`leads/forms/answer/${query.token}/`, newValues)
            setTimeout(() => {
                toast.success("Ma'lumotlaringiz yuborildi", { position: 'top-center' })
                setLoading(false)
                setIsSend(true)
            }, 500);
        } catch (err: any) {
            if (err?.response) {
                setLoading(false)
                toast.error(`${err?.response?.data?.application_answer?.[0]}`)
            }
        }
    };

    const getFormData = async () => {
        try {
            const resp = await api.get(`leads/forms/get/${uuid}/`)
            setComponents(resp.data?.responce?.[0]?.questions)
            setFormData(resp.data?.responce?.[0])
        } catch (err: any) {
            console.log(err)
        }
    };

    useEffect(() => {
        getFormData()
        setError({ 21: "Kiritish majburiy" })
    }, [])


    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                backgroundImage: `url('/images/request-form-bg.svg')`,
                backgroundRepeat: 'repeat-y',
                overflowY: 'scroll',
                paddingTop: '50px',
            }}
        >
            <Box
                sx={{
                    maxWidth: isMobile ? 400 : 600, mx: "auto",
                    minWidth: isMobile ? 350 : 600,
                    p: isMobile ? '40px 25px' : '40px 50px',
                    backgroundColor: 'white',
                    borderRadius: '0',
                    marginBottom: '100px'
                }}>
                <Box sx={{ display: 'flex' }}>
                    <img src='/images/soff-logo.png' width={160} style={{ margin: '10px auto' }} />
                </Box>
                <Typography align="center" mb={isMobile ? 1 : 2} sx={{ fontSize: isMobile ? '20px' : '24px' }}>
                    {isSend ? "Ma'lumot jo'natganingiz uchun raxmat!" : formData.title}
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
                        <FormControl>
                            <TextField
                                error={error?.first_name?.error}
                                fullWidth
                                placeholder="Ism Familiya"
                                name='first_name'
                                label={t("first_name")}
                                size='small'
                                variant='filled'
                                required
                            />
                        </FormControl>

                        <FormControl fullWidth>
                            <TextField
                                label={t("phone")}
                                size='small'
                                variant='filled'
                                defaultValue={"+998"}
                                error={error?.phone?.error}
                                fullWidth
                                name='phone'
                                required
                            />
                        </FormControl>

                        {
                            components.map((el: any, i: number) => <CreatedComponent
                                setResponse={setResponse}
                                variants={el.question_variants}
                                key={i}
                                type={el.input_type}
                                label={el.title}
                                id={el.id}
                                response={response}
                                error={error}
                            />)
                        }

                        <LoadingButton loading={loading} variant="contained" color='success' type="submit" size='large' sx={{ mt: 5 }} fullWidth>
                            Yuborish
                        </LoadingButton>
                    </Form>
                )}
            </Box>
        </Box>
    );
}


export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { params } = context;

    return {
        props: {
            uuid: params?.token
        },
    };
}


RequestForm.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

RequestForm.guestGuard = true

export default RequestForm