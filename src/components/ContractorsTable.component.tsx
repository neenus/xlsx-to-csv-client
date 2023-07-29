import useTitle from "../hooks/useTitle";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box
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
    <TableContainer component={Box}>
      {isLoading && <div>Loading...</div>}
      {isError && <div>{errorMessage}</div>}
      <Table sx={{ minWidth: 650 }} aria-label="contractors table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>City</TableCell>
            <TableCell>State</TableCell>
            <TableCell>Zip</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Email</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {contractors.map((contractor: Contractor) => (
            <TableRow
              key={contractor._id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {contractor.name}
              </TableCell>
              <TableCell align="right">{contractor.address}</TableCell>
              <TableCell align="right">{contractor.city}</TableCell>
              <TableCell align="right">{contractor.state}</TableCell>
              <TableCell align="right">{contractor.zip}</TableCell>
              <TableCell align="right">{contractor.phone}</TableCell>
              <TableCell align="right">{contractor.email}</TableCell>
            </TableRow>
          ))}
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
