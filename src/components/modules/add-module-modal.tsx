"use client";

import { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import { toast } from "react-toastify";
import { useCreateModulesMutation, useModulesQuery, useUpdateModulesMutation } from "@/data/module/use-module.query";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

// const MenuItemcustom = styled(MenuItem)`
//   text-transform: capitalize;
// `;

interface ModuleModalProps {
  open: boolean;
  handleClose: () => void;
  refetch: () => void;
}

export default function AddModuleModal({ open, handleClose, refetch }: ModuleModalProps) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [parentId, setParentId] = useState<number>(0);
  const [ordering, setOrdering] = useState<number | undefined>(undefined);
  const [icon, setIcon] = useState<string | undefined>("");
  const [errors, setErrors] = useState<{
    name?: string;
    slug?: string;
    icon?: string;
  }>({});

  const { data: modules = [] } = useModulesQuery({ order: ["name ASC"] });

  const { mutate: createModule, isPending } = useCreateModulesMutation();
  const { mutate: updateModule } = useUpdateModulesMutation();
  useEffect(() => {
    if (!open) {
      setName("");
      setSlug("");
      setParentId(0);
      setOrdering(undefined);
      setIcon("");
      setErrors({});
    }
  }, [open]);

  const validate = () => {
    const newErrors: {
      name?: string;
      slug?: string;
      icon?: string;
    } = {};

    // Name is always required
    if (!name) newErrors.name = "Module name is required";

    // Check if this is a parent module (parentId is null)
    const isParentModule = parentId === 0;

    // Check if this parent has children
    const hasChildren = false; // For new modules, they don't have children yet

    // Slug is required if:
    // 1. It's a leaf module (has a parent)
    // 2. It's a parent module with no children
    if (!isParentModule && !slug) {
      newErrors.slug = "Slug is required for modules with a parent";
    } else if (isParentModule && !hasChildren && !slug) {
      newErrors.slug = "Slug is required for modules with no children";
    }

    if (!icon) newErrors.icon = "Icon is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      toast.error("Please fix the errors before submitting.");
      return;
    } 
    // If a parent module is selected, update that parent module's slug to null
    if (parentId !== 0) {
      updateModule(
        {
          id: parentId,
          slug: "",
        },
        {
          onSuccess: (data:any) => {
            console.log("data", data);
          },
          onError: () => {
            return;
          },
        }
      );
    }

    createModule(
      {
        name,
        slug: slug || "", // Allow null slug for parent modules that will have children
        parentId,
        icon,
        ordering: ordering || 0,
      },
      {
        onSuccess: () => {
          toast.success("Module added successfully!");
          handleClose();
          refetch();
        },
        onError: (error) => {
          toast.error("Failed to add module: " + (error?.message || ""));
        },
      }
    );
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" mb={2}>
          Add Module
        </Typography>

        {/* Earning Head Title Input */}
        <TextField
          fullWidth
          label="Module name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          margin="normal"
          required
          error={!!errors.name}
          helperText={errors.name}
        />

        {/* Parent Module Selection */}
        <FormControl fullWidth margin="normal">
          <InputLabel id="parent-module-label">Parent Module</InputLabel>
          <Select
            labelId="parent-module-label"
            value={parentId}
            onChange={(e) => setParentId(Number(e.target.value))}
            label="Parent Module"
          >
            <MenuItem value={0}>None (Top Level Module)</MenuItem>
            {modules.map((module: any) => (
              <MenuItem key={module.id} value={module.id}>
                {module.name}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>
            {parentId === 0 ? "This will be a top-level module" : "This will be a child module"}
          </FormHelperText>
        </FormControl>

        <TextField
          fullWidth
          label="Slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          margin="normal"
          error={!!errors.slug}
        />
        <TextField
          fullWidth
          label="Icon name"
          value={icon}
          onChange={(e) => setIcon(e.target.value)}
          margin="normal"
          required
          error={!!errors.icon}
          helperText={errors.icon}
        />
        <TextField
          fullWidth
          label="Ordering"
          type="number"
          value={ordering}
          onChange={(e) => setOrdering(Number(e.target.value))}
          margin="normal"
        />

        {/* Buttons */}
        <Box mt={2} display="flex" justifyContent="space-between">
          <Button onClick={handleClose} color="error" variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary" disabled={isPending}>
            {isPending ? "Saving..." : "Add Module"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
