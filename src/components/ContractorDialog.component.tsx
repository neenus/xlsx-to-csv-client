import React, { FormEvent } from "react";
import {
  Dialog,
  Paper,
  Stack,
  FormControl,
  Button,
  TextField,
  Typography
} from "@mui/material";

interface ContractorDialogProps {
  isDialogOpen: boolean;
  handleDialogOpenClose: () => void;
  handleAddContractor: (event: FormEvent<HTMLFormElement>) => void;
}

const ContractorDialog: React.FC<ContractorDialogProps> = ({
  isDialogOpen,
  handleDialogOpenClose,
  handleAddContractor
}) => {
  return (
    <Dialog
      open={isDialogOpen}
      onClose={handleDialogOpenClose}
      fullWidth
      maxWidth="sm"
    >
      <Paper sx={{ p: 2 }}>
        <form onSubmit={handleAddContractor}>
          <Typography
            variant="h5"
            gutterBottom
            sx={{ fontWeight: "800", textAlign: "center", mb: 3 }}
          >
            Add Contractor
          </Typography>

          <Stack spacing={2}>
            <FormControl fullWidth>
              <TextField
                id="name"
                name="name"
                variant="outlined"
                fullWidth
                required
                autoFocus
                error={false}
                helperText={""}
                label="Name"
              />
            </FormControl>

            <FormControl fullWidth>
              <TextField
                id="address"
                name="address"
                variant="outlined"
                fullWidth
                required
                autoFocus
                error={false}
                helperText={""}
                label="Address"
              />
            </FormControl>

            <FormControl fullWidth>
              <TextField
                id="city"
                name="city"
                variant="outlined"
                fullWidth
                required
                autoFocus
                error={false}
                helperText={""}
                label="City"
              />
            </FormControl>

            <FormControl fullWidth>
              <TextField
                id="state"
                name="state"
                variant="outlined"
                fullWidth
                required
                autoFocus
                error={false}
                helperText={""}
                label="Province"
              />
            </FormControl>

            <FormControl fullWidth>
              <TextField
                id="zip"
                name="zip"
                variant="outlined"
                fullWidth
                required
                autoFocus
                error={false}
                helperText={""}
                label="Postal Code"
              />
            </FormControl>

            <FormControl fullWidth>
              <TextField
                id="phone"
                name="phone"
                variant="outlined"
                fullWidth
                required
                autoFocus
                error={false}
                helperText={""}
                label="Phone"
              />
            </FormControl>

            <FormControl fullWidth>
              <TextField
                id="email"
                name="email"
                variant="outlined"
                fullWidth
                required
                autoFocus
                error={false}
                helperText={""}
                label="Email"
              />
            </FormControl>
          </Stack>

          <Stack
            direction="row"
            spacing={2}
            sx={{
              mt: 3,
              justifyContent: "end"
            }}
          >
            <Button color="inherit" onClick={handleDialogOpenClose}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" type="submit">
              Add Contractor
            </Button>
          </Stack>
        </form>
      </Paper>
    </Dialog>
  );
};

export default ContractorDialog;
