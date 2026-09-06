import React from "react";
import { Avatar, Button } from "@mui/material";
import { deepPurple } from "@mui/material/colors";
import { Link, useNavigate } from "react-router";
import { useAuth } from "./useAuth";
import "./Header.css";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const Header = ({ search, setSearch }) => {
  const navigate = useNavigate();
  const { user, setAccessToken, setUser, accessToken } = useAuth();

  const planetUser = () => {
    setUser(null);
    setAccessToken("");
    localStorage.clear();
  };

  return (
    <header className="header-wrapper">
      <div className="header">
        <img
          onClick={() => navigate("/")}
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Airbnb_Logo_B%C3%A9lo.svg/960px-Airbnb_Logo_B%C3%A9lo.svg.png"
          alt="Airbnb Logo"
          className="header-logo"
        />

        <div className="search-box">
          <input
            type="text"
            placeholder="Qidirish..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {accessToken?.length > 0 ? (
          <div className="header-user">
            <Link to={"/reverse"}>
              <Button>reserved</Button>
            </Link>

            <Avatar
              onClick={() => navigate("/profile")}
              className="header-avatar"
              sx={{
                bgcolor: deepPurple[500],
              }}
            >
              {user?.name?.slice(0, 1)?.toUpperCase() || "U"}
            </Avatar>

            <LogoutIcon className="header-logout" onClick={planetUser} />
          </div>
        ) : (
          <Button
            className="header-host-button"
            onClick={() => navigate("/Sign")}
          >
            Become a host <AccountCircleIcon />
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
