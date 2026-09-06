import { ApolloClient } from "@apollo/client";
import { InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { HttpLink } from "@apollo/client";
import { Route, Routes } from "react-router";
import "./App.css";
import Listings from "./Home";
import SignUp from "./SignUp";
import { ToastContainer } from "react-toastify";
import Login from "./SignAp";
import Like from "./Favrolite";

import List from "./Listings";
import Pn from "./adminPn";
import Reverse from "./Revere";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Listings />} />
        <Route path="/sign" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Like />} />
        <Route path="/Listings/:id" element={<List />} />
        <Route path="/admin" element={<Pn />} />
        <Route path="/reverse" element={<Reverse />} />
      </Routes>

      <ToastContainer></ToastContainer>
      <graphql-client></graphql-client>
    </>
  );
}

export default App;
