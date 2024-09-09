import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="text-white bg-primary-teal flex justify-between items-center p-4 md:px-8">
      <Link to="/" className="text-2xl font-medium -translate-y-1">
        <span className="text-teal-200">mem</span>caydia
      </Link>
      {/* <nav>
        <ul className="uppercase font-medium">
          <li>
            <Link to="/games" className="hover:text-teal-200">
              all games
            </Link>
          </li>
        </ul>
      </nav> */}
    </header>
  );
}
