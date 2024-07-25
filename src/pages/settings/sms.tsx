import {
    Box,
    Button,
    Typography
} from '@mui/material'
import React, { ReactNode, useEffect } from 'react'
import IconifyIcon from 'src/@core/components/icon'
import DataTable from 'src/@core/components/table'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'src/store'
import { fetchSmsList, setOpenCreateSms } from 'src/store/apps/settings'
import CreateSmsDialog from 'src/views/apps/settings/ceo/CreateSmsDialog'
import SmsTableRowOptions from 'src/views/apps/settings/ceo/SmsTableRowOptions'
import EditSmsDialog from 'src/views/apps/settings/ceo/EditSmsDialog'
import VideoHeader, { videoUrls } from 'src/@core/components/video-header/video-header'

export interface customTableProps {
    xs: number
    title: string
    dataIndex?: string | ReactNode
    render?: (source: string) => any | undefined
}


export default function RoomsPage() {

    const { sms_list, is_pending } = useAppSelector(state => state.settings)
    const dispatch = useAppDispatch()

    const { t } = useTranslation()

    const setOpenAddGroup = (value: boolean) => {
        dispatch(setOpenCreateSms(value))
    }

    const columns: customTableProps[] = [
        {
            xs: 0.05,
            title: t('#'),
            dataIndex: 'id'
        },
        {
            xs: 0.9,
            title: t("SMS matni"),
            dataIndex: 'description',
            render: (description) => <Typography>{description}</Typography>
        },
        {
            xs: 0.05,
            title: t('Harakatlar'),
            dataIndex: 'id',
            render: id => <SmsTableRowOptions id={+id} />
        }
    ]


    useEffect(() => {
        dispatch(fetchSmsList())
    }, [])


    return (
        <div>
            <VideoHeader item={videoUrls.sms} />
            <Box
                className='groups-page-header'
                sx={{ display: 'flex', justifyContent: 'space-between', margin: '10px 0' }}
                py={2}
            >
                <Typography variant='h5'>{t('SMS shablonlar')}</Typography>
                <Button
                    onClick={() => setOpenAddGroup(true)}
                    variant='contained'
                    size='small'
                    startIcon={<IconifyIcon icon='ic:baseline-plus' />}
                >
                    {t("Yangi qo'shish")}
                </Button>
            </Box>
            <DataTable loading={is_pending} columns={columns} data={sms_list} />

            <CreateSmsDialog />

            <EditSmsDialog />
        </div>
    )
}
