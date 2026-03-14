import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import List from "./pages/list";
import Details from "./pages/details";
import Analytics from "./pages/analytics";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/list" element={<ProtectedRoute><List/></ProtectedRoute>} />
        <Route path="/details/:id" element={<Details />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;