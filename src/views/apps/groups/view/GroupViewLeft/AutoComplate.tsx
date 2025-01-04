import TextField from '@mui/material/TextField';
import Autocomplete, { AutocompleteChangeReason, AutocompleteChangeDetails } from '@mui/material/Autocomplete';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { StudentDetailType } from 'src/types/apps/studentsTypes';
import useDebounce from 'src/hooks/useDebounce';
import api from 'src/@core/utils/api';
import { AutocompleteValue } from '@mui/material';

export default function AutoComplete({ setSelectedStudents }: { setSelectedStudents: (id: number | null) => void }) {
    const { t } = useTranslation();
    const [searchData, setSearchData] = useState<{ label: string, id: number }[]>([]);
    const [search, setSearch] = useState("");

    const searchDebounce = useDebounce(search, 500);

    const searchStudent = async () => {
        setSearchData([]);
        const resp = await api.get('student/list/?search=' + searchDebounce);
        setSearchData(resp.data.results?.map((item: StudentDetailType) => ({ label: item?.first_name, id: item?.id })));
    };

    useEffect(() => {
        if (searchDebounce !== '') {
            searchStudent();
        } else {
            setSearchData([]);
        }
    }, [searchDebounce]);

    return (
        <Autocomplete
            disablePortal
            onChange={(
                event: React.SyntheticEvent,
                value: AutocompleteValue<{ label: string, id: number }, false, false, false>,
                reason: AutocompleteChangeReason,
                details?: AutocompleteChangeDetails<{ label: string, id: number }>
            ) => setSelectedStudents(value ? value.id : null)}
            onInputChange={(event: React.SyntheticEvent, value: string) => setSearch(value)}
            id="combo-box-demo"
            options={searchData}
            renderInput={(params) => <TextField {...params} label={t("O'quvchini qidiring")} />}
        />
    );
}
