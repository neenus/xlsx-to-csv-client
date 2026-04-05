import { useState, useEffect, useCallback, FormEvent } from "react";
import { getContractors, addContractor, updateContractor, deleteContractor } from "../../api/apiService";
import { Add as AddIcon } from "@mui/icons-material";
import { Typography, Box, Container, Stack, Button } from "@mui/material";
import ContractorsTable from "../../components/ContractorsTable.component";
import ContractorDialog from "../../components/ContractorDialog.component";
import ConfirmationDialog from "../../components/ConfirmationDialog.component";
import { Contractor } from "../../types";
import useTitle from "../../hooks/useTitle";

const ContractorsPage = () => {
  useTitle("XLSX to CSV | Contractors");
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedContractor, setSelectedContractor] = useState<Contractor | undefined>(undefined);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [contractorToDeleteId, setContractorToDeleteId] = useState<string>("");

  const handleGetContractors = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getContractors();
      setContractors(response.data);
    } catch (error: any) {
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { handleGetContractors(); }, []);

  const handleAddContractor = useCallback(async (e: FormEvent<HTMLFormElement>, contractor: Contractor) => {
    e.preventDefault();
    try {
      const response = await addContractor(contractor);
      setContractors(prev => [...prev, response.data]);
      setIsDialogOpen(false);
    } catch (error: any) {
      console.error(error.message);
    }
  }, []);

  const handleUpdateContractor = useCallback(async (e: FormEvent<HTMLFormElement>, contractor: Contractor) => {
    e.preventDefault();
    try {
      const response = await updateContractor(contractor);
      if (response.success) {
        setContractors(prev =>
          prev.map(c => (c._id === contractor._id ? contractor : c))
        );
        setIsDialogOpen(false);
        setSelectedContractor(undefined);
      }
    } catch (error: any) {
      console.error(error.message);
    }
  }, []);

  const handleDeleteContractor = useCallback(async () => {
    try {
      const response = await deleteContractor(contractorToDeleteId);
      if (response.success) {
        setContractors(prev => prev.filter(c => c._id !== contractorToDeleteId));
      }
    } catch (error: any) {
      console.error(error.message);
    } finally {
      setDeleteDialogOpen(false);
      setContractorToDeleteId("");
    }
  }, [contractorToDeleteId]);

  const handleEditClick = (contractor: Contractor) => {
    setSelectedContractor(contractor);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setContractorToDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedContractor(undefined);
  };

  return (
    <>
      <ContractorDialog
        isDialogOpen={isDialogOpen}
        handleDialogOpenClose={handleDialogClose}
        handleSubmit={selectedContractor ? handleUpdateContractor : handleAddContractor}
        contractor={selectedContractor}
      />
      <ConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteContractor}
        title="Delete Contractor"
        content="Are you sure you want to delete this contractor?"
      />
      <Box sx={{ p: 2, mb: 2 }}>
        <Container maxWidth="xl" disableGutters>
          <Stack direction="row" alignItems="start" justifyContent="space-between" mb={5}>
            <Typography variant="h5" gutterBottom>Contractors</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => { setSelectedContractor(undefined); setIsDialogOpen(true); }}
            >
              New
            </Button>
          </Stack>
        </Container>
        <ContractorsTable
          contractors={contractors}
          isLoading={isLoading}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
      </Box>
    </>
  );
};

export default ContractorsPage;
