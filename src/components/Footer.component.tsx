import {
  Box,
  Link,
  Typography,
} from "@mui/material";

const Footer = () => {
  return (
    <Box mt={18}>
      <footer className="footer">
        <Typography variant="body2" color="textSecondary" align="center">
          {"Copyright © "}
          <Link color="inherit" href="https://nraccounting.ca" target="_blank">
            NR Accounting & Business Advisors Inc.
          </Link>{" "}
          {new Date().getFullYear()}
          {"."}
        </Typography>
      </footer>
    </Box>
  );
}

export default Footer;