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
import DeleteIcon from "@mui/icons-material/Delete";
import { ProductType } from "@/types/products";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import BootstrapDialog, {
  BootstrapDialogTitle,
} from "@/components/ui/bootstrap-dialog";
import OutlinedInputField from "@/components/ui/out-lined-input-field";
import { FaCheckCircle } from "react-icons/fa";
import Grid from "@mui/material/Grid";
import SaveButton from "@/components/ui/save-button";
import { useRouter } from "next/navigation";
import DeleteAction from "@/components/ui/delete-action";
import { toast } from "react-toastify";
import {
  useDeleteProduct,
  useUpdateProductInfo,
} from "@/data/products/use-product.query";
import { BiEditAlt } from "react-icons/bi";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#528ec9",
    color: theme.palette.common.white,
    padding: "10px",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: "14px",
    border: "1px solid #d1d6da",
    padding: "0px 10px",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
}));
interface IProps {
  data: ProductType[];
}

const ProductTable: React.FC<IProps> = ({ data }) => {
  const [open, setOpen] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(
    null
  );
  const { mutate: updateProduct, isPending: loading } = useUpdateProductInfo();
  const { mutate: deleteProduct } = useDeleteProduct();
  const router = useRouter();

  const schema = Yup.object({
    name: Yup.string().required("Product Name is required"),
    price: Yup.number().required("Price is required"),
    stockQuantity: Yup.number().required("Stock Quantity is required"),
    categoryId: Yup.number().required("Category is required"),
    companyId: Yup.number().required("Company is required"),
    sku: Yup.string().required("SKU is required"),
    weight: Yup.number().required("Weight is required"),
    dimensions: Yup.string().required("Dimensions are required"),
    status: Yup.string().required("Status is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleEditClick = (product: ProductType) => {
    setSelectedProduct(product);
    reset({
      name: product.name,
      price: product.price,
      stockQuantity: product.stockQuantity,
      categoryId: product.categoryId,
      companyId: product.companyId,
      sku: product.sku,
      weight: product.weight,
      dimensions: product.dimensions,
      status: product.status,
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProduct(null);
  };

  const onSubmit = (data: any) => {
    if (!selectedProduct) return;
    const updatedProduct = { id: selectedProduct.id, ...data };
    updateProduct(updatedProduct, {
      onSuccess: () => {
        router.refresh();
        setOpen(false);
      },
      onError: () => {
        toast.error("Error updating product");
      },
    });
  };

  const handleDelete = (product: ProductType) => {
    setSelectedProduct(product);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedProduct) return;
    deleteProduct(selectedProduct.id, {
      onSuccess: () => {
        toast.success(`Product has been deleted`);
        router.refresh();
        setOpenDeleteDialog(false);
      },
      onError: () => {
        toast.error(`Unable to delete the product`);
      },
    });
  };

  return (
    <Box>
      <TableContainer>
        <Table>
          <TableHead>
            <StyledTableRow>
              <StyledTableCell>Image</StyledTableCell>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell>Price</StyledTableCell>
              <StyledTableCell>Stock</StyledTableCell>
              <StyledTableCell>Category</StyledTableCell>
              <StyledTableCell>Company</StyledTableCell>
              <StyledTableCell>Category</StyledTableCell>
              <StyledTableCell>SKU</StyledTableCell>
              <StyledTableCell>Weight</StyledTableCell>
              <StyledTableCell>Dimensions</StyledTableCell>
              <StyledTableCell>Created By</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell>Actions</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {data.map((item: ProductType) => (
              <StyledTableRow key={item.id}>
                <StyledTableCell>
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    width={40}
                    height={40}
                  />
                </StyledTableCell>
                <StyledTableCell>{item.name}</StyledTableCell>
                <StyledTableCell>{item.price}</StyledTableCell>
                <StyledTableCell>{item.stockQuantity}</StyledTableCell>
                <StyledTableCell>{item.categoryId}</StyledTableCell>
                <StyledTableCell>{item.companyId}</StyledTableCell>
                <StyledTableCell>{item.category?.categoryName}</StyledTableCell>
                <StyledTableCell>{item.sku}</StyledTableCell>
                <StyledTableCell>{item.weight}</StyledTableCell>
                <StyledTableCell>{item.dimensions}</StyledTableCell>
                <StyledTableCell>{item.createdBy}</StyledTableCell>
                <StyledTableCell align="center" sx={{ textTransform: "capitalize" }}>
                  {item.status === "active" ? (
                    <span
                      style={{
                        background: "#d4edda",
                        color: "#155724",
                        padding: "5px 10px",
                        borderRadius: "5px",
                      }}
                    >
                      {item.status}
                    </span>
                  ) : (
                    <span
                      style={{
                        background: "#f8d7da",
                        color: "#721c24",
                        padding: "5px 10px",
                        borderRadius: "5px",
                      }}
                    >
                      {item.status}
                    </span>
                  )}
                </StyledTableCell>
                <StyledTableCell>
                  <IconButton
                    sx={{
                      borderRadius: "5px",
                      background: "#edefec",
                      width: "32px",
                      height: "32px", 
                    }}
                    onClick={() => handleEditClick(item)}
                  >
                    <BiEditAlt size={15} />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(item)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        maxWidth="md"
        open={open}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <BootstrapDialogTitle
            id="customized-dialog-title"
            onClose={handleClose}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginRight: "50px",
              }}
            >
              <span style={{ display: "flex", alignItems: "center" }}>
                <FaCheckCircle color="var(--primary)" />
                &nbsp; Update Product
              </span>
            </div>
          </BootstrapDialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <OutlinedInputField
                  name="name"
                  label="Product Name"
                  register={register}
                  error={errors.name?.message}
                  helperText={errors.name?.message}
                />
                <OutlinedInputField
                  name="price"
                  label="Price"
                  type="number"
                  register={register}
                  error={errors.price?.message}
                  helperText={errors.price?.message}
                />
                <OutlinedInputField
                  name="stockQuantity"
                  label="Stock Quantity"
                  type="number"
                  register={register}
                  error={errors.stockQuantity?.message}
                  helperText={errors.stockQuantity?.message}
                />
                <OutlinedInputField
                  name="categoryId"
                  label="Category ID"
                  register={register}
                  error={errors.categoryId?.message}
                  helperText={errors.categoryId?.message}
                />
                <OutlinedInputField
                  name="companyId"
                  label="Company ID"
                  register={register}
                  error={errors.companyId?.message}
                  helperText={errors.companyId?.message}
                />
                <OutlinedInputField
                  name="sku"
                  label="SKU"
                  register={register}
                  error={errors.sku?.message}
                  helperText={errors.sku?.message}
                />
                <OutlinedInputField
                  name="weight"
                  label="Weight"
                  type="number"
                  register={register}
                  error={errors.weight?.message}
                  helperText={errors.weight?.message}
                />
                <OutlinedInputField
                  name="dimensions"
                  label="Dimensions"
                  register={register}
                  error={errors.dimensions?.message}
                  helperText={errors.dimensions?.message}
                />
                <OutlinedInputField
                  name="status"
                  label="Status"
                  register={register}
                  error={errors.status?.message}
                  helperText={errors.status?.message}
                />
                <SaveButton type="submit" loading={loading} variant="contained">
                  Update Product
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

export default ProductTable;
