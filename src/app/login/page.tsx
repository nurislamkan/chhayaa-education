"use client";
// React library for building componentsimport React from "react";
import Link from "next/link";
import { toast } from "react-toastify";

// Material UI components for building UI elements
import Grid from "@mui/material/Grid";
import {
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import styled from "@emotion/styled";

// Import a custom hook for logging in a user
import { useLoginMutation } from "@data/user/use-login.mutation";
import { ROUTES } from "@utils/routes";
import {
  setAuthCredentials,
  getAuthCredentials,
  isAuthenticated,
} from "@utils/auth-utils";
import LogoSmall from "@public/icon.png";

// React Hook Form for managing form state and input handling
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Image from "next/image";
import { useRouter } from "next/navigation"; 
import { useEffect } from 'react';

 
const Form = styled.form`
  width: 100%;
`;
type FormValues = {
  email: string;
  password: string;
};
const loginFormSchema = yup.object().shape({
  email: yup.string().required("User / Email is a required field."),
  password: yup.string().required("Password is a required field."),
});
const defaultValues = {
  email: "",
  password: "",
  isRemember: true,
};

const Login = () => {
  const { mutate: login, isPending: loading } = useLoginMutation();
  const router = useRouter();

  const authCredentials = getAuthCredentials();

  useEffect(() => {
    if (isAuthenticated(authCredentials)) {
      router.replace(ROUTES.DASHBOARD);
    }
  }, [authCredentials, router]); 

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues,
    resolver: yupResolver(loginFormSchema),
  });

  const onSubmit = ({ email, password }: FormValues) => {
    const credentials = {
      email: email as string,
      password: password as string,
    };
    //login(credentials)
    login(credentials, {
      onSuccess: (data: any) => {
        if (data.data?.token) { 
          setAuthCredentials(
            data.data?.id,
            data.data?.email,
            data.data?.firstName,
            data.data?.lastName,
            data.data?.expiredPass,
            data.data?.token,
            data.data?.groupId,
            [data.data?.role]
          );
          router.push(ROUTES.DASHBOARD);
          toast.success(`Login successful`);
        } else {
          toast.error(`Something is wrong`);
        }
      },
      onError: () => { 
        toast.error(`Email/password is invalid `);
      },
       
    });
  };
  const paperStyle = {
    padding: 20, 
    minHeight: "450px",
    maxHeight: "450px",
    width: 380,
    margin: "80px auto",
    backgroundColor: "#E6F4F1",
    borderRadius: "12px",
    boxShadow: "0px 0px 8px rgba(0, 0, 0, 25)",
  };
  const btnstyle = { margin: "12px 0" };

  return (
    <Container>       
      <Grid sx={{ display: "flex", alignItems: "flex", height: "100vh" }}>
        <Form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Paper elevation={12} style={paperStyle}>
            <Grid textAlign={"center"}>
              <Image src={LogoSmall} alt="Company Logo" width={70} />
              <h2>Login</h2>
            </Grid>
            <TextField
              id="standard-basic"
              label="Email"
              placeholder="Enter Your Email"
              error={errors?.email?.message ? true : false}
              color="success"
              helperText={errors?.email?.message}
              {...register("email")}
              fullWidth
              required
              sx={{ marginBottom: "10px" }}
            />
            <TextField
              id="standard-basic"
              label="Password"
              placeholder="Enter Your Password"
              error={errors?.password?.message ? true : false}
              color="success"
              type="password"
              helperText={errors?.password?.message}
              {...register("password")}
              fullWidth
              required
            />
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Remember Me"
            />

            <Button
              style={btnstyle}
              type="submit"
              color="primary"
              variant="contained"
              fullWidth
              loading={loading}
            >
              Login
            </Button>
            <Typography sx={{ marginBottom: "10px" }}>
              <Link href="#">Forgot Password?</Link>
            </Typography>

            <Typography>
              Don&apos;t have an account?
              <Link href="#">Sign Up Here.</Link>
            </Typography>
          </Paper>
        </Form>
      </Grid>
    </Container>
  );
};

export default Login;
