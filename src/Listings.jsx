import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import StarIcon from "@mui/icons-material/Star";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import PushPinIcon from "@mui/icons-material/PushPin";
import WcIcon from "@mui/icons-material/Wc";
import AirlineSeatIndividualSuiteIcon from "@mui/icons-material/AirlineSeatIndividualSuite";
import BedroomParentIcon from "@mui/icons-material/BedroomParent";
import SynagogueIcon from "@mui/icons-material/Synagogue";
import CellWifiIcon from "@mui/icons-material/CellWifi";
import {
  Button,
  Container,
  Typography,
  Box,
  Grid,
  Card,
  Divider,
  TextField,
} from "@mui/material";
import { useParams } from "react-router";
import Header from "./header";
import FooterAirbnb from "./Footer";
import { useForm, Controller } from "react-hook-form";
import { OrbitProgress } from "react-loading-indicators";

const DETAILS = gql`
  query Query($listingId: ID!) {
    listing(id: $listingId) {
      title
      reviewsCount
      rating
      pricePerNight
      location
      isFeatured
      images
      id
      guests
      description
      createdAt
      category
      beds
      bedrooms
      bathrooms
      amenities
      address
    }
  }
`;

const MUTATION = gql`
  mutation CreateBooking(
    $checkIn: String!
    $checkOut: String!
    $guests: Int!
    $listingId: ID!
  ) {
    createBooking(
      checkIn: $checkIn
      checkOut: $checkOut
      guests: $guests
      listingId: $listingId
    ) {
      id
      status
    }
  }
`;

function List() {
  const { id } = useParams();

  const { data, loading, error } = useQuery(DETAILS, {
    variables: { listingId: id },
    skip: !id,
  });

  const [createBooking, { loading: bookingLoading, error: bookingError }] =
    useMutation(MUTATION);

  const { handleSubmit, control, reset } = useForm({
    defaultValues: {
      checkIn: "",
      checkOut: "",
      guests: 1,
    },
  });

  const listing = data?.listing;

  const onSubmit = async (formData) => {
    try {
      const response = await createBooking({
        variables: {
          checkIn: formData.checkIn,
          checkOut: formData.checkOut,
          guests: parseInt(formData.guests, 10),
          listingId: id,
        },
      });

      if (response.data) {
        alert("Buyurtma muvaffaqiyatli amalga oshirildi!");
        reset();
      }
    } catch (err) {
      console.warn(`Xato`);
    }
  };

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {loading && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
            }}
          >
            <OrbitProgress
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100vh",
              }}
              color="black"
              size="medium"
              text=""
              textColor=""
            />
          </div>
        )}

        {error && (
          <Typography
            variant="body1"
            color="error"
            style={{ textAlign: "center", marginTop: "40px" }}
          >
            {error.message}
          </Typography>
        )}

        {listing && (
          <Box key={listing.id}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {listing.title}
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                gap: 1,
                borderRadius: 4,
                overflow: "hidden",
                height: { xs: "300px", md: "450px" },
                mb: 4,
              }}
            >
              <Box sx={{ width: "100%", height: "100%" }}>
                <img
                  src={
                    listing.images[0] ||
                    "https://img.magnific.com/free-vector/bird-colorful-logo-gradient-vector_343694-1365.jpg?semt=ais_hybrid&w=740&q=80"
                  }
                  alt={listing.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </Box>
              <Box
                sx={{
                  display: { xs: "none", md: "grid" },
                  gridTemplateColumns: "1fr 1fr",
                  gridTemplateRows: "1fr 1fr",
                  gap: 1,
                  height: "100%",
                }}
              >
                {listing.images.slice(1, 5).map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`img-${index}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ))}
              </Box>
            </Box>

            <Grid container spacing={4}>
              <Grid item xs={12} md={8}>
                <Typography variant="h5" fontWeight="600" gutterBottom>
                  Entire rental unit in {listing.location}, {listing.address}
                </Typography>

                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}
                >
                  <Typography
                    variant="h6"
                    color="success.main"
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    {listing.rating} <StarIcon sx={{ ml: 0.5 }} />
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    ({listing.reviewsCount} reviews)
                  </Typography>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 2,
                  }}
                >
                  <div style={detailBoxStyle}>
                    <b>amenities:</b> {listing.amenities} <CellWifiIcon />
                  </div>
                  <div style={detailBoxStyle}>
                    <b>guests:</b> {listing.guests} <SynagogueIcon />
                  </div>
                  <div style={detailBoxStyle}>
                    <b>bedrooms:</b> {listing.bedrooms} <BedroomParentIcon />
                  </div>
                  <div style={detailBoxStyle}>
                    <b>beds:</b> {listing.beds}{" "}
                    <AirlineSeatIndividualSuiteIcon />
                  </div>
                  <div style={detailBoxStyle}>
                    <b>bathrooms:</b> {listing.bathrooms} <WcIcon />
                  </div>
                  <div style={detailBoxStyle}>
                    <b>address:</b> {listing.address} <PushPinIcon />
                  </div>
                  <div style={detailBoxStyle}>
                    <b>location:</b> {listing.location} <AddLocationAltIcon />
                  </div>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" fontWeight="bold">
                  About this space
                </Typography>
                <Typography variant="body1" paragraph mt={1}>
                  {listing.description}
                </Typography>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card
                  elevation={4}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    border: "1px solid #e0e0e0",
                    position: "sticky",
                    top: 24,
                  }}
                >
                  <Typography variant="h5" fontWeight="bold" mb={2}>
                    ${listing.pricePerNight}{" "}
                    <Typography
                      component="span"
                      variant="body1"
                      color="text.secondary"
                    >
                      / night
                    </Typography>
                  </Typography>

                  <form onSubmit={handleSubmit(onSubmit)}>
                    <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                      <Controller
                        name="checkIn"
                        control={control}
                        rules={{ required: "Check-in kiritilishi shart" }}
                        render={({ field, fieldState: { error } }) => (
                          <TextField
                            {...field}
                            type="date"
                            label="Check-In"
                            InputLabelProps={{ shrink: true }}
                            error={!!error}
                            helperText={error?.message}
                            fullWidth
                          />
                        )}
                      />
                      <Controller
                        name="checkOut"
                        control={control}
                        rules={{ required: "Check-out kiritilishi shart" }}
                        render={({ field, fieldState: { error } }) => (
                          <TextField
                            {...field}
                            type="date"
                            label="Check-Out"
                            InputLabelProps={{ shrink: true }}
                            error={!!error}
                            helperText={error?.message}
                            fullWidth
                          />
                        )}
                      />
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Controller
                        name="guests"
                        control={control}
                        rules={{
                          required: "Mehmonlar soni kiritilishi shart",
                          min: {
                            value: 1,
                            message: "Kamida 1 kishi bo'lishi kerak",
                          },
                        }}
                        render={({ field, fieldState: { error } }) => (
                          <TextField
                            {...field}
                            type="number"
                            label="Guests"
                            error={!!error}
                            helperText={error?.message}
                            fullWidth
                          />
                        )}
                      />
                    </Box>

                    {bookingError && (
                      <Typography color="error" variant="body2" mb={2}>
                        Xatolik: {bookingError.message}
                      </Typography>
                    )}

                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      color="error"
                      disabled={bookingLoading}
                      sx={{
                        py: 1.5,
                        fontSize: "16px",
                        fontWeight: "bold",
                        borderRadius: 2,
                        textTransform: "none",
                      }}
                    >
                      {bookingLoading ? "Yuborilmoqda..." : "reseve"}
                    </Button>
                  </form>

                  <Typography
                    variant="body2"
                    textAlign="center"
                    color="text.secondary"
                    mt={2}
                  >
                    You won't be charged yet
                  </Typography>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}
      </Container>
      <FooterAirbnb />
    </>
  );
}

export const detailBoxStyle = {
  border: "1px solid #e0e0e0",
  borderRadius: "12px",
  padding: "12px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

export default List;
