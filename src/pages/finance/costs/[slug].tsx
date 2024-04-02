import { Box, Button, Dialog, DialogContent, DialogTitle, TextField, Typography, styled } from '@mui/material';
import { GetServerSidePropsContext } from 'next/types';
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import IconifyIcon from 'src/@core/components/icon';
import useResponsive from 'src/@core/hooks/useResponsive';
import { useSettings } from 'src/@core/hooks/useSettings';
import { formatCurrency } from 'src/@core/utils/format-currency';
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba';




function Slug(props: { slug: string }) {
    const { settings } = useSettings()

    const { themeColor } = settings
    const mainColor = themeColor === 'primary' ? '#666CFF' : themeColor === 'secondary' ? '#6D788D' : themeColor === 'success' ? '#72E128' : themeColor === 'error' ? '#FF4D49' : themeColor === 'warning' ? '#FDB528' : '#26C6F9'

    const Th = styled(Box)(() => ({
        padding: '5px 10px',
        borderBottom: '1px solid',
        borderColor: mainColor,
        backgroundColor: mainColor,
        color: 'white',
        borderRadius: '10px'
    }))

    const Column = styled(Box)(() => ({
        borderColor: mainColor,
        borderRadius: '10px'
    }))

    const { t } = useTranslation()
    const { isMobile } = useResponsive()

    const [nameVal, setNameVal] = useState<string>('');
    const [description, seDescription] = useState<string>('');
    const [open, setOpen] = useState<'create' | null>(null);





    const data: {
        date: string,
        costs: {
            amount: number,
            description: string
        }[]
    }[] = [
            {
                date: '01.01.2024',
                costs: [
                    {
                        amount: 500000,
                        description: "Novza wifi uchun"
                    },
                    {
                        amount: 500000,
                        description: "Novza wifi uchun"
                    },
                    {
                        amount: 500000,
                        description: "Novza wifi uchun"
                    }
                ]
            },
            {
                date: '01.01.2024',
                costs: [
                    {
                        amount: 500000,
                        description: "rqw eq434 qrfq3er rqwr r werwerw"
                    }
                ]
            },
            {
                date: '01.01.2024',
                costs: [
                    {
                        amount: 500000,
                        description: "Novza wifi uchun"
                    },
                    {
                        amount: 500000,
                        description: "Novza wifi uchun"
                    }
                ]
            }
        ]



    return (
        <Box>
            <Box className='header'>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, px: 2, justifyContent: 'space-between' }}>
                    <Typography sx={{ fontSize: '18px' }}>Marketing</Typography>
                    <Typography sx={{ fontSize: '18px', color: 'error.main' }}>Umumiy xarajat - &ensp;{formatCurrency(5000000)}</Typography>
                </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: isMobile ? 'center' : 'flex-start', gap: '15px', flexDirection: isMobile ? 'column' : 'row' }}>
                {
                    data.map((item, i: number) => (
                        <Column key={i} sx={{ width: isMobile ? '100%' : '180px', display: 'flex', flexDirection: 'column', gap: '12px', p: '5px' }}>
                            <Th>
                                {item.date}
                            </Th>
                            {
                                item.costs.map((el, j: number) => (
                                    <Box key={j} sx={{ borderBottom: `2px dashed ${mainColor}` }}>
                                        <Box>
                                            {formatCurrency(el.amount)}
                                        </Box>
                                        <Box>
                                            {el.description}
                                        </Box>
                                    </Box>
                                ))
                            }
                            <Button variant='outlined' onClick={() => setOpen('create')} size='small'>Yangi</Button>
                        </Column>
                    ))
                }
            </Box>



            <Dialog open={open === 'create'} onClose={() => setOpen(null)}>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', minWidth: '300px', justifyContent: 'space-between' }}>
                    <Typography>Xarajatlarni kiritish</Typography>
                    <IconifyIcon icon={'mdi:close'} onClick={() => setOpen(null)} />
                </DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <TextField autoComplete='off' size='small' placeholder={t("Summa")} type='number' fullWidth onChange={(e) => setNameVal(e.target.value)} />
                    <TextField autoComplete='off' size='small' multiline minRows={4} placeholder={t("Izoh")} fullWidth onChange={(e) => seDescription(e.target.value)} />
                    <Button variant='contained'>{t("Saqlash")}</Button>
                </DialogContent>
            </Dialog>
        </Box>
    )
}


export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { params } = context;

    return {
        props: {
            slug: params?.slug
        },
    };
}

export default Slug
