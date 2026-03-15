import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function LogoutButton({
  className = "px-4 py-2 bg-red-500 text-white rounded",
  label = "Logout",
}) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <button onClick={handleLogout} className={className}>
      {label}
    </button>
  );
}