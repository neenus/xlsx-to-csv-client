import { Add as AddIcon } from "@mui/icons-material";
import { Container, Typography, Box, Fab } from "@mui/material";

const ServicesPage = () => {
  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          p: 2,
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <Typography variant="h4" gutterBottom>
          Services
        </Typography>
        <Fab
          size="large"
          color="primary"
          aria-label="add"
          sx={{
            px: 3,
            textTransform: "capitalize",
            fontSize: "0.9rem",
            fontHeight: "1.3rem",
            position: "absolute",
            bottom: theme => theme.spacing(12),
            right: theme => theme.spacing(5)
          }}
          onClick={() => console.log("Add Contractor")}
        >
          <AddIcon />
        </Fab>
      </Box>
    </Container>
  );
};

export default ServicesPage;
