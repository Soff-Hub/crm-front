import { Box, Button, Chip, Dialog, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';
import 'react-datepicker/dist/react-datepicker.css';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next/types';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from 'src/@core/utils/api';
import { formatCurrency } from 'src/@core/utils/format-currency';
import 'rsuite/DateRangePicker/styles/index.css';
import DataTable, { customTableDataProps } from 'src/@core/components/table';
import CreateCostForm from 'src/views/apps/finance/CreateCostForm';
import IconifyIcon from 'src/@core/components/icon';
import { DateRangePicker } from 'rsuite';
import { formatDateString } from '..';
import EditCostForm from 'src/views/apps/finance/EditCostForm';
import CostRowActions from 'src/views/apps/finance/CostRowOptions';


function Slug(props: { slug: string }) {
    const { query } = useRouter()

    const { t } = useTranslation()

    const [data, setData] = useState<any[]>([]);
    const [name, setName] = useState<string>('');
    const [allAmount, setAllAmount] = useState<string>('');
    const [open, setOpen] = useState<any>(null)
    const [editable, setEditable] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [date, setDate] = useState<any>('')

    const updateCategory = async () => {
        try {
            await api.patch(`common/finance/expense-category/update/${query?.slug}/`, { name })
            getExpense(``)
            setEditable(false)
        } catch (err) {
            console.log(err)
        }
    }

    const getExpense = async (params: string) => {
        setLoading(true)
        const resp = await api.get(`common/finance/expense/list/${query?.slug}/?${params}`)
        setData(resp.data.result);
        setName(resp.data?.category);
        setAllAmount(resp.data?.total_expense);
        setLoading(false)
    }

    const onEdit = (id: any) => {
        const find = data.find(el => el.id === id)
        setOpen(find)
        console.log(id);

    }

    const columns: customTableDataProps[] = [
        {
            xs: 0.03,
            title: '#',
            dataIndex: 'index'
        },
        {
            xs: 0.2,
            title: 'Summa',
            dataIndex: 'amount',
            render: (amount) => `${formatCurrency(amount)} so'm`
        },
        {
            xs: 0.2,
            title: 'Sana',
            dataIndex: 'date'
        },
        {
            xs: 0.5,
            title: 'Izoh',
            dataIndex: 'description'
        },
        {
            xs: 0.05,
            title: '',
            dataIndex: 'id',
            render: (id) => <CostRowActions reRender={() => getExpense(``)} id={Number(id)} onEdit={onEdit} />,
        }
    ]


    const handleChangeDate = async (e: any) => {
        if (e) {
            await getExpense(`start_date=${formatDateString(e[0])}&end_date=${formatDateString(e[1])}`)
        } else {
            await getExpense(``)
        }

        setDate(e)
    }

    useEffect(() => {
        getExpense(``)
    }, [])

    return (
        <Box>
            <Box className='header'>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, px: 2 }}>
                    {editable ? <TextField onBlur={updateCategory} size='small' sx={{ fontSize: '20px', marginRight: 4 }} value={name} onChange={(e) => setName(e.target.value)} /> : <Typography variant='h6' sx={{ marginRight: 4 }}>{name}</Typography>}
                    <IconifyIcon style={{ cursor: 'pointer' }} icon={editable ? 'ic:baseline-check' : 'mdi:edit'} onClick={() => setEditable(!editable)} />

                    <DateRangePicker showOneCalendar placement="bottomEnd" locale={{
                        last7Days: "Oxirgi hafta",
                        sunday: "Yak",
                        monday: "Du",
                        tuesday: "Se",
                        wednesday: "Cho",
                        thursday: "Pa",
                        friday: "Ju",
                        saturday: "Sha",
                        ok: "Ok",
                        today: "Bugun",
                        yesterday: "Kecha",
                        hours: "Soat",
                        minutes: "Minut",
                        seconds: "Sekund",
                    }}
                        style={{ marginLeft: 'auto' }}
                        format="yyyy-MM-dd"
                        onChange={handleChangeDate}
                        translate={'yes'}
                        size="sm"
                        value={date}
                    />

                    <Typography sx={{ fontSize: '14px', color: 'error.main', ml: 4, display: 'flex', alignItems: 'center', mr: 4, gap: '5px' }} >
                        <Chip variant='outlined' size='medium' sx={{ fontSize: "14px", fontWeight: "bold" }} color="error" label={`${formatCurrency(allAmount)} so'm`} />
                    </Typography>

                    <Button variant='contained' size='small' onClick={() => setOpen('create')}>Yangi</Button>
                </Box>
            </Box>

            <DataTable loading={loading} columns={columns} data={data} />

            <Dialog open={open === 'create'} onClose={() => setOpen(null)}>
                <DialogTitle sx={{ textAlign: 'center' }}>Xarajat kiritish</DialogTitle>
                <DialogContent sx={{ minWidth: '320px' }}>
                    <CreateCostForm slug={props.slug} setOpen={setOpen} reRender={() => getExpense('')} />
                </DialogContent>
            </Dialog>

            <Dialog open={open?.id} onClose={() => setOpen(null)}>
                <DialogTitle sx={{ textAlign: 'center' }}>Xarajatni tahrirlash</DialogTitle>
                <DialogContent sx={{ minWidth: '320px' }}>
                    <EditCostForm slug={props.slug} setOpen={setOpen} reRender={() => getExpense('')} initials={open} />
                </DialogContent>
            </Dialog>
        </Box>
    )
}


export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { params } = context;

    return {
        props: {
            slug: params?.slug
        },
    };
}

export default Slug
