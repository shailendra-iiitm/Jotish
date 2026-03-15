import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login(){

  const [username,setUsername] = useState("");
  const [password,setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useAuth();

  const navigate = useNavigate();

  const handleSubmit = (e) => {

    e.preventDefault();

    const isLoggedIn = login(username,password);

    if (isLoggedIn) {
      setError("");
      navigate("/list");
      return;
    }

    setError("Invalid username or password");

  };

  return (

    <div className="flex h-screen items-center justify-center">

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <input
        placeholder="Username"
        onChange={(e)=>{
          setUsername(e.target.value);
          if (error) setError("");
        }}
        />

        <input
        type="password"
        placeholder="Password"
        onChange={(e)=>{
          setPassword(e.target.value);
          if (error) setError("");
        }}
        />

        {error && (
          <p className="text-red-600 text-sm">{error}</p>
        )}

        <button className="bg-blue-500 text-white p-2">
        Login
        </button>

      </form>

    </div>

  );

}