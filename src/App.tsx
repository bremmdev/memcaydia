import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import Index from "@/pages/Index";
import Games from "@/pages/Games";

function App() {
  return (
    <Router future={{ v7_startTransition: true }}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Index />} />
          <Route path="/games" element={<Games />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
