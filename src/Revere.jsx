import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import { useState } from "react";
import { useAuth } from "./useAuth";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

import {
  Avatar,
  Box,
  Button,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { deepOrange, deepPurple } from "@mui/material/colors";
import { Link } from "react-router";
import SignUp from "./SignUp";
import "./Pages.css";
import FooterAirbnb from "./Footer";
import Header from "./header";
import { OrbitProgress } from "react-loading-indicators";

const BOOKEN = gql`
  query Bookings {
    bookings {
      checkIn
      checkOut
      createdAt
      guests
      id
      listing {
        id
        title
        pricePerNight
        location
        images
      }
      pricePerNight
      status
      totalNights
      totalPrice
    }
  }
`;

const AddFavorute = gql`
  mutation Mutation($listingId: ID!) {
    addFavorite(listingId: $listingId) {
      address
      bedrooms
      guests
      location
    }
  }
`;

function Listings() {
  const [page, setpage] = useState(1);
  const [search, setsearch] = useState("");
  const { accessToken, user } = useAuth();
  const { data, loading, error } = useQuery(BOOKEN, {
    variables: { limit: 6, page: page, search: search },
  });
  const [setFav] = useMutation(AddFavorute);
  const totalPages = data?.listings?.pagination?.totalPages;

  console.log(accessToken);

  return (
    <>
      <div>
        <Header search={search} setSearch={setsearch} />
      </div>

      <div>
        <br />

        {error && <Typography color="error">{error.message}</Typography>}
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

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          {data?.bookings?.map((item) => (
            <div
              key={item?.listing?.id}
              style={{
                border: "1px solid #e0e0e0",
                borderRadius: "12px",
                padding: "12px",
                display: "flex",
                flexDirection: "column",
                justify: "space-between",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              <div className="rasm">
                <Box
                  sx={{ position: "relative", width: "100%", height: "200px" }}
                >
                  <Link
                    to={`/Listings/${item?.listing?.id}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <img
                      src={
                        Array.isArray(item?.listing?.images)
                          ? item?.listing?.images[0]
                          : item?.listing?.images
                      }
                      alt={item?.listing?.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                  </Link>

                  <IconButton
                    onClick={() =>
                      setFav({ variables: { listingId: item?.listing?.id } })
                    }
                    sx={{
                      position: "absolute",
                      top: 8,
                      backgroundColor: "white",
                      right: 8,
                      "&:hover": {
                        backgroundColor: "white",
                      },
                    }}
                  >
                    <FavoriteBorderIcon color="error" />
                  </IconButton>
                </Box>
              </div>

              <div style={{ marginTop: "10px" }}>
                <h3 style={{ margin: "5px 0", fontSize: "1.1rem" }}>
                  {item?.listing?.title}
                </h3>
                <p style={{ margin: 0, fontWeight: "bold" }}>
                  {item?.listing?.pricePerNight}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "20px", display: "flex", gap: "5px" }}>
          {new Array(totalPages).fill().map((_, index) => (
            <button key={index} onClick={() => setpage(index + 1)}>
              {index + 1}
            </button>
          ))}
        </div>
        <Stack></Stack>
        <FooterAirbnb />
      </div>
    </>
  );
}

export default Listings;
