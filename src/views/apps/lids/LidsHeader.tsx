import { Box, Button, Switch, TextField } from '@mui/material'
import { useRouter } from 'next/router'
import React, { FormEvent, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import useDebounce from 'src/hooks/useDebounce'
import { useAppDispatch, useAppSelector } from 'src/store'
import { fetchDepartmentList, updateLeadParams } from 'src/store/apps/leads'

type Props = {}

export default function LidsHeader({ }: Props) {

    const { queryParams } = useAppSelector(state => state.leads)
    const dispatch = useAppDispatch()
    const { push } = useRouter()
    const { t } = useTranslation()

    const [search, setSearch] = useState<string>('')
    const searchVal = useDebounce(search, 800)

    const viewArchive = (is_active: boolean) => {
        dispatch(updateLeadParams({ is_active }))
        dispatch(fetchDepartmentList({ ...queryParams, is_active }))
    }

    useEffect(() => {
        dispatch(updateLeadParams({ search }))
        dispatch(fetchDepartmentList({ ...queryParams, search }))
    }, [searchVal])

    return (
        <Box sx={{ width: '100%', p: '10px 0' }}>
            <form style={{ display: 'flex', alignItems: 'center', gap: '5px' }} onSubmit={e => e.preventDefault()}>
                <TextField
                    defaultValue={''}
                    autoComplete='off'
                    size='small'
                    sx={{ maxWidth: '300px', width: '100%' }} color='primary' placeholder={`${t("Qidirish")}...`} onChange={(e) => {
                        setSearch(e.target.value)
                    }} />
                <label>
                    <Switch checked={!queryParams.is_active} onChange={(e, v) => viewArchive(!v)} />
                    {t("Arxiv")}
                </label>
                <Button variant='outlined' onClick={() => push('/lids/stats')}>{t("Hisobot")}</Button>
            </form>
        </Box>
    )
}