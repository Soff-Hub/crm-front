//@ts-nocheck
import {
    Box,
    Chip,
    FormControl,
    InputAdornment,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    SelectChangeEvent,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { DateRangePicker } from "rsuite";
import IconifyIcon from "src/@core/components/icon";
import { formatCurrency } from "src/@core/utils/format-currency";
import useDebounce from "src/hooks/useDebounce";
import { formatDateString } from "src/pages/finance";
import { useAppDispatch, useAppSelector } from "src/store";
import { fetchStudentPaymentsList, updateParams } from "src/store/apps/reports/studentPayments";

export default function FilterBlock() {
    const [search, setSearch] = useState<string>('')
    const { t } = useTranslation()
    const { groups, queryParams, total_payments } = useAppSelector(state => state.studentPayments)
    const dispatch = useAppDispatch()
    const [date, setDate] = useState<any>('')
    const searchVal = useDebounce(search, 800)

    useEffect(() => {
        dispatch(updateParams({ search: searchVal, page: "1" }))
        const queryString = new URLSearchParams({ ...queryParams, search: searchVal, page: "1" }).toString()
        dispatch(fetchStudentPaymentsList(queryString))
    }, [searchVal])

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
        <Box sx={{ display: "grid", gridColumn: "2/5", alignItems: "center", gridTemplateColumns: "0.8fr 1fr 1fr 1fr", gap: "10px" }}>
            <Chip variant='outlined' size='medium' sx={{ fontSize: "14px", fontWeight: "bold", }} color="success" label={`${formatCurrency(total_payments)} UZS`} />
            <FormControl variant="outlined" size='small' fullWidth>
                <InputLabel htmlFor="outlined-adornment-password">{t('Qidirish')}</InputLabel>
                <OutlinedInput
                    fullWidth
                    sx={{ bgcolor: "white" }}
                    id="outlined-adornment-password"
                    type={'text'}
                    onChange={(e: any) => setSearch(e.target.value)}
                    value={search}
                    autoComplete='off'
                    endAdornment={
                        <InputAdornment position="end">
                            <IconifyIcon icon={'tabler:search'} />
                        </InputAdornment>
                    }
                    label={t('Qidirish')}
                />
            </FormControl>
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
