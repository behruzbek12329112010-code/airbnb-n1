import { Avatar, Button, Box, IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { deepPurple } from "@mui/material/colors";
import { gql } from "@apollo/client";
import { useAuth } from "./useAuth";
import { useMutation, useQuery } from "@apollo/client/react";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import Header from "./header";
import FooterAirbnb from "./Footer";
import { useNavigate } from "react-router";
import { OrbitProgress } from "react-loading-indicators";

const FAV_QUERY = gql`
  query Favorites {
    favorites {
      id
      address
      amenities
      bathrooms
      bedrooms
      beds
      category
      createdAt
      description
      guests
      images
      title
      pricePerNight
    }
  }
`;

const SET_FAV_MUTATION = gql`
  mutation SetFav($listingId: ID!) {
    setFavorite(listingId: $listingId) {
      id
    }
  }
`;

const REMOVE_FAV_MUTATION = gql`
  mutation RemoveFavorite($listingId: ID!) {
    removeFavorite(listingId: $listingId) {
      id
    }
  }
`;

function Like() {
  const navigate = useNavigate();
  const { accessToken, user } = useAuth();
  const { data, loading, error, refetch } = useQuery(FAV_QUERY);

  const [removeFavorite] = useMutation(REMOVE_FAV_MUTATION, {
    refetchQueries: [{ query: FAV_QUERY }],
  });

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <OrbitProgress color="black" size="medium" />
      </div>
    );
  }

  if (error) return <p>Error loading favorites!</p>;

  return (
    <>
      <Header />
      <br />
      <hr />
      <div
        style={{
          border: "1px solid #e0e0e0",
          borderRadius: 12,
          padding: 12,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <Avatar sx={{ bgcolor: deepPurple[500] }}>
          {user?.name?.slice(0, 1)}
        </Avatar>
        <h1>{user?.name}</h1>
      </div>
      <br />
      <div
        style={{
          border: "1px solid #e0e0e0",
          borderRadius: 12,
          padding: 12,
          textAlign: "center",
        }}
      >
        <h2>likes</h2>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {data?.favorites?.map((item) => (
          <div
            key={item.id}
            onClick={() => navigate(`/listings/${item.id}`)}
            style={{
              border: "1px solid #e0e0e0",
              borderRadius: 12,
              padding: 12,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              cursor: "pointer",
            }}
          >
            <div>
              <Box
                sx={{ position: "relative", width: "100%", height: "200px" }}
              >
                <img
                  src={
                    Array.isArray(item.images) ? item.images[0] : item.images
                  }
                  alt={item.title || "Listing Image"}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: 8,
                  }}
                />
              </Box>
            </div>
            <div style={{ marginTop: "10px" }}>
              <h3 style={{ margin: "5px 0", fontSize: "1.1rem" }}>
                {item.title}
              </h3>
              <p style={{ margin: 0, fontWeight: "bold" }}>
                {item.pricePerNight}
              </p>
            </div>
            <br />
            <Button
              variant="outlined"
              startIcon={<DeleteIcon />}
              onClick={(e) => {
                e.stopPropagation();
                removeFavorite({ variables: { listingId: item.id } });
              }}
            >
              delete
            </Button>
          </div>
        ))}
      </div>
      <br />
      <FooterAirbnb />
    </>
  );
}

export default Like;
