import { jwtDecode } from "jwt-decode";
import React, { createContext, useContext, useEffect, useState } from "react";

import { getBackendURL } from "./lib/utils";

export interface User {
  userId: string;
  email: string;
  username: string;
  isAdmin: boolean;
  emailVerified: boolean;
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  url: string;
  points: number;
  category: string;
  author: string;
  date?: string;
  flag?: string | null; // The flag is only visible to admins
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  createChallenge: (challengeData: Omit<Challenge, "id">) => Promise<void>;
  getChallenges: () => Promise<{ category: string; challenges: Challenge[] }[]>;
  updateChallenge: (
    id: string,
    challengeData: Partial<Challenge>,
  ) => Promise<void>;
  deleteChallenge: (id: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode<User>(token);
        setUser(decodedToken);
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token");
      }
    }
  }, []);

  const updateUserFromToken = (token: string) => {
    localStorage.setItem("token", token);
    const decodedToken = jwtDecode<User>(token);
    setUser(decodedToken);
  };

  const login = async (email: string, password: string) => {
    const response = await fetch(getBackendURL() + "/api/users/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (response.ok) {
      updateUserFromToken(data.token);
    } else {
      throw new Error(data.error);
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string,
  ) => {
    const response = await fetch(getBackendURL() + "/api/users/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password, isAdmin: false }),
    });
    const data = await response.json();
    if (response.ok) {
      updateUserFromToken(data.token);
    } else {
      throw new Error(data.error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const verifyEmail = async (token: string) => {
    const response = await fetch(
      getBackendURL() + `/api/users/auth/verify-email?token=${token}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      },
    );
    const data = await response.json();
    if (response.ok) {
      updateUserFromToken(data.token);
    } else {
      throw new Error(data.error);
    }
  };

  // Challenge Management Functions

  const createChallenge = async (challengeData: Omit<Challenge, "id">) => {
    const token = localStorage.getItem("token");
    const response = await fetch(getBackendURL() + "/api/challenges/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(challengeData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to create the challenge");
    }
  };

  const getChallenges = async (): Promise<
    {
      category: string;
      challenges: Challenge[];
    }[]
  > => {
    const token = localStorage.getItem("token");
    const response = await fetch(getBackendURL() + "/api/challenges/read", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch challenges");
    }
    return data.challenges;
  };

  const updateChallenge = async (
    id: string,
    challengeData: Partial<Challenge>,
  ) => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      getBackendURL() + `/api/challenges/update/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(challengeData),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to update the challenge");
    }
  };

  const deleteChallenge = async (id: string) => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      getBackendURL() + `/api/challenges/delete/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to delete the challenge");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        createChallenge,
        getChallenges,
        updateChallenge,
        deleteChallenge,
        verifyEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
