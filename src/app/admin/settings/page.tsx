"use client";
import { useState } from "react";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import Grid from "@mui/material/Grid";
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup"; 

// Validation Schema using Yup
const validationSchema = Yup.object().shape({
  siteName: Yup.string().required("Site Name is required"),
  footerText: Yup.string().required("Footer Text is required"),
  contactEmail: Yup.string().email("Invalid email").required("Contact Email is required"),
  contactAddress: Yup.string().required("Contact Address is required"),
  facebookUrl: Yup.string().url("Invalid URL").nullable(),
  instagramUrl: Yup.string().url("Invalid URL").nullable(),
  twitterUrl: Yup.string().url("Invalid URL").nullable(),
});

export default function SettingsPage() {
  
 

  // React Hook Form setup
  const {
    control, 
    formState: { errors }, 
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const [preview, setPreview] = useState<string | null>(null); 


  // Handle image file input
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  // const onSubmit = (data: any) => {
    

  //   // if (isEditMode) {
  //   //   // If in edit mode, update the existing settings
  //   //   updateOption(optionsData, {
  //   //     onSuccess: () => { 
  //   //       toast.success("Settings updated successfully");
  //   //       refetch();
  //   //     },
  //   //     onError: () => {
  //   //       toast.error("Failed to update settings"); 
  //   //     },
  //   //   });
  //   // } else {
  //   //   // If not in edit mode, create new settings
  //   //   createOption(optionsData, {
  //   //     onSuccess: () => { 
  //   //       toast.success("Settings saved successfully");
  //   //       refetch();
  //   //     },
  //   //     onError: () => {
  //   //       toast.error("Failed to save settings");
  //   //     },
  //   //   });
  //   // }
  // };

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3 }}>
        <form >
          <Grid container spacing={3}>
            {/* Site Name */}
            <Grid size={{ xs: 12 }}>
              <Controller
                name="siteName"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Site Name"
                    variant="outlined"
                    error={!!errors.siteName}
                    helperText={errors.siteName?.message}
                  />
                )}
              />
            </Grid>

            {/* Logo Upload */}
            <Grid size={{ xs: 12 }}>
              <Typography variant="subtitle1">Logo Upload</Typography>
              <input type="file" accept="image/*" onChange={handleFileChange} style={{ marginTop: "10px" }} />
              {preview && (
                <Box mt={2}>
                  <Typography variant="body2">Preview:</Typography>
                  <Image src={preview} alt="Logo Preview" width={100} height={100} />
                </Box>
              )}
            </Grid>

            {/* Footer Text */}
            <Grid size={{ xs: 12 }}>
              <Controller
                name="footerText"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Footer Text"
                    variant="outlined"
                    error={!!errors.footerText}
                    helperText={errors.footerText?.message}
                  />
                )}
              />
            </Grid>

            {/* Contact Email */}
            <Grid size={{ xs: 6 }}>
              <Controller
                name="contactEmail"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Contact Email"
                    variant="outlined"
                    error={!!errors.contactEmail}
                    helperText={errors.contactEmail?.message}
                  />
                )}
              />
            </Grid>

            {/* Contact Address */}
            <Grid size={{ xs: 6 }}>
              <Controller
                name="contactAddress"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Contact Address"
                    variant="outlined"
                    error={!!errors.contactAddress}
                    helperText={errors.contactAddress?.message}
                  />
                )}
              />
            </Grid>

            {/* Facebook URL */}
            <Grid size={{ xs: 6, md: 4 }}>
              <Controller
                name="facebookUrl"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Facebook URL"
                    variant="outlined"
                    error={!!errors.facebookUrl}
                    helperText={errors.facebookUrl?.message}
                  />
                )}
              />
            </Grid>

            {/* Instagram URL */}
            <Grid size={{ xs: 6, md: 4 }}>
              <Controller
                name="instagramUrl"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Instagram URL"
                    variant="outlined"
                    error={!!errors.instagramUrl}
                    helperText={errors.instagramUrl?.message}
                  />
                )}
              />
            </Grid>

            {/* Twitter URL */}
            <Grid size={{ xs: 6, md: 4 }}>
              <Controller
                name="twitterUrl"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Twitter URL"
                    variant="outlined"
                    error={!!errors.twitterUrl}
                    helperText={errors.twitterUrl?.message}
                  />
                )}
              />
            </Grid>

            {/* Submit Button */}
            <Grid size={{ xs: 12 }}>
              <Button type="submit" variant="contained" color="primary">
                { "Save Changes"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
}
