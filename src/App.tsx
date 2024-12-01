import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AppLayout } from "./layout";
import { publicRoutes } from "./routes/public";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [...publicRoutes],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
