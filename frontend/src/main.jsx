import { StrictMode, useState, useEffect, createContext } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import axios from "axios";

// Create global context with defaults
export const Context = createContext({
  isAuthorized: false,
  setIsAuthorized: () => {},
  user: null,
  setUser: () => {},
});

const AppWrapper = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On app load, check if user is still logged in (via cookies)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/v1/users/info", {
          withCredentials: true,
        });

        setUser(res.data.data); // Assuming backend sends { data: user }
        setIsAuthorized(true);
      } catch (err) {
        setUser(null);
        setIsAuthorized(false);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Context.Provider value={{ isAuthorized, setIsAuthorized, user, setUser }}>
      <App />
    </Context.Provider>
  );
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppWrapper />
  </StrictMode>
);