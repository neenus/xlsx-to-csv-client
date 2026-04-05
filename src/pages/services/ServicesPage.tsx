import { useState, useEffect, useCallback, FormEvent } from "react";
import { Add as AddIcon } from "@mui/icons-material";
import { Typography, Box, Container, Stack, Button } from "@mui/material";
import useTitle from "../../hooks/useTitle";
import { getServices, addService, updateService, deleteService } from "../../api/apiService";
import { Service } from "../../types";
import ServicesTable from "../../components/ServicesTable.component";
import ServiceDialog from "../../components/ServiceDialog.component";
import ConfirmationDialog from "../../components/ConfirmationDialog.component";

const ServicesPage = () => {
  useTitle("XLSX to CSV | Services");
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedService, setSelectedService] = useState<Service | undefined>(undefined);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [serviceToDeleteId, setServiceToDeleteId] = useState<string>("");

  const handleGetServices = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getServices();
      setServices(response.data);
    } catch (error: any) {
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { handleGetServices(); }, [handleGetServices]);

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
      setIsDialogOpen(false);
    } catch (error: any) {
      console.error(error.message);
    }
  }, []);

  const handleUpdateService = useCallback(async (e: FormEvent<HTMLFormElement>, service: Service) => {
    e.preventDefault();
    try {
      const response = await updateService(service);
      if (response.success) {
        setServices(prev => prev.map(s => (s._id === service._id ? response.data : s)));
        setIsDialogOpen(false);
        setSelectedService(undefined);
      }
    } catch (error: any) {
      console.error(error.message);
    }
  }, []);

  const handleDeleteService = useCallback(async () => {
    try {
      await deleteService(serviceToDeleteId);
      setServices(prev => prev.filter(s => s._id !== serviceToDeleteId));
    } catch (error: any) {
      console.error(error.message);
    } finally {
      setDeleteDialogOpen(false);
      setServiceToDeleteId("");
    }
  }, [serviceToDeleteId]);

  const handleEditClick = (service: Service) => {
    setSelectedService(service);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setServiceToDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedService(undefined);
  };

  return (
    <>
      <ServiceDialog
        isDialogOpen={isDialogOpen}
        handleDialogOpenClose={handleDialogClose}
        handleSubmit={selectedService ? handleUpdateService : handleAddService}
        service={selectedService}
      />
      <ConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteService}
        title="Delete Service"
        content="Are you sure you want to delete this service? Any aliases associated with it will also be removed."
      />
      <Box sx={{ p: 2, mb: 2 }}>
        <Container maxWidth="xl" disableGutters>
          <Stack direction="row" alignItems="start" justifyContent="space-between" mb={5}>
            <Typography variant="h5" gutterBottom>Services</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => { setSelectedService(undefined); setIsDialogOpen(true); }}
            >
              New
            </Button>
          </Stack>
        </Container>
        <ServicesTable
          services={services}
          isLoading={isLoading}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
      </Box>
    </>
  );
};

export default ServicesPage;
