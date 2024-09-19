import {
    Box,
    Modal,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from "@mui/material";
import EmptyContent from "src/@core/components/empty-content";
import { formatCurrency } from "src/@core/utils/format-currency";
import { useAppDispatch, useAppSelector } from "src/store";
import { setCalculatedSalary } from "src/store/apps/finance";
import { GroupFinance } from "src/types/apps/finance";

const headerStyle = { color: "#000", fontWeight: "bold" }
const bodyStyle = { borderRight: "1px solid #e2e8f0 !important", padding: "10px !important", textAlign: "center" }

export default function TeacherGroupsModal() {
    const { calculatedSalary } = useAppSelector(state => state.finance)
    const dispatch = useAppDispatch()

    return (
        <Modal
            open={!!calculatedSalary}
            onClose={() => dispatch(setCalculatedSalary(null))}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Box
                sx={{
                    minWidth: 800,
                    maxWidth: "90%",
                }}
            >
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                        <TableHead sx={{ padding: "10px 0" }}>
                            <TableRow>
                                <TableCell sx={headerStyle}>Guruhi</TableCell>
                                <TableCell sx={headerStyle}>O'quvchilar soni</TableCell>
                                <TableCell sx={headerStyle}>Darslar soni</TableCell>
                                <TableCell sx={headerStyle}>O'tilgan darslar soni</TableCell>
                                <TableCell sx={headerStyle}>Jarimalar soni</TableCell>
                                <TableCell sx={headerStyle}>O'quvchilardan to'lov</TableCell>
                                <TableCell sx={headerStyle}>O'qituvchi ulushi</TableCell>
                                <TableCell sx={headerStyle}>Hisoblangan sana</TableCell>
                            </TableRow>
                        </TableHead>
                        {calculatedSalary?.length ?
                            <TableBody>
                                {calculatedSalary?.map((item: GroupFinance, index: number) => (
                                    <TableRow
                                        key={index}
                                        sx={{ "&:last-child td, &:last-child th": { border: 0, padding: "10px 0" } }}
                                    >
                                        <TableCell sx={bodyStyle} >{item.group_name} </TableCell>
                                        <TableCell sx={bodyStyle} >{item.students_count}</TableCell>
                                        <TableCell sx={bodyStyle} >{item.allowed_lessons} </TableCell>
                                        <TableCell sx={bodyStyle} >{item.attended_lessons} </TableCell>
                                        <TableCell sx={bodyStyle} >{item.fines_count}</TableCell>
                                        <TableCell sx={bodyStyle} >{formatCurrency(item.original_amount)} UZS</TableCell>
                                        <TableCell sx={bodyStyle} >{formatCurrency(item.condition)} UZS</TableCell>
                                        <TableCell sx={bodyStyle} >{item.calculated_date}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            : <TableRow >
                                <TableCell colSpan={8}>
                                    <EmptyContent /></TableCell>
                            </TableRow>
                        }
                    </Table>
                </TableContainer>
            </Box>
        </Modal>
    )
}
