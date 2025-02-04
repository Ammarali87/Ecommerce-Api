import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Layout.tsx";
import HomePage from "./HomePage.tsx";
import SearchPage from "./Search.tsx";
import Dashboard from "./Dashboard.tsx"

const router = createBrowserRouter([
  {
    path: "/", 
    // layout == App
    element: <Layout />, // 🔹 Wrap routes with Layout
    children: [
      { index: true, element: <HomePage /> }, // Home page
      { path: "search", element: 
      <SearchPage onSearch={(query) =>
         console.log(query)} /> }, // Search page
    ],
  },
  {path:"/Dashboard", element:<Dashboard/>}
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
