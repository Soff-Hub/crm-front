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
    Typography,
} from "@mui/material";
import EmptyContent from "src/@core/components/empty-content";
import { formatCurrency } from "src/@core/utils/format-currency";

interface ITeacherGroupModalProps {
    teacherGroups: any,
    setTeacherGroups: (id: any) => any
}

export default function TeacherGroupsModal({ teacherGroups, setTeacherGroups }: ITeacherGroupModalProps) {
    return (
        <Modal
            open={!!teacherGroups}
            onClose={() => setTeacherGroups(null)}
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
                    maxWidth: "90%", // Responsive width
                }}
            >
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell
                                    sx={{ color: "#000", fontWeight: "bold" }}

                                >
                                    Guruhi
                                </TableCell>
                                <TableCell
                                    sx={{ color: "#000", fontWeight: "bold" }}

                                >
                                    Oy
                                </TableCell>
                                <TableCell
                                    sx={{ color: "#000", fontWeight: "bold" }}

                                >
                                    O'quvchilar to'lashi kerak
                                </TableCell>
                                <TableCell
                                    sx={{ color: "#000", fontWeight: "bold" }}

                                >
                                    O'quvchilar to'ladi
                                </TableCell>
                                <TableCell
                                    sx={{ color: "#000", fontWeight: "bold" }}

                                >
                                    Jamg'arilgan ulush
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        {teacherGroups?.length > 0 ?
                            <TableBody>
                                {teacherGroups?.map((item: any) => (
                                    <TableRow
                                        key={item.id}
                                        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                                    >
                                        <TableCell >{item.group_name} </TableCell>
                                        <TableCell >{item.date}</TableCell>
                                        <TableCell >{formatCurrency(item.planned_payments)} UZS</TableCell>
                                        <TableCell >{formatCurrency(item.student_payments)} UZS</TableCell>
                                        <TableCell >{formatCurrency(item.amount)} UZS</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            : <TableRow >
                                <TableCell colSpan={5}>
                                    <EmptyContent /></TableCell>
                            </TableRow>
                        }
                    </Table>
                </TableContainer>
            </Box>
        </Modal>
    )
}
