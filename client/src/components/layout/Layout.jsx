import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

//Layout component that wraps around all pages for a default structure
export default function Layout() {
  return (
    <div>
      <Navbar />
      <main>
        <Outlet />
        {/* Renders whichever child route is currently active */}
      </main>
    </div>
  );
}