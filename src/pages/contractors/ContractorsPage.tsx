import { useState, useEffect, useCallback, FormEvent } from "react";
import axios from "axios";

import { Add as AddIcon } from "@mui/icons-material";
import { Typography, Box, Container, Stack, Button } from "@mui/material";
import ContractorsTable from "../../components/ContractorsTable.component";
import ContractorDialog from "../../components/ContractorDialog.component";
import { Contractor } from "../../types";
import useTitle from "../../hooks/useTitle";

const ContractorsPage = () => {
  useTitle("XLSX to CSV | Contractors");
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const apiUrl: string =
    import.meta.env.MODE !== "production"
      ? import.meta.env.VITE_API_BASE_URL
      : import.meta.env.VITE_API_BASE_URL_PROD;

  const getContractors = useCallback(async () => {

    try {
      const response = await axios.get(
        `${apiUrl}/api/v1/contractors`
      );
      setContractors(response.data.data);
    } catch (error: any) {
      setIsError(true);
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDialogOpenClose = () => setIsDialogOpen(prev => !prev);

  const handleAddContractor = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const name = formData.get("name");
    const email = formData.get("email");
    const phone = formData.get("phone");
    const address = formData.get("address");
    const city = formData.get("city");
    const state = formData.get("state");
    const zip = formData.get("zip");

    const newContractor = {
      name,
      email,
      phone,
      address,
      city,
      state,
      zip
    };

    try {
      const response = await axios.post(
        `${apiUrl}/api/v1/contractors`,
        newContractor
      );
      setContractors(prev => [...prev, response.data.data]);
      handleDialogOpenClose();
    } catch (error: any) {
      setIsError(true);
      setErrorMessage(error.message);
    }
  };

  const deleteContractor = useCallback(async (id: string) => {
    try {
      await axios.delete(
        `${apiUrl}/api/v1/contractors/${id}`
      );
      setContractors(prev => prev.filter(contractor => contractor._id !== id));
    } catch (error: any) {
      setIsError(true);
      setErrorMessage(error.message);
    }
  }, []);

  const updateContractors = useCallback(async (contractor: Contractor) => {
    try {
      const response = await axios.patch(
        `${apiUrl}/api/v1/contractors/${contractor._id}`,
        contractor
      );

      if (response.status === 200) {
        setContractors(prev => {
          return prev.map(prevContractor => {
            if (prevContractor._id === contractor._id) {
              return contractor;
            }
            return prevContractor;
          });
        });
      }
    } catch (error: any) {
      setIsError(true);
      setErrorMessage(error.message);
    }
  }, []);

  useEffect(() => {
    getContractors();
  }, []);

  return (
    <>
      <ContractorDialog
        isDialogOpen={isDialogOpen}
        handleDialogOpenClose={() => handleDialogOpenClose()}
        handleSubmit={handleAddContractor}
      />
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
        <Container maxWidth="xl" disableGutters>
          <Stack
            direction="row"
            alignItems="start"
            justifyContent="space-between"
            mb={5}
          >
            <Typography variant="h5" gutterBottom>
              Contractors
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleDialogOpenClose()}
            >
              New
            </Button>
          </Stack>
        </Container>

        <ContractorsTable
          contractors={contractors}
          isLoading={isLoading}
          isError={isError}
          errorMessage={errorMessage}
          deleteContractor={deleteContractor}
          updateContractors={updateContractors}
        />
      </Box>
    </>
  );
};

export default ContractorsPage;
