import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Button,
  Container,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useAuth } from "./useAuth";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router";
import ReplyAllIcon from "@mui/icons-material/ReplyAll";

const LoginMutation = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      accessToken
      user {
        email
        id
        name
      }
    }
  }
`;

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { setAccessToken, setUser } = useAuth();
  const navigate = useNavigate();
  const [loginUser, { loading, error }] = useMutation(LoginMutation, {
    onCompleted: (data) => {
      if (data?.login) {
        setAccessToken(data.login.accessToken);
        setUser(data.login.user);

        toast.success("Logined successfully!");
        navigate("/");
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const handleS = (dataa) => {
    loginUser({ variables: dataa });
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
        <Paper elevation={4} sx={{ padding: 10 }}>
          <Stack spacing={2}>
            <Controller
              name="email"
              control={control}
              rules={{
                required: "full email",
              }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Email"
                  size="small"
                  error={error}
                  helperText={error && error.message}
                />
              )}
            />
            <Controller
              name="password"
              control={control}
              rules={{
                required: { value: true, message: "Password is required!" },
                minLength: {
                  value: 6,
                  message: "Password should include at least 6 characters!",
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  fullWidth
                  size="small"
                  type={showPassword ? "text" : "password"}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            edge="end"
                            size="small"
                            onClick={() => setShowPassword((prev) => !prev)}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                  error={!!error}
                  label="Password"
                  helperText={error && error.message}
                />
              )}
            />
            <Button
              onClick={handleSubmit(handleS)}
              variant="contained"
              color="error"
              loading={loading}
            >
              Log In
            </Button>
            <p>
              Dear user, you are currently on the login page if you do not have
              an account <Link to={"/Sign"}>create account</Link>
            </p>
          </Stack>
        </Paper>
      </Container>
    </>
  );
}
export default Login;
