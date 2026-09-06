import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router";
import { ApolloProvider } from "@apollo/client/react";
import { graphqlClient } from "./graphql-client.js";

createRoot(document.getElementById("root")).render(
  <ApolloProvider client={graphqlClient}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ApolloProvider>,
);
