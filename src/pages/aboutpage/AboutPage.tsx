import { Container, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import useTitle from "../../hooks/useTitle";

const AboutPage = () => {
  useTitle("About Excel to CSV Converter");
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
      <Typography variant="body1" gutterBottom>
        Build {import.meta.env.VITE_VERSION}
      </Typography>
    </Container>
  );
};

export default AboutPage;
