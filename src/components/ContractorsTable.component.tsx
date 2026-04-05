import { DataGrid, GridColDef, GridActionsCellItem, GridToolbar } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Contractor } from "../types";

interface ContractorsTableProps {
  contractors: Contractor[];
  isLoading: boolean;
  onEdit: (contractor: Contractor) => void;
  onDelete: (id: string) => void;
}

const ContractorsTable = ({ contractors, isLoading, onEdit, onDelete }: ContractorsTableProps) => {
  const columns: GridColDef[] = [
    { field: "contractor_name", headerName: "Name", flex: 1, minWidth: 150 },
    { field: "contractor_email", headerName: "Email", flex: 1, minWidth: 180 },
    { field: "contractor_phone", headerName: "Phone", width: 150 },
    { field: "contractor_city", headerName: "City", width: 130 },
    { field: "contractor_address", headerName: "Address", flex: 1, minWidth: 150 },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      getActions: ({ row }) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          onClick={() => onEdit(row as Contractor)}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => onDelete(row._id)}
        />
      ]
    }
  ];

  return (
    <DataGrid
      rows={contractors}
      columns={columns}
      getRowId={row => row._id}
      loading={isLoading}
      slots={{ toolbar: GridToolbar }}
      slotProps={{ toolbar: { showQuickFilter: true } }}
      pageSizeOptions={[10, 25, 50]}
      initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
      autoHeight
      disableRowSelectionOnClick
    />
  );
};

export default ContractorsTable;
