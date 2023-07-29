import { useState, useEffect, useCallback } from "react";
import axios from "axios";

import { Add as AddIcon } from "@mui/icons-material";
import { Container, Typography, Box, Fab } from "@mui/material";
import ContractorsTable from "../../components/ContractorsTable.component";

const ContractorsPage = () => {
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const getContractors = useCallback(async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/contractors`
      );
      setContractors(response.data.data);
    } catch (error: any) {
      setIsError(true);
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getContractors();
  }, []);

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          p: 2,
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "start",
          flexDirection: "column",
          rowGap: theme => theme.spacing(3)
        }}
      >
        <Typography variant="h4" gutterBottom>
          Contractors
        </Typography>

        <ContractorsTable
          contractors={contractors}
          isLoading={isLoading}
          isError={isError}
          errorMessage={errorMessage}
        />

        <Fab
          size="large"
          color="primary"
          aria-label="add"
          sx={{
            px: 3,
            textTransform: "capitalize",
            fontSize: "0.9rem",
            fontHeight: "1.3rem",
            position: "fixed",
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

export default ContractorsPage;

interface Contractor {
  _id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
}
