import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { Button, Container, Paper, Stack, TextField } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { data, Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useAuth } from "./useAuth";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const REGISTER_MUATTION = gql`
  mutation Register($email: String!, $name: String!, $password: String!) {
    register(email: $email, password: $password, name: $name) {
      accessToken
      user {
        id
        email
        name
      }
    }
  }
`;

function SignUp() {
  const [register, { loading }] = useMutation(REGISTER_MUATTION);
  const { control, handleSubmit } = useForm();
  const { setUser, setAccessToken } = useAuth();
  const navigate = useNavigate();
  const handleRegisterComleted = (data) => {
    setAccessToken(data?.register?.accessToken);
    setUser(data?.register?.user);
    toast.success("Registered successfully!");
    navigate("/");
  };

  const handleSubmit2 = (value) => {
    register({
      variables: value,
      onCompleted: handleRegisterComleted,
      onError: (error) => toast.error(error.message),
    });
  };

  return (
    <>
      <Link to="/">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Airbnb_Logo_B%C3%A9lo.svg/960px-Airbnb_Logo_B%C3%A9lo.svg.png?utm_source=ru.wikipedia.org&utm_campaign=index&utm_content=thumbnail"
          alt=""
          style={{ width: "150px" }}
        />
      </Link>
      <Container>
        <Paper sx={{ padding: 10 }}>
          <Stack spacing={2}>
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="name"
                  helperText={error && error.message}
                />
              )}
            />
            <Controller
              name="email"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Email"
                  helperText={error && error.message}
                />
              )}
            />
            <Controller
              name="password"
              table="password"
              value="password"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Password"
                  type="password"
                  helperText={error && error.message}
                />
              )}
            />
            <Button
              onClick={handleSubmit(handleSubmit2)}
              variant="contained"
              color="error"
              loading={loading}
            >
              Register
            </Button>
            <p>
              Dear user, you are now in the new account creation section! Do you
              have an account? <Link to={"/Login"}>login </Link>
            </p>
          </Stack>
        </Paper>
      </Container>
    </>
  );
}

export default SignUp;
