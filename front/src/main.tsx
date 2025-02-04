import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import SearchPage from './searchPage.tsx'
import HomePage from './HomePage.tsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [ 
      { path: "/", element: <HomePage/> },
      { path: "SearchPage", element: <SearchPage/> },
      // { path: "products/:id", element: <ProductPage/> },
      // { path: "categories", element: <Categories/> },
      // { path: "signUp", element: <SignUp/> },
      // { path: "signIn", element: <SignIn/> },
      // { path: "cart", element: <CartPage/> },
    ],
  },
  // {
  //   path: "/dashboard",
  //   element: <h1>Dashboard</h1>,
  // },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
