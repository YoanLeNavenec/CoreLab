import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--p-surface)' }}>
      <Navbar />
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>
        <Outlet />
      </main>
    </div>
  );
}