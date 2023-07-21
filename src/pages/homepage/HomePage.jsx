import { useState, useRef } from "react";

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
  CircularProgress,
  MenuItem,
  CssBaseline,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

import green from "@mui/material/colors/green";
import Alert from "@mui/material/Alert";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { makeStyles } from '@mui/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import useTitle from "../../hooks/useTitle";
import axios from "axios";
import useToast from "../../hooks/useToast";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%"
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
    padding: theme.spacing(2)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  },
  input: {
    display: "none"
  },
  fileInputRef: {
    width: "100%",
    border: "1px solid #ccc",
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    fontSize: theme.typography.htmlFontSize,
    fontFamily: theme.typography.fontFamily,
    marginTop: theme.spacing(2)
  },
  output: {
    width: "100%",
    padding: theme.spacing(2)
  },
  subtitleBold: {
    fontWeight: "bold"
  },
  btnProgress: {
    color: green[500],
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12
  },
  uploadBtnBox: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    columnGap: theme.spacing(2)
  },
  fabButton: {
    position: 'absolute',
    top: theme.spacing(2),
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
}));

export default function UploadForm() {
  useTitle("Excel to CSV Converter");
  const classes = useStyles();
  const [nextInvoiceNumber, setNextInvoiceNumber] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef("");
  const [uploadType, setUploadType] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");
  const { notify } = useToast();

  const handleDateChange = date => setSelectedDate(date.$d);

  const resetForm = () => resetState();

  const resetState = () => {
    setSelectedDate(null);
    setNextInvoiceNumber("");
    setProgress(0);
    setErrorMessage(null);
    setLoading(false);
    setUploadType("");
    setSelectedFileName("");
    // setFile(null);
    fileInputRef.current.value = "";
  };

  const handleSubmit = async event => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setFile(null);
    const formData = new FormData();
    let file = fileInputRef.current.files[0];
    if (nextInvoiceNumber && selectedDate && file && uploadType) {
      formData.append("nextInvoiceNumber", nextInvoiceNumber);
      formData.append("date", selectedDate);
      formData.append("file", file);
      formData.append("type", uploadType);

      const baseUrl = `${process.env.REACT_APP_API_BASE_URL}/convert`;

      try {
        const response = await axios.post(baseUrl, formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });
        setLoading(false);
        notify({ message: "File uploaded & converted successfully.", type: "success" });
        setFile(response.data.outputFile);
        resetForm();
      } catch (error) {
        setErrorMessage(error.response.data.msg);
        setLoading(false);
        if (error.response.status === 400) {
          notify({ message: errorMessage, type: "error" });
        } else if (error.response.status === 500) {
          notify({ message: error.response.data.msg || "Internal server error, please try again later.", type: "error" });
        } else {
          notify({ message: "Something went wrong, please contact your administrator.", type: "error" });
        }
        console.log(error.message);
      }
    } else {
      setLoading(false);
      notify({ message: "Bad request, please input invoice number, date, a valid file and type of file.", type: "error" });
    }
  };


  return (
    <Container component="main" maxWidth="sm">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <CloudUploadIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Upload Excel File
        </Typography>
        <form
          id="form"
          className={classes.form}
          noValidate
          onSubmit={handleSubmit}
        >
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
              id="date-picker-dialog"
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
            onChange={e => setUploadType(e.target.value)}
            value={uploadType}
          >
            <MenuItem value="proposed">Proposed sheet</MenuItem>
            <MenuItem value="final">Final sheet</MenuItem>
          </TextField>


          <Box className={classes.uploadBtnBox} >
            <input accept=".xlsx" type="file" id="file" ref={fileInputRef} className={classes.input} onChange={e => setSelectedFileName(e.target.files[0].name)} />
            <label htmlFor="file">
              <Button variant="contained" color="primary" component="span">
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
            className={classes.submit}
            disabled={loading}
            loading={loading ? loading : undefined}
          >
            Submit
            {loading && (
              <CircularProgress size={24} className={classes.btnProgress} />
            )}
          </LoadingButton>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={resetForm}
          >
            Reset
          </Button>
        </form>
        <div className={classes.root}>
          {loading && (
            <LinearProgress variant="indeterminate" value={progress} />
          )}
        </div>
        {/* {error && (
          <Paper className={classes.output} variant="elevation" elevation={5}>
            <Alert severity="error">{error}</Alert>
          </Paper>
        )} */}
        {file && (
          <Paper variant="elevation" elevation={5} className={classes.output}>
            <Alert severity="success">File created successfuly</Alert>
            <div>
              <Typography variant="h6" gutterBottom>
                File Details
              </Typography>
              <Typography variant="subtitle1" gutterBottom noWrap>
                <span className={classes.subtitleBold}>File Name: </span>{" "}
                {file.name}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <span className={classes.subtitleBold}>File Type: </span>{" "}
                {file.type}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <span className={classes.subtitleBold}>File Size: </span>{" "}
                {file.size} bytes
              </Typography>
              <Typography variant="subtitle1" gutterBottom className={classes.subtitleBold}>
                URL:{" "}
                <Link href={file.url} download>
                  {file.name}
                </Link>
              </Typography>
            </div>
          </Paper>
        )}
      </div>
    </Container>
  );
}
