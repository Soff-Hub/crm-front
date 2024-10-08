import { Box, Button } from "@mui/material";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import IconifyIcon from "src/@core/components/icon";
import DataTable from "src/@core/components/table";
import { customTableProps } from "src/pages/groups";
import { useAppDispatch, useAppSelector } from "src/store";
import { getExams, getResults, setEditData, setOpen, setResultId } from "src/store/apps/groupDetails";
import AddExam from "./AddExam";
import ExamResults from "./ExamResults";
import EditExam from "./EditExam";
import DeleteExam from "./DeleteExam";
import { AuthContext } from "src/context/AuthContext";

export interface ExamType {
    id: number
    title: string
    max_score: number
    min_score: number
    date: string
}

const GroupExamsList = () => {
    const dispatch = useAppDispatch()
    const { exams, resultId, isGettingExams } = useAppSelector(state => state.groupDetails)
    const { user } = useContext(AuthContext)

    const { query } = useRouter()
    const { t } = useTranslation()

    const handleEditOpen = async (id: any) => {
        const findedItem = exams.find((el: any) => el.id === id)
        dispatch(setEditData(findedItem))
        dispatch(setOpen('edit'))
    }

    const handleDeleteOpen = (id: any) => {
        dispatch(setEditData(id))
        dispatch(setOpen('delete'))
    }


    useEffect(() => {
        (async function () {
            if (query?.id) {
                await dispatch(getExams(query?.id))
            }
        })()
    }, [])

    const columns: customTableProps[] = [
        {
            xs: 0.25,
            title: t("Nomi"),
            dataIndex: 'title',
        },
        {
            xs: 0.3,
            title: t("Topshirish sanasi"),
            dataIndex: 'date',
        },
        {
            xs: 0.2,
            title: t("O'tish bali"),
            dataIndex: 'min_score',
        },
        {
            xs: 0.3,
            title: t("Maksimal bal"),
            dataIndex: 'max_score',
        },
        {
            xs: 0.12,
            title: t("Amallar"),
            dataIndex: 'id',
            render: (id) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <IconifyIcon icon='mdi:edit' fontSize={20} onClick={() => handleEditOpen(id)} />
                    <IconifyIcon icon='mdi:delete' fontSize={20} onClick={() => handleDeleteOpen(id)} />
                </div>
            )
        },
    ]

    const handleOpenExamResult = async (id: any) => {
        dispatch(setResultId(id))
        await dispatch(getResults({ groupId: query?.id, examId: id }))
    }

    return (
        <>
            {resultId ? < ExamResults /> :
                <Box className='demo-space-y'>
                    {user && user.role[0] !== 'teacher' && <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', margin: 0 }}>
                        <Button variant="contained" sx={{ marginLeft: '15px' }} size="small" onClick={() => dispatch(setOpen('add'))}>{t('Yaratish')}</Button>
                    </div>}
                    <DataTable rowClick={(id: any) => handleOpenExamResult(id)} maxWidth="100%" minWidth="450px" loading={isGettingExams} data={exams} columns={columns} />
                    <AddExam />
                    <EditExam />
                    <DeleteExam />
                </Box>
            }
        </>
    )
}

export default GroupExamsList
