import { Link, Outlet } from "react-router-dom";
import Logo from "@/assets/logo.svg";

export default function Layout() {
  return (
    <>
      <header className="bg-teal-700 flex justify-between items-center p-4">
        <Link to="/">
          <span className="flex gap-2 items-center">
            <img src={Logo} className="size-12" alt="memcaydia logo" />
            <span className="text-2xl font-medium">memcaydia</span>
          </span>
        </Link>
        <nav>
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/about">About</a>
            </li>
          </ul>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>
    </>
  );
}
