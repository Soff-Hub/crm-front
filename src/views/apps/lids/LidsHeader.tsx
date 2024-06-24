import { Box, Button, Switch, TextField } from '@mui/material'
import { useRouter } from 'next/router'
import React, { FormEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'src/store'
import { fetchDepartmentList, updateLeadParams } from 'src/store/apps/leads'

type Props = {}

export default function LidsHeader({ }: Props) {

    const { queryParams } = useAppSelector(state => state.leads)
    const dispatch = useAppDispatch()
    const { push } = useRouter()
    const { t } = useTranslation()

    const [search, setSearch] = useState<string>('')

    const searchSubmit = (e?: FormEvent<HTMLFormElement>) => {
        e?.preventDefault?.()
        dispatch(updateLeadParams({ search }))
        dispatch(fetchDepartmentList({ ...queryParams, search }))
    }


    const viewArchive = (is_active: boolean) => {
        dispatch(updateLeadParams({ is_active }))
        dispatch(fetchDepartmentList({ ...queryParams, is_active }))
    }


    return (
        <Box sx={{ width: '100%', p: '10px 0' }}>
            <form style={{ display: 'flex', alignItems: 'center', gap: '5px' }} onSubmit={searchSubmit}>
                <TextField
                    defaultValue={''}
                    autoComplete='off'
                    autoFocus
                    size='small'
                    sx={{ maxWidth: '300px', width: '100%' }} color='primary' placeholder={`${t("Qidirish")}...`} onChange={(e) => {
                        setSearch(e.target.value)
                    }} />
                <Button variant='outlined' onClick={() => searchSubmit()}>{t("Qidirish")}</Button>
                <label>
                    <Switch checked={!queryParams.is_active} onChange={(e, v) => viewArchive(!v)} />
                    {t("Arxiv")}
                </label>
                <Button variant='outlined' onClick={() => push('/lids/stats')}>{t("Hisobot")}</Button>
            </form>
        </Box>
    )
}