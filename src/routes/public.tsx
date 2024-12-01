import { Navigate } from "react-router-dom";
import Debug from "../screens/debug";
import ErrorBoundary from "@/screens/errorBoundary";

export const publicRoutes = [
  {
    path: "/debug",
    element: <Debug />,
  },
  {
    path: "/",
    element: <Navigate to="/debug" />,
  },
  {
    path: "*",
    element: <ErrorBoundary />,
  },
];
