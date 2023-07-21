import { Container, Link, Typography } from "@mui/material";
import useTitle from "../../hooks/useTitle";

const AboutPage = () => {
  useTitle("About Excel to CSV Converter");
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h4" gutterBottom>
        <Link href="/" color="inherit">
          XLSX to CSV App
        </Link>
      </Typography>
      <Typography variant="body1" gutterBottom>
        Build {process.env.REACT_APP_VERSION}
      </Typography>
    </Container>
  )
};

export default AboutPage;
