import { useState, ChangeEvent, FormEvent } from "react";
import { useHistory } from "react-router-dom";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Box,
  Typography,
  Container,
  IconButton
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import useToast from "../../hooks/useToast";
import useAuth from "../../hooks/useAuth";

const theme = createTheme();

const SignIn: React.FC = () => {
  const [fieldType, setFieldType] = useState("password");
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });
  const { handleLogin } = useAuth();
  const { notify } = useToast();
  const history = useHistory();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!credentials.email || !credentials.password) {
      notify({
        message: "Please enter email and password",
        type: "error"
      });
      return;
    }

    await handleLogin(credentials);
    history.push("/");
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={handleChange}
              value={credentials.email}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={fieldType}
              id="password"
              autoComplete="current-password"
              onChange={handleChange}
              value={credentials.password}
              InputProps={{
                endAdornment: (
                  <IconButton
                    sx={{
                      position: "absolute",
                      right: "5px",
                    }}
                    aria-label="show password"
                    onClick={() =>
                      setFieldType(
                        fieldType === "password" ? "text" : "password"
                      )
                    }
                  >
                    <RemoveRedEyeIcon color="primary" />
                  </IconButton>
                )
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default SignIn;