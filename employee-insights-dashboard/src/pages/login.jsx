import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login(){

  const [username,setUsername] = useState("");
  const [password,setPassword] = useState("");

  const { login } = useAuth();

  const navigate = useNavigate();

  const handleSubmit = (e) => {

    e.preventDefault();

    login(username,password);

    navigate("/list");

  };

  return (

    <div className="flex h-screen items-center justify-center">

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <input
        placeholder="Username"
        onChange={(e)=>setUsername(e.target.value)}
        />

        <input
        type="password"
        placeholder="Password"
        onChange={(e)=>setPassword(e.target.value)}
        />

        <button className="bg-blue-500 text-white p-2">
        Login
        </button>

      </form>

    </div>

  );

}