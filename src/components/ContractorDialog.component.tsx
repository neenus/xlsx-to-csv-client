import React, { FormEvent, useEffect, useState } from "react";
import {
  Dialog,
  Paper,
  Stack,
  FormControl,
  Button,
  TextField,
  Typography
} from "@mui/material";
import { Contractor } from "../types";

interface ContractorDialogProps {
  isDialogOpen: boolean;
  handleDialogOpenClose: () => void;
  handleSubmit: (
    e: FormEvent<HTMLFormElement>,
    contractor: Contractor
  ) => Promise<void>;
  action?: string;
  contractor?: Contractor;
}

const ContractorDialog: React.FC<ContractorDialogProps> = ({
  isDialogOpen,
  handleDialogOpenClose,
  handleSubmit,
  contractor
}) => {
  const [formData, setFormData] = useState<Contractor>({
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    email: ""
  });
  const [action, setAction] = useState<string>("");

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
    if (match) {
      return `(${match[1]}${match[1] ? ")" : ""} ${match[2]}${match[2] ? "-" : ""}${match[3]}`;
    }
    return value;
  };

  const formatZipCode = (value: string) => {
    const cleaned = value.replace(/\W/g, "").toUpperCase();

    // Format the cleaned postal code as L0L 0L0
    const match = cleaned.match(/^([A-Z]\d[A-Z])(\d[A-Z]\d)?$/);
    if (match) {
      return `${match[1]}${match[2] ? " " + match[2] : ""}`;
    }

    return value;
  }

  const resetForm = () => {
    setFormData({
      name: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      phone: "",
      email: ""
    });
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    let formattedValue = value;
    if (name === "phone") {
      formattedValue = formatPhoneNumber(value);
    } else if (name === "zip") {
      formattedValue = formatZipCode(value);
    }

    setFormData(prev => ({ ...prev, [name]: formattedValue }));
  };

  useEffect(() => {
    // set action for dialog title
    contractor ? setAction("Edit") : setAction("Add");

    // update form data when editing an existing contractor
    if (contractor) {
      let formData = { ...contractor };

      // set empty string if field is undefined
      if (!formData.name) formData.name = "";
      if (!formData.address) formData.address = "";
      if (!formData.city) formData.city = "";
      if (!formData.state) formData.state = "";
      if (!formData.zip) formData.zip = "";
      if (!formData.phone) formData.phone = "";
      if (!formData.email) formData.email = "";

      setFormData(formData);
    } else {
      // reset form data when adding a new contractor
      resetForm();
    }
  }, [contractor, setFormData]);

  return (
    <Dialog
      open={isDialogOpen}
      onClose={handleDialogOpenClose}
      fullWidth
      maxWidth="sm"
    >
      <Paper sx={{ p: 2 }}>
        <form
          onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
            handleSubmit(e, formData)
            resetForm()
          }
          }
        >
          <Typography
            variant="h5"
            gutterBottom
            sx={{ fontWeight: "800", textAlign: "center", mb: 3 }}
          >
            {action} Contractor
          </Typography>

          <Stack spacing={2}>
            {Object.keys(formData).map((field: any) => {
              if (
                field !== "_id" &&
                field !== "createdAt" &&
                field !== "updatedAt" &&
                field !== "__v"
              )
                return (
                  <FormControl fullWidth key={field}>
                    <TextField
                      id={field}
                      name={field}
                      variant="outlined"
                      fullWidth
                      required
                      autoFocus
                      error={false}
                      helperText={""}
                      label={field.charAt(0).toUpperCase() + field.slice(1)}
                      value={formData[field as keyof Contractor]}
                      onChange={handleChange}
                    />
                  </FormControl>
                );
            })}
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
              {action} Contractor
            </Button>
          </Stack>
        </form>
      </Paper>
    </Dialog>
  );
};

export default ContractorDialog;
