import { Box, Button } from '@mui/material'
import IconifyIcon from '../icon'
import { useAppDispatch } from 'src/store'
import { openVideoModal } from 'src/store/apps/settings'

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
        title: 'Umumiy sozlamalar',
        url: 'https://www.youtube.com/embed/dPfexdHosjk?si=uvfr31ArDT2avxVo'
    },
    employees: {
        title: 'Xodimlar',
        url: 'https://www.youtube.com/embed/Ej6ellTSsbw?si=qWmUOjpfqFpoqxBx'
    },
    courses: {
        title: 'Kurslar',
        url: 'https://www.youtube.com/embed/h4e3uFEutXg?si=7Y4wXiXSzkc3078Z'
    },
    rooms: {
        title: 'Xonalar',
        url: 'https://www.youtube.com/embed/ie5yJodh5LA?si=HXuoFyOld2pkHFVS'
    },
    freedays: {
        title: 'Dam olish kunlar',
        url: 'https://www.youtube.com/embed/SXZusS3PzDc?si=GygrE3BO5phyezow'
    },
    sms: {
        title: 'SMS shablonlar',
        url: 'https://www.youtube.com/embed/MCoIPJfs_-s?si=YYQCmQwcc9DJGpm8'
    },
    forms: {
        title: 'Formalar',
        url: 'https://www.youtube.com/embed/jfIako9-4Ls?si=Pf3Nk7DcEChYUH4r'
    },
    dashboard: {
        title: "Asosiy",
        url: 'https://www.youtube.com/embed/j3EAsc_EFPE?si=Wj_f8-LyMToTLOmG'
    },
    leads: {
        title: "Lidlar",
        url: "https://www.youtube.com/embed/Ckk0AMEUnCI?si=wuujN-Q0OszfpXNe"
    },
    teachers: {
        title: "O'qituvchilar",
        url: "https://www.youtube.com/embed/BiJBQvlbkJg?si=8wAp7pFaGC8sGpO6"
    },
    group: {
        title: "Guruh",
        url: "https://www.youtube.com/embed/uEwugDdaPwY?si=3eU53eLdQu-EXuSw"
    },
    groups: {
        title: "Guruhlar",
        url: "https://www.youtube.com/embed/laf2WquniAg?si=vFD-lZ72iD8qJt61"
    },
    students: {
        title: "O'quvchilar",
        url: "https://www.youtube.com/embed/cMSDphU-VYE?si=4SUwW6ekT_YArqaz"
    },
    finance: {
        title: "Moliya",
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

    return (
        <Box sx={{ marginBottom: '10px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            <Button onClick={clickBtn} size='small' variant='outlined' sx={{ textTransform: 'unset', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '3px' }}>
                <IconifyIcon icon={'mdi:youtube'} />
                {item.title} sahifadan qanday foydalaniladi?
            </Button>
        </Box>
    )
}