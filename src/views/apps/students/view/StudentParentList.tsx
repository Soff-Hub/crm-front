import { Box, Button, IconButton, Typography } from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import IconifyIcon from 'src/@core/components/icon'
import DataTable from 'src/@core/components/table'
import { customTableProps } from 'src/pages/students'
import { useAppSelector } from 'src/store'
import AddStudentParent from './AddStudentParent'

export default function StudentParentList() {
    const [open, setOpen] = useState<"create" | "edit" | null>(null)
    const { t } = useTranslation()
    const { studentData } = useAppSelector(state => state.students)

    const columns: customTableProps[] = [
        {
            xs: 1,
            title: t("Ism familaya"),
            dataIndex: 'first_name'
        },
        {
            xs: 1,
            title: t("Telefon raqami"),
            dataIndex: 'phone',
        },
        {
            xs: 1,
            title: t("Tahrirlash"),
            dataIndex: '',
            render: (id) => (
                <Box sx={{ textAlign: "end" }}>
                    <IconButton onClick={() => setOpen("edit")}>
                        <IconifyIcon icon='iconamoon:edit-thin' />
                    </IconButton>
                </Box>
            )
        }
    ]

    return (
        <Box sx={{ mt: 4 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant='h6'>{t("Ota-onalari")}</Typography>
                {!studentData?.parent_data && <Button onClick={() => setOpen("create")} variant='contained'>{t("Qo'shish")}</Button>}
            </Box>
            <DataTable
                maxWidth="100%"
                minWidth="100%"
                data={studentData?.parent_data ? [studentData?.parent_data] : []}
                columns={columns} />

            <AddStudentParent
                open={open}
                setOpen={setOpen}
            />
        </Box>
    )
}
