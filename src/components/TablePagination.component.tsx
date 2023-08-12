import { TablePagination, TableRow, TablePaginationProps } from "@mui/material";
import TablePaginationActions from "@mui/material/TablePagination/TablePaginationActions";

const TablePaginationComponent = ({
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange
}: TablePaginationProps) => {
  return (
    <TableRow>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        colSpan={8}
        count={count}
        rowsPerPage={rowsPerPage}
        page={page}
        SelectProps={{
          inputProps: {
            "aria-label": "rows per page"
          },
          native: true
        }}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        ActionsComponent={TablePaginationActions}
      />
    </TableRow>
  );
};

export default TablePaginationComponent;
