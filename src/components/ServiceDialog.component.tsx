import React, { FormEvent, useEffect, useState } from "react";
import {
  Dialog,
  Paper,
  Stack,
  FormControl,
  Button,
  TextField,
  Typography,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
  OutlinedInput
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import { Service } from "../types";

const EDUCATION_LEVELS = ["elementary", "high school", "postsecondary"];

interface ServiceDialogProps {
  isDialogOpen: boolean;
  handleDialogOpenClose: () => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>, service: Service) => Promise<void>;
  service?: Service;
}

const emptyService: Service = {
  service_name: "",
  service_education_level: [],
  service_rate: 0,
  aliases: []
};

const ServiceDialog: React.FC<ServiceDialogProps> = ({
  isDialogOpen,
  handleDialogOpenClose,
  handleSubmit,
  service
}) => {
  const [formData, setFormData] = useState<Service>(emptyService);
  const [aliasesInput, setAliasesInput] = useState<string>("");
  const action = service ? "Edit" : "Add";

  const resetForm = () => {
    setFormData(emptyService);
    setAliasesInput("");
  };

  useEffect(() => {
    if (service) {
      setFormData({ ...service });
      setAliasesInput((service.aliases || []).join(", "));
    } else {
      resetForm();
    }
  }, [service]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "service_rate" ? Number(value) : value
    }));
  };

  const handleLevelChange = (e: SelectChangeEvent<string[]>) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      service_education_level: typeof value === "string" ? value.split(",") : value
    }));
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    const aliases = aliasesInput
      .split(",")
      .map(a => a.trim().toLowerCase())
      .filter(a => a.length > 0);
    handleSubmit(e, { ...formData, aliases });
    resetForm();
  };

  return (
    <Dialog open={isDialogOpen} onClose={handleDialogOpenClose} fullWidth maxWidth="sm">
      <Paper sx={{ p: 2 }}>
        <form onSubmit={handleFormSubmit}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: "800", textAlign: "center", mb: 3 }}>
            {action} Service
          </Typography>

          <Stack spacing={2}>
            <TextField
              id="service_name"
              name="service_name"
              label="Service Name"
              variant="outlined"
              fullWidth
              required
              value={formData.service_name}
              onChange={handleChange}
            />

            <FormControl fullWidth required>
              <InputLabel id="education-level-label">Education Level</InputLabel>
              <Select
                labelId="education-level-label"
                multiple
                value={formData.service_education_level}
                onChange={handleLevelChange}
                input={<OutlinedInput label="Education Level" />}
                renderValue={selected => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {(selected as string[]).map(val => (
                      <Chip key={val} label={val.charAt(0).toUpperCase() + val.slice(1)} size="small" />
                    ))}
                  </Box>
                )}
              >
                {EDUCATION_LEVELS.map(level => (
                  <MenuItem key={level} value={level}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              id="service_rate"
              name="service_rate"
              label="Rate ($/hr)"
              variant="outlined"
              fullWidth
              required
              type="number"
              inputProps={{ min: 0, step: 0.01 }}
              value={formData.service_rate}
              onChange={handleChange}
            />

            <TextField
              id="aliases"
              name="aliases"
              label="Aliases (comma-separated)"
              variant="outlined"
              fullWidth
              helperText="Phrases from the billing sheet that should map to this service, e.g. 'academic and writing strategies, academic & writing strategies'"
              value={aliasesInput}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAliasesInput(e.target.value)}
            />
          </Stack>

          <Stack direction="row" spacing={2} sx={{ mt: 3, justifyContent: "end" }}>
            <Button color="inherit" onClick={handleDialogOpenClose}>Cancel</Button>
            <Button variant="contained" color="primary" type="submit">{action} Service</Button>
          </Stack>
        </form>
      </Paper>
    </Dialog>
  );
};

export default ServiceDialog;
