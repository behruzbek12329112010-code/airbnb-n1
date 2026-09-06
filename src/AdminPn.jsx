import { useState } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
  Stack,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { Link } from "react-router-dom";

import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import { Controller, useForm } from "react-hook-form";

const GET_LISTINGS = gql`
  query Listings($limit: Int) {
    listings(limit: $limit) {
      items {
        id
        title
        pricePerNight
        images
        rating
      }
    }
  }
`;

const CREATE_LISTING = gql`
  mutation Mutation($input: CreateListingInput!) {
    createListing(input: $input) {
      id
      title
    }
  }
`;

const LOGIN = gql`
  mutation Mutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      accessToken
    }
  }
`;

const ADD_FAVORITE = gql`
  mutation AddFavorite($listingId: ID!) {
    addFavorite(listingId: $listingId) {
      id
      title
    }
  }
`;

const AdminPanel = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const [login] = useMutation(LOGIN);

  const {
    data,
    loading: queryLoading,
    error: queryError,
  } = useQuery(GET_LISTINGS, {
    variables: { limit: 50 },
    skip: !isLoggedIn,
  });

  const [createListing, { loading: mutationLoading }] = useMutation(
    CREATE_LISTING,
    {
      refetchQueries: [{ query: GET_LISTINGS, variables: { limit: 50 } }],
    },
  );

  const [addFavorite] = useMutation(ADD_FAVORITE);

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      title: "",
      images: "",
      rating: "",
      beds: "",
      location: "",
      address: "",
      guests: "",
      amenities: "",
      pricePerNight: "",
      description: "",
      category: "APARTMENT",
      bedrooms: "",
      bathrooms: "",
      isFeatured: false,
    },
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError("");
    try {
      const response = await login({
        variables: { email: email, password: password },
      });

      const token = response.data?.login?.accessToken;
      if (token) {
        localStorage.setItem("token", token);
        setIsLoggedIn(true);
      }
    } catch (err) {
      console.error(err);
      setAuthError(err.message || "Email yoki parol xato!");
    }
  };

  const onSubmit = async (formData) => {
    try {
      await createListing({
        variables: {
          input: {
            title: formData.title,
            images: formData.images,
            rating: Number(formData.rating),
            beds: Number(formData.beds),
            location: formData.location,
            address: formData.address,
            guests: Number(formData.guests),
            amenities: formData.amenities,
            pricePerNight: Number(formData.pricePerNight),
            description: formData.description,
            category: formData.category,
            bedrooms: Number(formData.bedrooms),
            bathrooms: Number(formData.bathrooms),
            isFeatured: Boolean(formData.isFeatured),
          },
        },
      });

      setModalOpen(false);
      reset();
      alert("Muvaffaqiyatli qo'shildi!");
    } catch (err) {
      console.error(err);
      alert("Xatolik yuz berdi. Konsolni tekshiring.");
    }
  };

  if (!isLoggedIn) {
    return (
      <Container maxWidth="xs" sx={{ mt: 10 }}>
        <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
          <Typography
            variant="h5"
            align="center"
            fontWeight={600}
            mb={3}
            color="primary"
          >
            Admin Panel
          </Typography>

          {authError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {authError}
            </Alert>
          )}

          <form onSubmit={handleLogin}>
            <Stack spacing={2.5}>
              <TextField
                label="Email"
                type="email"
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <TextField
                label="Parol"
                type="password"
                variant="outlined"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                sx={{ py: 1.5, fontSize: "16px", fontWeight: "bold" }}
              >
                Kirish
              </Button>
            </Stack>
          </form>
        </Paper>
      </Container>
    );
  }

  return (
    <>
      {modalOpen && (
        <div className="modalWrapper">
          <div className="modal">
            <Paper
              elevation={20}
              style={{
                padding: 20,
                marginTop: 100,
                maxHeight: "80vh",
                overflowY: "auto",
              }}
            >
              <Stack spacing={3}>
                <Typography variant="h4">Add Apartment</Typography>

                <div className="twoInputWrapper">
                  <Controller
                    name="title"
                    control={control}
                    rules={{ required: "Joy nomini kiriting" }}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        label="Title"
                        fullWidth
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                  />
                  <Controller
                    name="images"
                    control={control}
                    rules={{ required: "Rasm silkasini kiriting" }}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        label="Image URL"
                        fullWidth
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                  />
                </div>

                <div className="twoInputWrapper">
                  <Controller
                    name="pricePerNight"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="number"
                        label="Price Per Night"
                        fullWidth
                      />
                    )}
                  />
                  <Controller
                    name="rating"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="number"
                        label="Rating"
                        fullWidth
                      />
                    )}
                  />
                </div>

                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                      <Select {...field} label="Category">
                        <MenuItem value="APARTMENT">APARTMENT</MenuItem>
                        <MenuItem value="HOUSE">HOUSE</MenuItem>
                        <MenuItem value="VILLA">VILLA</MenuItem>
                      </Select>
                    )}
                  />
                </FormControl>

                <Button
                  variant="contained"
                  disabled={mutationLoading}
                  onClick={handleSubmit(onSubmit)}
                >
                  {mutationLoading ? "Yaratilmoqda..." : "Create"}
                </Button>
                <Button variant="outlined" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
              </Stack>
            </Paper>
          </div>
        </div>
      )}

      <div
        className="adminPageHeader"
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "20px",
        }}
      >
        <Button
          onClick={() => setModalOpen(true)}
          variant="contained"
          color="error"
        >
          Create Apartment
        </Button>
      </div>

      <div
        className="listingSection"
        style={{
          padding: "20px",
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        {queryError && <p style={{ color: "red" }}>{queryError.message}</p>}
        {queryLoading && <h2>Loading...</h2>}

        {data?.listings?.items?.map((item) => (
          <div
            className="card"
            key={item.id}
            style={{
              border: "1px solid #cdcaca",
              padding: "10px",
              borderRadius: "15px",
            }}
          >
            <IconButton
              onClick={() => addFavorite({ variables: { listingId: item.id } })}
            >
              <FavoriteBorderIcon />
            </IconButton>
            <img
              style={{
                width: "181px",
                height: "181px",
                borderRadius: "15px",
                objectFit: "cover",
              }}
              src={item.images}
              alt={item.title}
            />
            <Typography variant="subtitle2" mt={1}>
              {item.title}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              ${item.pricePerNight} for 2 night | ⭐ {item.rating}
            </Typography>
          </div>
        ))}
      </div>
    </>
  );
};

export default AdminPanel;
