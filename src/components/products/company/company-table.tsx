"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Box,
  IconButton,
  DialogContent,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  TableContainer,
  Table,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import { Edit, Delete } from "@mui/icons-material";
import { CompanyType } from "@/types/products";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import BootstrapDialog, { BootstrapDialogTitle } from "@/components/ui/bootstrap-dialog";
import OutlinedInputField from "@/components/ui/out-lined-input-field";
import { FaCheckCircle } from "react-icons/fa";
import Grid from "@mui/material/Grid";
import SaveButton from "@/components/ui/save-button";
import { useRouter } from "next/navigation";
import { useDeleteCompany, useUpdateCompanyInfo } from "@/data/products/use-company.query";
import DeleteAction from "@/components/ui/delete-action";
import { toast } from "react-toastify";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#528ec9",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: "14px",
    border: "1px solid #d1d6da",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
}));

interface IProps {
  data: CompanyType[];
}

const CompanyTable: React.FC<IProps> = ({ data }) => {
  const [open, setOpen] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<CompanyType | null>(null);
  const { mutate: updateCompany, isPending: loading } = useUpdateCompanyInfo();
  const { mutate: deleteCompany } = useDeleteCompany();
  const router = useRouter();

  const schema = Yup.object({
    name: Yup.string().required("Company Name is required"),
    address: Yup.string().required("Company Address is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleEditClick = (company: CompanyType) => {
    setSelectedCompany(company);
    reset({ name: company.name, address: company.address });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedCompany(null);
  };

  const onSubmit = (data: any) => {
    if (!selectedCompany) return;
    const updatedCompany = { id: selectedCompany.id, ...data };
    updateCompany(updatedCompany, {
      onSuccess: () => {
        router.refresh();
        setOpen(false);
      },
      onError: () => {
        toast.error(`Unable to updating company`); 
      },
    });
  };

  const handleDelete = (company: CompanyType) => {
    setSelectedCompany(company);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedCompany) return;
    deleteCompany(selectedCompany.id, {
      onSuccess: () => {
        toast.success(`Company has been deleted`);
        router.refresh();
        setOpenDeleteDialog(false);
      },
      onError: () => {
        toast.error(`Unable to delete the company`);
      },
    });
  };

  return (
    <Box>
      <TableContainer>
        <Table>
          <TableHead>
            <StyledTableRow>
              <StyledTableCell align="center">
                <strong>Image</strong>
              </StyledTableCell>
              <StyledTableCell>
                <strong>Name</strong>
              </StyledTableCell>
              <StyledTableCell>
                <strong>Address</strong>
              </StyledTableCell>
              <StyledTableCell>
                <strong>Created By</strong>
              </StyledTableCell>
              <StyledTableCell>
                <strong>Status</strong>
              </StyledTableCell>
              <StyledTableCell align="center">
                <strong>Actions</strong>
              </StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {data.map((company: CompanyType) => (
              <StyledTableRow key={company.id}>
                <StyledTableCell align="center">
                  <Image
                    src={company.imageUrl || ""}
                    alt={company.name}
                    width={50}
                    height={50}
                    style={{ objectFit: "cover", borderRadius: "4px" }}
                  />
                </StyledTableCell>
                <StyledTableCell>{company.name}</StyledTableCell>
                <StyledTableCell>{company.address}</StyledTableCell>
                <StyledTableCell>{company.createdBy}</StyledTableCell>
                <StyledTableCell>{company.status}</StyledTableCell>
                <StyledTableCell align="center">
                  <IconButton size="small" onClick={() => handleEditClick(company)}>
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDelete(company)}>
                    <Delete fontSize="small" />
                  </IconButton>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <BootstrapDialog onClose={handleClose} aria-labelledby="customized-dialog-title" maxWidth="sm" open={open}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
            <div
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginRight: "50px" }}
            >
              <span style={{ display: "flex", alignItems: "center" }}>
                <FaCheckCircle color="var(--primary)" />
                &nbsp; Update Company
              </span>
            </div>
          </BootstrapDialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <OutlinedInputField
                  name="name"
                  label="Name"
                  register={register}
                  error={errors.name?.message}
                  helperText={errors.name?.message}
                />
                <OutlinedInputField
                  name="address"
                  label="Address"
                  register={register}
                  error={errors.address?.message}
                  helperText={errors.address?.message}
                />
                <SaveButton type="submit" loading={loading} variant="contained">
                  Update Company
                </SaveButton>
              </Grid>
            </Grid>
          </DialogContent>
        </form>
      </BootstrapDialog>
      <DeleteAction
        openDialog={openDeleteDialog}
        handleCancelDelete={() => setOpenDeleteDialog(false)}
        handleConfirmDelete={handleConfirmDelete}
      />
    </Box>
  );
};

export default CompanyTable;
