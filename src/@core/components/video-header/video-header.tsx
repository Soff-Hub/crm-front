import { Box, Button } from '@mui/material'
import IconifyIcon from '../icon'
import { useAppDispatch } from 'src/store'
import { openVideoModal } from 'src/store/apps/settings'
import { useTranslation } from 'react-i18next'

interface VideoType {
    title: string
    url: string
}

export const videoUrls: {
    all_settings: VideoType
    employees: VideoType
    courses: VideoType
    rooms: VideoType
    freedays: VideoType
    sms: VideoType
    forms: VideoType
    dashboard: VideoType
    leads: VideoType
    teachers: VideoType
    groups: VideoType
    group: VideoType
    students: VideoType
    finance: VideoType
} = {
    all_settings: {
        title: 'Umumiy sozlamalar sahifasidan qanday foydalaniladi?',
        url: 'https://www.youtube.com/embed/dPfexdHosjk?si=uvfr31ArDT2avxVo'
    },
    employees: {
        title: 'Xodimlar sahifasidan qanday foydalaniladi?',
        url: 'https://www.youtube.com/embed/Ej6ellTSsbw?si=qWmUOjpfqFpoqxBx'
    },
    courses: {
        title: 'Kurslar sahifasidan qanday foydalaniladi?',
        url: 'https://www.youtube.com/embed/h4e3uFEutXg?si=7Y4wXiXSzkc3078Z'
    },
    rooms: {
        title: 'Xonalar sahifasidan qanday foydalaniladi?',
        url: 'https://www.youtube.com/embed/ie5yJodh5LA?si=HXuoFyOld2pkHFVS'
    },
    freedays: {
        title: 'Dam olish kunlari sahifasidan qanday foydalaniladi?',
        url: 'https://www.youtube.com/embed/SXZusS3PzDc?si=GygrE3BO5phyezow'
    },
    sms: {
        title: 'SMS shablonlar sahifasidan qanday foydalaniladi?',
        url: 'https://www.youtube.com/embed/MCoIPJfs_-s?si=YYQCmQwcc9DJGpm8'
    },
    forms: {
        title: 'Formalar sahifasidan qanday foydalaniladi?',
        url: 'https://www.youtube.com/embed/jfIako9-4Ls?si=Pf3Nk7DcEChYUH4r'
    },
    dashboard: {
        title: "Bosh sahifadan qanday foydalaniladi?",
        url: 'https://www.youtube.com/embed/j3EAsc_EFPE?si=Wj_f8-LyMToTLOmG'
    },
    leads: {
        title: "Lidlar sahifasidan qanday foydalaniladi?",
        url: "https://www.youtube.com/embed/VrVlkMRz5BQ?si=SKK0WwsWlh4q0V-J"
    },

    teachers: {
        title: "O'qituvchilar sahifasidan qanday foydalaniladi?",
        url: "https://www.youtube.com/embed/BiJBQvlbkJg?si=8wAp7pFaGC8sGpO6"
    },
    group: {
        title: "Guruh jurnali sahifasidan qanday foydalaniladi?",
        url: "https://www.youtube.com/embed/uEwugDdaPwY?si=3eU53eLdQu-EXuSw"
    },
    groups: {
        title: "Guruhlar sahifasidan qanday foydalaniladi?",
        url: "https://www.youtube.com/embed/laf2WquniAg?si=vFD-lZ72iD8qJt61"
    },
    students: {
        title: "O'quvchilar sahifasidan qanday foydalaniladi?",
        url: "https://www.youtube.com/embed/1wp9s9-JfcE?si=1VWCZdslGr8uFy4B"
    },
    finance: {
        title: "Moliya sahifasidan qanday foydalaniladi?",
        url: "https://www.youtube.com/embed/wMMjudbJXZg?si=9bCcWVcfrxlXuTjr"
    },
}

export default function VideoHeader({ item }: { item: VideoType }) {
    const dispatch = useAppDispatch()

    const clickBtn = () => {
        dispatch(openVideoModal({
            open: true,
            ...item
        }))
    }
    const { t } = useTranslation()

    return (
        <Box sx={{ marginBottom: '10px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            <Button onClick={clickBtn} size='small' variant='outlined' sx={{ textTransform: 'unset', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '3px' }}>
                <IconifyIcon icon={'mdi:youtube'} />
                {t([item.title])}
            </Button>
        </Box>
    )
}