import { Outlet } from "react-router-dom";
import Header from "@/components/layout/Header";

export default function Layout() {
  return (
    <>
      <Header />

      <main className="min-h-screen">
        <Outlet />
      </main>
    </>
  );
}
