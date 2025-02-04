import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Layout.tsx";
import HomePage from "./HomePage.tsx";
import SearchPage from "./Search.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, // 🔹 Wrap routes with Layout
    children: [
      { index: true, element: <HomePage /> }, // Home page
      { path: "search", element: <SearchPage /> }, // Search page
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
