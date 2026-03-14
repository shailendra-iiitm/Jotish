import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [user, setUser] = useState(() => {
    return localStorage.getItem("authUser");
  });

  const login = (username, password) => {

    if(username === "testuser" && password === "Test123"){

      localStorage.setItem("authUser", username);
      setUser(username);
    }

  };

  const logout = () => {

    localStorage.removeItem("authUser");
    setUser(null);

  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );

}

export const useAuth = () => useContext(AuthContext);