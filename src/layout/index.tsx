import { Outlet } from "react-router-dom";
import Navbar from "./navbar";

export const AppLayout = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
};
