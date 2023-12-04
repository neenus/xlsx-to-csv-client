import { useState, useCallback } from "react";
import useTitle from "../hooks/useTitle";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Typography,
  IconButton,
  TableFooter
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import TablePaginationComponent from "./TablePagination.component";
import ConfirmationDialog from "./ConfirmationDialog.component";

const ContractorsTable = ({
  contractors,
  isLoading,
  isError,
  errorMessage,
  deleteContractor
}: ContractorsTableProps) => {
  useTitle("Contractors");
  const [contractorId, setContractorId] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);

  const handleDialogOpenClose = useCallback(
    () => setDialogOpen((prev: boolean) => !prev),
    []
  );

  const confirmDeleteContractor = useCallback((id: string) => {
    setContractorId(id);
    handleDialogOpenClose();
  }, []);

  return (
    <>
      <ConfirmationDialog
        open={dialogOpen}
        onClose={handleDialogOpenClose}
        onConfirm={() => {
          deleteContractor(contractorId);
          handleDialogOpenClose();
        }}
        title="Delete Contractor"
        content="Are you sure you want to delete this contractor?"
      />
      <TableContainer component={Paper}>
        <Table aria-label="contractors table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "900" }}>Name</TableCell>
              <TableCell
                sx={{
                  fontWeight: "900",
                  display: { xs: "none", sm: "revert" }
                }}
              >
                Phone
              </TableCell>
              <TableCell sx={{ fontWeight: "900" }}>Email</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contractors.length ? (
              contractors
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(contractor => (
                  <TableRow
                    key={contractor._id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {contractor.name}
                    </TableCell>
                    <TableCell sx={{ display: { xs: "none", sm: "revert" } }}>
                      {contractor.phone}
                    </TableCell>
                    <TableCell>{contractor.email}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        aria-label="edit"
                        color="primary"
                        // TODO: implement edit contractor functionality
                        onClick={() =>
                          console.log("edit contractor", contractor)
                        }
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        aria-label="delete"
                        color="error"
                        onClick={() => confirmDeleteContractor(contractor._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                {isLoading && (
                  <TableCell colSpan={8} align="center">
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{ p: 2, fontWeight: "bold" }}
                    >
                      Loading...
                    </Typography>
                  </TableCell>
                )}
                {isError && (
                  <TableCell colSpan={8} align="center">
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{ p: 2, color: "red", fontWeight: "bold" }}
                    >
                      Error occured while fetching data: error message:{" "}
                      {errorMessage}
                    </Typography>
                  </TableCell>
                )}

                {!isLoading && !isError && (
                  <TableCell colSpan={8} align="center">
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{ p: 2, fontWeight: "bold" }}
                    >
                      No data found
                    </Typography>
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>

          <TableFooter>
            <TablePaginationComponent
              count={contractors.length}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={(_, newPage) => setPage(newPage)}
              onRowsPerPageChange={event => {
                setRowsPerPage(parseInt(event.target.value, 10));
                setPage(0);
              }}
            />
          </TableFooter>
        </Table>
      </TableContainer>
    </>
  );
};

export default ContractorsTable;

interface Contractor {
  _id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
}

interface ContractorsTableProps {
  contractors: Contractor[];
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
  deleteContractor: (id: string) => void;
}
