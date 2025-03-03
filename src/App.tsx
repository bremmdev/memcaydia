import { RouterProvider, createBrowserRouter } from "react-router";
import Layout from "@/components/layout/Layout";
import IndexPage from "@/pages/IndexPage";
import HighscorePage from "@/pages/HighscorePage";
import GamePage from "@/pages/GamePage";
import NotFound from "@/components/ui/NotFound";
import { indexRouteLoader, gameRouteLoader, highscoreRouteLoader } from "./lib/loaders";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <IndexPage />,
        loader: indexRouteLoader,
      },
      {
        path: "/highscores",
        element: <HighscorePage />,
        loader: highscoreRouteLoader
      },
      {
        path: "/games/:slug",
        element: <GamePage />,
        errorElement: <NotFound />,
        loader: ({ params }) => gameRouteLoader(params.slug),
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
