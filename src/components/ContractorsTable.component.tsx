import useTitle from "../hooks/useTitle";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Typography
} from "@mui/material";

const ContractorsTable = ({
  // props with type definitions
  contractors,
  isLoading,
  isError,
  errorMessage
}: ContractorsTableProps) => {
  useTitle("Contractors");
  return (
    <TableContainer component={Paper}>
      <Table aria-label="contractors table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell sx={{ display: { xs: "none", sm: "revert" } }}>
              Address
            </TableCell>
            <TableCell sx={{ display: { xs: "none", sm: "revert" } }}>
              City
            </TableCell>
            <TableCell sx={{ display: { xs: "none", sm: "revert" } }}>
              Province
            </TableCell>
            <TableCell sx={{ display: { xs: "none", sm: "revert" } }}>
              Postal Code
            </TableCell>
            <TableCell sx={{ display: { xs: "none", sm: "revert" } }}>
              Phone
            </TableCell>
            <TableCell>Email</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {contractors.length ? (
            contractors.map(contractor => (
              <TableRow
                key={contractor.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {contractor.name}
                </TableCell>
                <TableCell sx={{ display: { xs: "none", sm: "revert" } }}>
                  {contractor.address}
                </TableCell>
                <TableCell sx={{ display: { xs: "none", sm: "revert" } }}>
                  {contractor.city}
                </TableCell>
                <TableCell sx={{ display: { xs: "none", sm: "revert" } }}>
                  {contractor.state}
                </TableCell>
                <TableCell sx={{ display: { xs: "none", sm: "revert" } }}>
                  {contractor.zip}
                </TableCell>
                <TableCell sx={{ display: { xs: "none", sm: "revert" } }}>
                  {contractor.phone}
                </TableCell>
                <TableCell>{contractor.email}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              {isLoading && (
                <TableCell colSpan={7} align="center">
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
                <TableCell colSpan={7} align="center">
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
                <TableCell colSpan={7} align="center">
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
      </Table>
    </TableContainer>
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
}
