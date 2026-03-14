import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./auth/ProtectedRoute";
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
        <Route path="/details/:id" element={<ProtectedRoute><Details/></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><Analytics/></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;