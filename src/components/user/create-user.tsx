import React from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import DialogContent from "@mui/material/DialogContent";
import { FaCheckCircle } from "react-icons/fa";
import BootstrapDialog, {
  BootstrapDialogTitle,
} from "@components/ui/bootstrap-dialog";
import Grid from "@mui/material/Grid";
import { Box, Button } from "@mui/material";
import { useRegistrationMutation } from "@data/user/use-registration.mutation";
import { toast } from "react-toastify";
import SelectMd from "@components/ui/select-md";
import OutlinedInputField from "@components/ui/out-lined-input-field";
import { ROLES } from "@/utils/constants";
const USER_TYPES = [
  { name: "Admin", value: ROLES.ADMIN },
  { name: "Account", value: ROLES.ACCOUNT },
  { name: "Vendor", value: ROLES.VENDOR },
  { name: "Guest", value: ROLES.GUEST },
];

interface IModal {
  open: boolean;
  setOpen: (open: boolean) => void;
  client?: ClientTypes;
  refetch: any;
  updateInfo?: (email: string) => void;
}
type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
};
const registrationFormSchema: any = yup.object().shape({
  firstName: yup
    .string()
    .required("First name is a required field.")
    .min(3)
    .max(20),
  lastName: yup
    .string()
    .required("Last name is a required field.")
    .min(3)
    .max(20),
  email: yup.string().required("Email is a required field.").email().max(40),
  password: yup
    .string()
    .required("Password is a required field.")
    .transform((value) => (value === "" ? undefined : value))
    .min(8)
    .max(30),
});
const defaultValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
};

const CreateUserModal: React.FC<IModal> = ({ open, setOpen, refetch }) => {
  const [userType, setUserType] = React.useState("admin");
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const { mutate: registrationMutate, isPending: loading } =
    useRegistrationMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    defaultValues,
    resolver: yupResolver(registrationFormSchema),
  });

  const onSubmit = ({ firstName, lastName, email, password }: FormValues) => {
    registrationMutate(
      {
        variables: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          role: userType,
          password,
        },
      },
      {
        onSuccess: () => {
          toast.success("You have successfully created an account.");
          refetch();
          reset();
          handleClose();
        },
        onError: (error: any) => {
          if (error.response && error.response.data) {
            toast.error(error.response.data?.error?.message);
          } else {
            toast.error(error.toString());
            throw error;
          }
        },
      }
    );
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <BootstrapDialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      maxWidth="sm"
      open={open}
    >
      <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginRight: "50px",
          }}
        >
          <span style={{ display: "flex", alignItems: "center" }}>
            <FaCheckCircle />
            &nbsp;&nbsp; Create new {userType}
          </span>
        </div>
      </BootstrapDialogTitle>
      <DialogContent dividers>
        <div>
          <Grid container justifyContent="center">
            <Grid size={{ xs: 12 }}>
              <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                sx={{ m: "0 15px 15px" }}
              >
                <OutlinedInputField
                  name="firstName"
                  label="First Name"
                  register={register}
                  error={errors.firstName?.message}
                  helperText={errors.firstName?.message}
                />
                <OutlinedInputField
                  name="lastName"
                  label="Last Name"
                  register={register}
                  error={errors.lastName?.message}
                  helperText={errors.lastName?.message}
                />
                <OutlinedInputField
                  name="email"
                  label="Email"
                  register={register}
                  error={errors.email?.message}
                  helperText={errors.email?.message}
                />
                <OutlinedInputField
                  name="password"
                  label="Password"
                  type="password"
                  register={register}
                  error={errors.password?.message}
                  helperText={errors.password?.message}
                  showPassword={showPassword}
                  togglePasswordVisibility={handleClickShowPassword}
                />

                <div style={{ margin: "15px 0 0" }}>
                  <SelectMd
                    options={USER_TYPES}
                    selectedOption={userType}
                    color="#fff"
                    setSelect={(value: string) => setUserType(value)}
                    size="15px"
                  />
                </div>

                <div style={{ marginTop: "30px" }}>
                  <Button type="submit" loading={loading} variant="contained">
                    Create User
                  </Button>
                </div>
              </Box>
            </Grid>
          </Grid>
        </div>
      </DialogContent>
    </BootstrapDialog>
  );
};
export default CreateUserModal;
