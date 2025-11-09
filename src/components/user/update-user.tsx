import * as React from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup"; 
import DialogContent from "@mui/material/DialogContent";
import { FaCheckCircle } from "react-icons/fa";
import BootstrapDialog, { BootstrapDialogTitle } from "@components/ui/bootstrap-dialog";
import Grid from "@mui/material/Grid";
import { Box, Button } from "@mui/material"; 
import { UpdateUserListInfo } from "@data/user/use-user-list.query";
import { toast } from "react-toastify"; 
import SelectMd from "@components/ui/select-md"; 
import { UsersType } from "@utils/generated";
import OutlinedInputField from "../ui/out-lined-input-field"; 
import { ROLES } from "@/utils/constants";

const USER_TYPES = [
  { name: "Admin", value: ROLES.ADMIN },
  { name: "Account", value: ROLES.ACCOUNT },
  { name: "Vendor", value: ROLES.VENDOR },
  { name: "Guest", value: ROLES.GUEST },
];

export const USER_STATUS = [
  { name: "Active", value: "active" },
  { name: "Inactive", value: "inactive" },
];
interface IModal {
  open: boolean;
  setOpen: (open: boolean) => void;
  refetch: any;
  user: UsersType;
}
type FormValues = { 
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  password: string;
  status: string;
};
const registrationFormSchema: any = yup.object().shape({ 
  firstName: yup.string().required("First name is a required field.").min(3).max(20),
  lastName: yup.string().required("Last name is a required field.").min(3).max(20),
  email: yup.string().required("Email is a required field.").email().max(40),
  password: yup
    .string()
    .nullable()
    .transform((value) => (value === "" ? undefined : value))
    .min(8)
    .max(30),
  status: yup
    .string()
    .nullable()
    .transform((value) => (value === "" ? undefined : value)),
});
const defaultValues = { 
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  status: "",
};

const UpdateUserModal: React.FC<IModal> = ({ open, setOpen, refetch, user }) => {
  const [userType, setUserType] = React.useState(user.role);
  const [showPassword, setShowPassword] = React.useState(false);
  const [userStatus, setUserStatus] = React.useState(user.status);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const { mutate: updateMutate, isPending: loading } = UpdateUserListInfo();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormValues>({
    defaultValues,
    resolver: yupResolver(registrationFormSchema),
  });

  React.useEffect(() => {
    if (user) {
     
      setValue("email", user.email ?? "");
      setValue("firstName", user.firstName);
      setValue("lastName", user.lastName);
      setUserType(user.role ?? "");
      setUserStatus(user.status ?? "");
    }
  }, [user, setValue, setUserType]);

  const onSubmit = ({ firstName, lastName, email, password }: FormValues) => {
    updateMutate(
      {
        input: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          role: userType,
          password,
          status: userStatus,
        }, 
        userId: user.id,
      },
      {
        onSuccess: () => {
          toast.success("You have successfully update an account.");
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
    <BootstrapDialog onClose={handleClose} aria-labelledby="customized-dialog-title" maxWidth="sm" open={open}>
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
            &nbsp; Update User
          </span>
        </div>
      </BootstrapDialogTitle>
      <DialogContent  dividers>
        <div >
          <Grid container justifyContent="center">
            <Grid size={{ xs: 12 }}>
              <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ m: "0 15px 15px" }}>
                
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
                <div style={{ margin: "15px 0 20px" }}>
                  <SelectMd
                    options={USER_TYPES}
                    selectedOption={userType ?? ""}
                    color="#fff"
                    setSelect={(value: string) => setUserType(value)}
                    size="15px"
                  />
                </div>

                <div style={{ margin: "15px 0 20px" }}>
                  <SelectMd
                    options={USER_STATUS}
                    selectedOption={userStatus ?? ""}
                    color="#fff"
                    setSelect={(value: string) => setUserStatus(value)}
                    size="15px"
                  />
                </div>

                <div >
                  <Button type="submit" loading={loading} variant="contained">
                    Update User
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
export default UpdateUserModal;
