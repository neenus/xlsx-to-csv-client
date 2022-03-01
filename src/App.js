import React from "react";
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
  CircularProgress
} from "@material-ui/core";
import green from "@material-ui/core/colors/green";
import Alert from "@material-ui/lab/Alert";
import CssBaseline from "@material-ui/core/CssBaseline";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { makeStyles } from "@material-ui/core/styles";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider
} from "@material-ui/pickers";
import useTitle from "./useTitle";
import axios from "axios";
import "./App.css";
import SnackbarComponent from "./components/Snackbar.component";

function Copyright() {
  return (
    <footer className="footer">
      <Typography variant="body2" color="textSecondary" align="center">
        {"Copyright © "}
        <Link color="inherit" href="https://nraccounting.ca">
          NR Accounting & Business Advisors Inc.
        </Link>{" "}
        {new Date().getFullYear()}
        {"."}
      </Typography>
    </footer>
  );
}

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
  }
}));

export default function UploadForm() {
  useTitle("Excel to CSV Converter");
  const classes = useStyles();
  const [nextInvoiceNumber, setNextInvoiceNumber] = React.useState("");
  const [selectedDate, setSelectedDate] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [file, setFile] = React.useState(null);
  const fileInputRef = React.useRef("");
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [severity, setSeverity] = React.useState("success");
  const [message, setMessage] = React.useState("");

  const handleDateChange = date => {
    setSelectedDate(date);
  };

  const resetForm = () => {
    resetState();
  };

  const resetState = () => {
    setSelectedDate(null);
    setNextInvoiceNumber("");
    setProgress(0);
    setErrorMessage(false);
    setLoading(false);
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
    if (nextInvoiceNumber && selectedDate && file) {
      formData.append("nextInvoiceNumber", nextInvoiceNumber);
      formData.append("date", selectedDate);
      formData.append("file", file);

      const baseUrl = `${process.env.REACT_APP_API_BASE_URL}/convert`;

      try {
        const response = await axios.post(baseUrl, formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });
        setLoading(false);
        setSnackbarOpen(true);
        setSeverity("success");
        setMessage("File uploaded & converted successfully.");
        setFile(response.data.outputFile);
        resetForm();
      } catch (error) {
        setErrorMessage(error.message);
        setLoading(false);
        setSnackbarOpen(true);
        setSeverity("error");
        if (error.response.status === 400) {
          setMessage(`Request faild with status code ${errorMessage}.`);
        } else if (error.response.status === 500) {
          setMessage("Internal server error, please try again later.");
        } else {
          setMessage(
            "Something went wrong, please contact your administrator."
          );
        }
        console.log(error.message);
      }
    } else {
      setErrorMessage(true);
      setLoading(false);
      setSnackbarOpen(true);
      setSeverity("error");
      setMessage(
        "Bad request, please input invoice number, date and a valid file."
      );
    }
  };

  const handleClose = () => {
    setSnackbarOpen(false);
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
        <SnackbarComponent
          open={snackbarOpen}
          severity={severity}
          message={message}
          onClose={handleClose}
        />
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
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              placeholder="YYYY/MM/DD"
              margin="normal"
              inputVariant="outlined"
              fullWidth
              id="date-picker-dialog"
              label="Invoice Date"
              format="yyyy/MM/dd"
              value={selectedDate}
              onChange={handleDateChange}
              KeyboardButtonProps={{
                "aria-label": "change date"
              }}
            />
          </MuiPickersUtilsProvider>

          <input type="file" id="file" ref={fileInputRef} />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={loading}
            loading={loading}
          >
            Submit
            {loading && (
              <CircularProgress size={24} className={classes.btnProgress} />
            )}
          </Button>
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
              <Typography variant="subtitle1" gutterBottom>
                URL:{" "}
                <Link href={file.url} download>
                  {file.url}
                </Link>
              </Typography>
            </div>
          </Paper>
        )}
      </div>
      <Box mt={18}>
        <Copyright />
      </Box>
    </Container>
  );
}
