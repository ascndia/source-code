// src/index.js
import React from "react";
import { createRoot } from "react-dom/client";
import Search from "./search.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById("search-wrapper")).render(
  <QueryClientProvider client={queryClient}>
    <Search />
  </QueryClientProvider>
);
