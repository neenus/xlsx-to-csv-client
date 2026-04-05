import { useState, useEffect, useCallback, FormEvent } from "react";
import { Add as AddIcon } from "@mui/icons-material";
import { Typography, Box, Container, Stack, Button } from "@mui/material";
import useTitle from "../../hooks/useTitle";
import { getServices, addService, updateService } from "../../api/apiService";
import { Service } from "../../types";
import ServicesTable from "../../components/ServicesTable.component";
import ServiceDialog from "../../components/ServiceDialog.component";

const ServicesPage = () => {
  useTitle("XLSX to CSV | Services");
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const handleGetServices = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const response = await getServices();
      setServices(response.data);
    } catch (error: any) {
      setIsError(true);
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDialogOpenClose = () => setIsDialogOpen(prev => !prev);

  const handleAddService = useCallback(async (e: FormEvent<HTMLFormElement>, service: Service) => {
    e.preventDefault();
    try {
      const response = await addService({
        service_name: service.service_name,
        service_education_level: service.service_education_level,
        service_rate: service.service_rate,
        aliases: service.aliases
      });
      setServices(prev => [...prev, response.data]);
      handleDialogOpenClose();
    } catch (error: any) {
      setIsError(true);
      setErrorMessage(error.message);
    }
  }, []);

  const handleUpdateService = useCallback(async (service: Service) => {
    try {
      const response = await updateService(service);
      if (response.success) {
        setServices(prev =>
          prev.map(s => (s._id === service._id ? response.data : s))
        );
      }
    } catch (error: any) {
      setIsError(true);
      setErrorMessage(error.message);
    }
  }, []);

  useEffect(() => {
    handleGetServices();
  }, [handleGetServices]);

  return (
    <>
      <ServiceDialog
        isDialogOpen={isDialogOpen}
        handleDialogOpenClose={handleDialogOpenClose}
        handleSubmit={handleAddService}
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
              Services
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleDialogOpenClose}
            >
              New
            </Button>
          </Stack>
        </Container>

        <ServicesTable
          services={services}
          isLoading={isLoading}
          isError={isError}
          errorMessage={errorMessage}
          updateService={handleUpdateService}
        />
      </Box>
    </>
  );
};

export default ServicesPage;

