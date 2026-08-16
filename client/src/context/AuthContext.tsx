import { createContext, useState, useEffect, useMemo, useContext } from "react";
import type { ReactNode } from "react";

type AuthContextType = {
  accessToken: string | null;
  userId: number | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (accessToken: string, userId: number) => void;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<boolean>;
};

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = (accessToken: string, userId: number) => {
    setAccessToken(accessToken);
    setUserId(userId);
  };

  const logout = async () => {
    try {
      await fetch("http://localhost:5000/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout failed:", error);}
    finally {
      setAccessToken(null);
      setUserId(null);
    }
  };

  const refreshAccessToken = async (): Promise<boolean> => {
    try {
      const response = await fetch(
        "http://localhost:5000/refresh",
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!response.ok) {
        setAccessToken(null);
        setUserId(null);
        return false;
      }

      const data = await response.json();

      setAccessToken(data.accessToken);
      setUserId(data.id);

      return true;
    } catch (error) {
      console.error("Token refresh failed:", error);
      setAccessToken(null);
      setUserId(null);
      return false;
    }
  };

  const value = useMemo(
    () => ({
      accessToken,
      userId,
      isAuthenticated: !!accessToken,
      isLoading,
      login,
      logout,
      refreshAccessToken,
    }),
    [accessToken, userId, isLoading]
  );

  // Refresh access token on page load
  useEffect(() => {
    const initialise = async () => {
      await refreshAccessToken();
      setIsLoading(false);
    };

    initialise();
  }, []);

  useEffect(() => {
    console.log(userId);
  }, [userId]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};