//@ts-nocheck
import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { DateRangePicker } from "rsuite"
import { formatDateString } from "src/pages/finance"
import { useAppDispatch, useAppSelector } from "src/store"
import { fetchStudentPaymentsList, updateParams } from "src/store/apps/reports/studentPayments"

export default function FilterBlock() {
    const { t } = useTranslation()
    const { groups, queryParams } = useAppSelector(state => state.studentPayments)
    const dispatch = useAppDispatch()
    const [date, setDate] = useState<any>('')

    const handleChangeDate = async (e: any) => {
        if (e) {
            dispatch(updateParams({ start_date: `${formatDateString(e[0])}`, end_date: `${formatDateString(e[1])}`, page: "1" }))
            const queryString = new URLSearchParams({ ...queryParams, start_date: `${formatDateString(e[0])}`, end_date: `${formatDateString(e[1])}`, page: "1" }).toString()
            await dispatch(fetchStudentPaymentsList(queryString))
        } else {
            dispatch(updateParams({ start_date: ``, end_date: ``, page: "1" }))
            const queryString = new URLSearchParams({ ...queryParams, start_date: ``, end_date: ``, page: "1" }).toString()
            await dispatch(fetchStudentPaymentsList(queryString))
        }
        setDate(e)
    }

    const handleFilterGroup = async (e: SelectChangeEvent<string>) => {
        dispatch(updateParams({ group: e.target.value, page: "1" }))
        const queryString = new URLSearchParams({ ...queryParams, group: e.target.value, page: "1" }).toString()
        await dispatch(fetchStudentPaymentsList(queryString))
    }
    console.log(queryParams);


    return (
        <Box sx={{ display: "grid", alignItems: "center", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <FormControl fullWidth>
                <InputLabel size='small' id='demo-simple-select-outlined-label'>{t('Guruhlar')}</InputLabel>
                <Select
                    sx={{ bgcolor: "white" }}
                    size='small'
                    label={t('Guruhlar')}
                    value={queryParams.group || ""}
                    id='demo-simple-select-outlined'
                    labelId='demo-simple-select-outlined-label'
                    onChange={(e: SelectChangeEvent<string>) => handleFilterGroup(e)}
                >
                    <MenuItem value={''}>
                        <b>{t('Barchasi')}</b>
                    </MenuItem>
                    {
                        groups?.map((group: any) => (
                            <MenuItem key={group.id} value={group.id}>{group.name}</MenuItem>
                        ))
                    }
                </Select>
            </FormControl>
            <DateRangePicker style={{ minWidth: "auto" }} showOneCalendar placement="bottomEnd"
                locale={{
                    last7Days: t("Oxirgi hafta"),
                    sunday: t("Yak"),
                    monday: t("Du"),
                    tuesday: t("Se"),
                    wednesday: t("Chor"),
                    thursday: t("Pa"),
                    friday: t("Ju"),
                    saturday: t("Sha"),
                    ok: t("Saqlash"),
                    today: t("Bugun"),
                    yesterday: t("Kecha"),
                    hours: t("Soat"),
                    minutes: t("Minut"),
                    seconds: t("Sekund"),
                }}
                format="yyyy-MM-dd"
                onChange={handleChangeDate}
                translate={'yes'}
                size="lg"
                value={date}
            />
        </Box>
    )
}
