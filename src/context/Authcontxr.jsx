import React, { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We'll do a quick call to check session
    const checkSession = async () => {
      try {
        const BASE_URL = import.meta.env.VITE_BASE_URL || "";

        const response = await fetch(`${BASE_URL}/api/current-user`, {
          credentials: "include",
        });
        if (!response.ok) throw new Error("Not logged in");
        const data = await response.json();
        console.log(data);
        // Suppose data.user is your user object
        setUser(data.user);
      } catch (e) {
        setUser(null); // no session
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  const loginUser = (userData) => {
    setUser(userData);
  };

  const logoutUser = () => {
    setUser(null);
  };

  if (loading) {
    return <p>Loading user...</p>;
  }

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
