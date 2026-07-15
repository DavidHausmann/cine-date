import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { MainLayout } from "@/layouts/main-layout";
import { HomePage } from "@/pages/home-page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [{ index: true, element: <HomePage /> }],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
