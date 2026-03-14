import { useState, useEffect, useCallback, FormEvent } from "react";
import { getContractors, addContractor, updateContractor, deleteContractor } from "../../api/apiService";

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

  const handleGetContractors = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getContractors();
      setContractors(response.data);
    } catch (error: any) {
      setIsError(true);
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDialogOpenClose = () => setIsDialogOpen(prev => !prev);

  const handleAddContractor = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const contractor_name = formData.get("contractor_name") as string;
    const contractor_email = formData.get("contractor_email") as string;
    const contractor_phone = formData.get("contractor_phone") as string;
    const contractor_address = formData.get("contractor_address") as string;
    const contractor_city = formData.get("contractor_city") as string;
    const contractor_state = formData.get("contractor_state") as string;
    const contractor_zip = formData.get("contractor_zip") as string;

    const newContractor = {
      contractor_name,
      contractor_email,
      contractor_phone,
      contractor_address,
      contractor_city,
      contractor_state,
      contractor_zip
    };

    try {
      const response = await addContractor(newContractor);
      setContractors(prev => [...prev, response.data]);
      handleDialogOpenClose();
    } catch (error: any) {
      setIsError(true);
      setErrorMessage(error.message);
    }
  }, []);

  const handledeleteContractor = useCallback(async (id: string) => {
    try {
      const response = await deleteContractor(id);
      if (response.success)
        setContractors(prev => prev.filter(contractor => contractor._id !== id));
    } catch (error: any) {
      setIsError(true);
      setErrorMessage(error.message);
    }
  }, []);

  const handleupdateContractors = useCallback(async (contractor: Contractor) => {
    try {
      const response = await updateContractor(contractor);

      if (response.success) {
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
    handleGetContractors();
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
          deleteContractor={handledeleteContractor}
          updateContractors={handleupdateContractors}
        />
      </Box>
    </>
  );
};

export default ContractorsPage;
