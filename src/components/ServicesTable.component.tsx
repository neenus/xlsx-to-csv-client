import { DataGrid, GridColDef, GridActionsCellItem, GridToolbar } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Chip, Box } from "@mui/material";
import { Service } from "../types";

interface ServicesTableProps {
  services: Service[];
  isLoading: boolean;
  onEdit: (service: Service) => void;
  onDelete: (id: string) => void;
}

const ServicesTable = ({ services, isLoading, onEdit, onDelete }: ServicesTableProps) => {
  const columns: GridColDef[] = [
    { field: "service_name", headerName: "Service Name", flex: 1, minWidth: 160 },
    {
      field: "service_education_level",
      headerName: "Education Level",
      flex: 1,
      minWidth: 160,
      renderCell: ({ value }) => (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, alignItems: "center" }}>
          {(value as string[]).map((level: string) => (
            <Chip
              key={level}
              label={level.charAt(0).toUpperCase() + level.slice(1)}
              size="small"
              variant="outlined"
            />
          ))}
        </Box>
      )
    },
    {
      field: "service_rate",
      headerName: "Rate ($/hr)",
      width: 120,
      renderCell: ({ value }) => `$${Number(value).toFixed(2)}`
    },
    {
      field: "aliases",
      headerName: "Aliases",
      flex: 1.5,
      minWidth: 200,
      renderCell: ({ value }) => ((value as string[]) || []).join(", ") || "—"
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      getActions: ({ row }) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          onClick={() => onEdit(row as Service)}
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
      rows={services}
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

export default ServicesTable;
