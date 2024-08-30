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
                                <TableCell >
                                    <Typography variant="body1">
                                        O'quvchilar to'lashi kerak:{" "}
                                    </Typography>
                                    <Typography color="orange" variant="body2">
                                        so'm
                                    </Typography>
                                </TableCell>
                                <TableCell colSpan={2}>
                                    <Typography variant="body1">
                                        To'lov qilgan o'quvchilardan ulushi{" "}
                                    </Typography>
                                    <Typography color="green" variant="body2">
                                        so'm
                                    </Typography>
                                </TableCell>
                                <TableCell colSpan={2}>
                                    <Typography variant="body1">Hissa qo'shgan</Typography>
                                    <Typography color="blue" variant="body2">
                                        so'm
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead>
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
                                    Kutilayotgan ulush
                                </TableCell>
                                <TableCell
                                    sx={{ color: "#000", fontWeight: "bold" }}

                                >
                                    Jamg'arilgan ulush
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow
                                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                            >
                                <TableCell >{"Item"}</TableCell>
                                <TableCell >{"Item"}</TableCell>
                                <TableCell >{"Item"}</TableCell>
                                <TableCell >{"Item"}</TableCell>
                                <TableCell >{"Item"}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Modal>
    )
}
