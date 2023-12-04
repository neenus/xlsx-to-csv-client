import { useState, useRef } from "react";
import "./homepage.styles.css";

import {
  Avatar,
  Button,
  TextField,
  Link,
  Box,
  Typography,
  Container,
  LinearProgress,
  Paper,
  MenuItem,
  CssBaseline
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

import Alert from "@mui/material/Alert";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import useTitle from "../../hooks/useTitle";
import useToast from "../../hooks/useToast";
import axios from "axios";

export default function UploadForm() {
  useTitle("Excel to CSV Converter");
  const [nextInvoiceNumber, setNextInvoiceNumber] = useState("");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadType, setUploadType] = useState<string>("");
  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const { notify } = useToast();

  const handleDateChange = (date: any) => setSelectedDate(date.$d);

  const resetForm = () => {
    setSelectedDate(null);
    setNextInvoiceNumber("");
    setProgress(0);
    setErrorMessage("");
    setLoading(false);
    setUploadType("");
    setSelectedFileName("");
    fileInputRef.current?.value && (fileInputRef.current.value = "");
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setFile(null);
    const formData = new FormData();
    let file = fileInputRef.current?.files
      ? fileInputRef.current.files[0]
      : null;
    if (nextInvoiceNumber && selectedDate && file && uploadType) {
      formData.append("nextInvoiceNumber", nextInvoiceNumber);
      formData.append("date", selectedDate);
      formData.append("file", file);
      formData.append("type", uploadType);

      const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/convert`;

      try {
        const response = await axios.post(baseUrl, formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });
        setLoading(false);
        notify({
          message: "File uploaded & converted successfully.",
          type: "success"
        });
        setFile(response.data.outputFile);
        resetForm();
      } catch (error: error | any) {
        setErrorMessage(error?.response?.data?.msg);
        setLoading(false);
        if (error?.response?.status === 400) {
          notify({ message: errorMessage, type: "error" });
        } else if (error?.response?.status === 500) {
          notify({
            message:
              error.response.data.msg ||
              "Internal server error, please try again later.",
            type: "error"
          });
        } else {
          notify({
            message: "Something went wrong, please contact your administrator.",
            type: "error"
          });
        }
        console.log(error.message);
      }
    } else {
      setLoading(false);
      notify({
        message:
          "Bad request, please input invoice number, date, a valid file and type of file.",
        type: "error"
      });
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        <Avatar
          sx={{
            margin: 1,
            backgroundColor: theme => theme.palette.secondary.main
          }}
        >
          <CloudUploadIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Upload Excel File
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          Please fill out the form below to upload your excel file.
        </Typography>

        <form id="form" noValidate onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="nextInvoiceNumber"
            label="Last Invoice Number from QBO"
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

          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="upload-type"
            label="Upload Type"
            name="upload-type"
            select
            type="text"
            onChange={e => setUploadType(e.target.value)}
            value={uploadType}
          >
            <MenuItem value="proposed">Proposed sheet</MenuItem>
            <MenuItem value="final">Final sheet</MenuItem>
          </TextField>

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              columnGap: theme => theme.spacing(2)
            }}
          >
            <input
              accept=".xlsx"
              type="file"
              id="file"
              ref={fileInputRef}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                e.target?.files?.length &&
                setSelectedFileName(e.target?.files[0].name)
              }
              hidden
            />
            <label htmlFor="file">
              <Button
                variant="contained"
                color="primary"
                component="button"
                onClick={() => fileInputRef.current?.click()}
              >
                Select File
              </Button>
            </label>

            <Typography variant="body2" color="textSecondary" component="p">
              {selectedFileName ? selectedFileName : "No file selected"}
            </Typography>
          </Box>

          <LoadingButton
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ margin: theme => theme.spacing(2, 0, 0) }}
            disabled={loading}
            loadingPosition="center"
            loading={loading ? loading : false}
          >
            Submit
          </LoadingButton>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{ margin: theme => theme.spacing(2, 0, 2) }}
            onClick={resetForm}
          >
            Reset
          </Button>
        </form>
        <div>
          {loading && (
            <LinearProgress variant="indeterminate" value={progress} />
          )}
        </div>
        {file && (
          <Paper
            variant="elevation"
            elevation={5}
            sx={{
              width: "100%",
              padding: theme => theme.spacing(2)
            }}
          >
            <Alert severity="success">File created successfuly</Alert>
            <div>
              <Typography variant="h6" gutterBottom>
                File Details
              </Typography>
              <Typography variant="subtitle1" gutterBottom noWrap>
                <span>File Name: </span> {file.name}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <span>File Type: </span> {file.type}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <span>File Size: </span> {file.size} bytes
              </Typography>
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{
                  fontWeight: "bold"
                }}
              >
                URL:{" "}
                <Link href={file.url} download>
                  {file.name}
                </Link>
              </Typography>
            </div>
          </Paper>
        )}
      </Box>
    </Container>
  );
}

interface File {
  name: string;
  type: string;
  size: number;
  url: string;
}

interface error {
  response: {
    data: {
      msg: string;
    };
    status: number;
  };
}
