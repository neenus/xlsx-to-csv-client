import { Container, Typography, Box, Divider } from "@mui/material";
import { Link } from "react-router-dom";
import useTitle from "../../hooks/useTitle";
import { useState, useEffect } from "react";
import axios from "axios";

const AboutPage = () => {
  const [serverVersion, setServerVersion] = useState<string>("");
  useTitle("About Excel to CSV Converter");

  useEffect(() => {
    const getServerVersion = async () => {
      const apiUrl: string =
        import.meta.env.MODE !== "production"
          ? import.meta.env.VITE_API_BASE_URL
          : import.meta.env.VITE_API_BASE_URL_PROD;
      try {
        const response = await axios.get(`${apiUrl}/api/v1/version`);
        const serverVersion = response.data.version;
        setServerVersion(serverVersion);
      } catch (error: any) {
        console.error(error.message);
      }
    };

    getServerVersion();
  }, []);

  return (
    <Container maxWidth="lg">
      <Typography
        variant="h6"
        component={Link}
        to="/"
        gutterBottom
        sx={{
          textDecoration: "none",
          color: "inherit",
          "&:hover": {
            color: "primary.main"
          }
        }}
      >
        XLSX to CSV App
      </Typography>

      <Divider sx={{ marginBottom: 4, marginTop: 2 }} />

      <Box>
        <Typography variant="body1" gutterBottom>
          Client version: {import.meta.env.VITE_VERSION}
        </Typography>
        <Typography variant="body1" gutterBottom>
          Server version: {serverVersion}
        </Typography>
      </Box>
    </Container>
  );
};

export default AboutPage;
