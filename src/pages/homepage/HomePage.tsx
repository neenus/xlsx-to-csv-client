import { useState, useRef } from "react";
import "./homepage.styles.css";

import {
  Avatar, Button, TextField, Link, Box, Typography, Container,
  LinearProgress, Paper, CssBaseline, Select, MenuItem, FormControl,
  Alert, Stack, Divider
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import useTitle from "../../hooks/useTitle";
import useToast from "../../hooks/useToast";
import axios from "axios";
import { parseHeaders } from "../../api/apiService";

// The fields this app needs from each xlsx row
const EXPECTED_FIELDS: { key: string; label: string }[] = [
  { key: "practitioner", label: "Practitioner" },
  { key: "student", label: "Student / Client Name" },
  { key: "parent", label: "Parent Name" },
  { key: "serviceDesc", label: "Service Description" },
  { key: "hours", label: "Monthly Hours (commitment)" },
  { key: "insuranceReceipt", label: "Insurance Receipt Flag" },
  { key: "registrationFee", label: "Registration Fee Flag" },
];

// Hints used for auto-detecting columns from xlsx headers
const FIELD_HINTS: Record<string, string[]> = {
  practitioner: ["practitioner"],
  student: ["student", "client name"],
  parent: ["parent"],
  serviceDesc: ["service", "schedule"],
  hours: ["monthly commitment", "commitment"],
  insuranceReceipt: ["insurance receipt"],
  registrationFee: ["registration fee", "new student"],
};

const normalizeHeader = (s: string) => s.toLowerCase().trim().replace(/\s+/g, " ");

const autoDetect = (headers: string[]): Record<string, number> => {
  const mapping: Record<string, number> = {};
  Object.entries(FIELD_HINTS).forEach(([field, hints]) => {
    const idx = headers.findIndex(h =>
      hints.some(hint => normalizeHeader(h).includes(hint))
    );
    if (idx !== -1) mapping[field] = idx;
  });
  return mapping;
};

export default function UploadForm() {
  useTitle("Excel to CSV Converter");
  const [nextInvoiceNumber, setNextInvoiceNumber] = useState("");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [parsingHeaders, setParsingHeaders] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [progress] = useState(0);
  const [file, setFile] = useState<ConvertedFile | null>(null);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [headers, setHeaders] = useState<string[]>([]);
  const [columnMapping, setColumnMapping] = useState<Record<string, number>>({});
  const [showMapping, setShowMapping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { notify } = useToast();

  const handleDateChange = (date: any) => setSelectedDate(date.$d);

  const resetForm = () => {
    setSelectedDate(null);
    setNextInvoiceNumber("");
    setErrorMessage("");
    setLoading(false);
    setParsingHeaders(false);
    setSelectedFileName("");
    setHeaders([]);
    setColumnMapping({});
    setShowMapping(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setSelectedFileName(selected.name);
    setShowMapping(false);
    setHeaders([]);
    setColumnMapping({});
    setParsingHeaders(true);
    setErrorMessage("");

    try {
      const result = await parseHeaders(selected);
      setHeaders(result.headers);
      setColumnMapping(autoDetect(result.headers));
      setShowMapping(true);
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.error || "Failed to read file headers.");
    } finally {
      setParsingHeaders(false);
    }
  };

  const handleMappingChange = (field: string, colIndex: number) => {
    setColumnMapping(prev => ({ ...prev, [field]: colIndex }));
  };

  const isMappingComplete = () =>
    EXPECTED_FIELDS.every(({ key }) => columnMapping[key] !== undefined);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setFile(null);

    const selectedFile = fileInputRef.current?.files?.[0];

    if (!nextInvoiceNumber || !selectedDate || !selectedFile || !isMappingComplete()) {
      setLoading(false);
      notify({
        message: "Please fill in all fields, select a file, and complete the column mapping.",
        type: "error"
      });
      return;
    }

    const formData = new FormData();
    formData.append("nextInvoiceNumber", nextInvoiceNumber);
    formData.append("date", selectedDate);
    formData.append("file", selectedFile);
    formData.append("columnMapping", JSON.stringify(columnMapping));

    const baseUrl =
      import.meta.env.MODE !== "production"
        ? `${import.meta.env.VITE_API_BASE_URL}/convert`
        : `${import.meta.env.VITE_API_BASE_URL_PROD}/convert`;

    try {
      const response = await axios.post(baseUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setLoading(false);
      notify({ message: "File uploaded & converted successfully.", type: "success" });
      setFile(response.data.data);
      resetForm();
    } catch (error: any) {
      const msg = error?.response?.data?.error || "Something went wrong, please contact your administrator.";
      setErrorMessage(msg);
      setLoading(false);
      notify({ message: msg, type: "error" });
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <CssBaseline />
      <Box sx={{ marginTop: 8, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Avatar sx={{ margin: 1, backgroundColor: theme => theme.palette.secondary.main }}>
          <CloudUploadIcon />
        </Avatar>
        <Typography component="h1" variant="h5">Upload Billing Sheet</Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          Fill in the details below, then select your monthly billing xlsx file.
        </Typography>

        <form id="form" noValidate onSubmit={handleSubmit} style={{ width: "100%" }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="nextInvoiceNumber"
            label="First Invoice Number"
            name="nextInvoiceNumber"
            type="number"
            autoFocus
            onChange={e => setNextInvoiceNumber(e.target.value)}
            value={nextInvoiceNumber}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Invoice Date"
              format="YYYY/MM/DD"
              value={selectedDate}
              onChange={handleDateChange}
              showDaysOutsideCurrentMonth
              slotProps={{ textField: { fullWidth: true } }}
            />
          </LocalizationProvider>

          <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", columnGap: theme => theme.spacing(2), mt: 2 }}>
            <input
              accept=".xlsx"
              type="file"
              id="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              hidden
            />
            <Button variant="contained" color="primary" component="button" onClick={() => fileInputRef.current?.click()}>
              Select File
            </Button>
            <Typography variant="body2" color="textSecondary">
              {selectedFileName || "No file selected"}
            </Typography>
          </Box>

          {parsingHeaders && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2" color="textSecondary">Reading file headers…</Typography>
              <LinearProgress variant="indeterminate" value={progress} />
            </Box>
          )}

          {showMapping && headers.length > 0 && (
            <Paper variant="outlined" sx={{ mt: 3, p: 2, width: "100%" }}>
              <Typography variant="h6" gutterBottom>Verify Column Mapping</Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                Review the auto-detected column mapping. Adjust any that are incorrect before converting.
              </Typography>
              <Stack divider={<Divider flexItem />} spacing={2}>
                {EXPECTED_FIELDS.map(({ key, label }) => (
                  <Box key={key}>
                    <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
                      {label}
                    </Typography>
                    <FormControl size="small" fullWidth required>
                      <Select
                        displayEmpty
                        value={columnMapping[key] ?? ""}
                        onChange={e => handleMappingChange(key, Number(e.target.value))}
                      >
                        <MenuItem value="" disabled>Select a column</MenuItem>
                        {headers.map((h, i) => (
                          <MenuItem key={i} value={i}>
                            {h || `(Column ${i + 1})`}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                ))}
              </Stack>
            </Paper>
          )}

          {errorMessage && (
            <Alert severity="error" sx={{ mt: 2 }}>{errorMessage}</Alert>
          )}

          <LoadingButton
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ margin: theme => theme.spacing(2, 0, 0) }}
            disabled={loading || !showMapping || !isMappingComplete()}
            loadingPosition="center"
            loading={loading}
          >
            Convert
          </LoadingButton>
          <Button
            fullWidth
            variant="outlined"
            color="primary"
            sx={{ margin: theme => theme.spacing(1, 0, 2) }}
            onClick={resetForm}
          >
            Reset
          </Button>
        </form>

        {file && (
          <Paper variant="elevation" elevation={5} sx={{ width: "100%", padding: theme => theme.spacing(2) }}>
            <Alert severity="success">File created successfully</Alert>
            <Box sx={{ mt: 1 }}>
              <Typography variant="h6" gutterBottom>File Details</Typography>
              <Typography variant="subtitle1" gutterBottom noWrap>
                <span>File Name: </span>{file.name}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <span>File Size: </span>{file.size} bytes
              </Typography>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "bold" }}>
                URL: <Link href={file.url} download>{file.name}</Link>
              </Typography>
            </Box>
          </Paper>
        )}
      </Box>
    </Container>
  );
}

interface ConvertedFile {
  name: string;
  type: string;
  size: number;
  url: string;
}
