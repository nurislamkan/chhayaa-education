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
import { useUpdateModulesMutation, useModulesQuery } from "@/data/module/use-module.query";
import { toast } from "react-toastify";

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

interface UpdateModuleModalProps {
  open: boolean;
  handleClose: () => void;
  refetch: () => void;
  module: any; // Module to edit
}

export default function UpdateModuleModal({ open, handleClose, refetch, module }: UpdateModuleModalProps) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [parentId, setParentId] = useState<number>(0);
  const [icon, setIcon] = useState("");
  const [ordering, setOrdering] = useState<number | undefined>(undefined);
  const [errors, setErrors] = useState<{
    name?: string;
    slug?: string;
    icon?: string;
  }>({});

  const { data: modules = [] } = useModulesQuery({ order: ["name ASC"] });

  // Check if this module has children
  const hasChildren = modules.some((m: any) => m.parentId === module?.id);

  const { mutate: updateModule, isPending } = useUpdateModulesMutation();

  useEffect(() => {
    if (module) {
      setName(module.name || "");
      setSlug(module.slug || "");
      setParentId(module.parentId || 0); // Set to 0 if parentId is null or undefined
      setIcon(module.icon || "");
      setOrdering(module.ordering);
      setErrors({});
    }
  }, [module]);

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
          onSuccess: () => {},
          onError: () => {
            return;
          },
        }
      );
    }

    updateModule(
      {
        id: module.id,
        name,
        slug: slug || "", // Allow null slug for parent modules that have children
        parentId,
        icon,
        ordering: ordering || 0,
      },
      {
        onSuccess: () => {
          toast.success("Module updated successfully!");
          handleClose();
          refetch();
        },
        onError: (error) => {
          toast.error("Failed to update module: " + (error?.message || ""));
        },
      }
    );
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" mb={2}>
          Update Module
        </Typography>

        {/* Module Name */}
        <TextField
          fullWidth
          label="Module Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          margin="normal"
          required
          error={!!errors.name}
          helperText={errors.name}
        />

        {/* Parent Module Selection */}
        <FormControl fullWidth margin="normal">
          <InputLabel id="parent-module-update-label">Parent Module</InputLabel>
          <Select
            labelId="parent-module-update-label"
            value={parentId}
            onChange={(e) => setParentId(Number(e.target.value))}
            label="Parent Module"
          >
            <MenuItem value={0}>None (Top Level Module)</MenuItem>
            {modules
              .filter((m: any) => m.id !== module?.id) // Can't be its own parent
              .map((m: any) => (
                <MenuItem key={m.id} value={m.id}>
                  {m.name}
                </MenuItem>
              ))}
          </Select>
          <FormHelperText>
            {parentId === 0 ? "This will be a top-level module" : "This will be a child module"}
          </FormHelperText>
        </FormControl>

        {/* Slug */}
        <TextField
          fullWidth
          label="Slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          margin="normal"
          error={!!errors.slug}
          helperText={
            errors.slug ||
            (parentId === 0 && hasChildren
              ? "Can be empty for parent modules with children"
              : parentId === 0
                ? "Required for parent modules with no children"
                : "Required for child modules")
          }
        />

        {/* Icon */}
        <TextField
          fullWidth
          label="Icon"
          value={icon}
          onChange={(e) => setIcon(e.target.value)}
          margin="normal"
          error={!!errors.icon}
          helperText={errors.icon}
        />

        {/* Ordering */}
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
            {isPending ? "Updating..." : "Update Module"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
