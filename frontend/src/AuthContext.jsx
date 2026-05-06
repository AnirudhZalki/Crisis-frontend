import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const ROLE_PASSWORDS = {
  "Crisis Admin":                "admin@crisis2025",
  "Medical Resource Officer":    "role@1234",
  "Rescue Resource Officer":     "role@1234",
  "Fire and Safety Officer":     "role@1234",
  "NGO / Volunteer Coordinator": "role@1234",
  "Transport Officer":           "role@1234",
  "Shelter Officer":             "role@1234",
};

export const ROLE_ICONS = {
  "Crisis Admin":                "🎯",
  "Medical Resource Officer":    "🏥",
  "Rescue Resource Officer":     "🚒",
  "Fire and Safety Officer":     "🔥",
  "NGO / Volunteer Coordinator": "🤝",
  "Transport Officer":           "🚌",
  "Shelter Officer":             "🏠",
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { role, name }

  const login = (role, password) => {
    if (ROLE_PASSWORDS[role] === password) {
      setUser({ role });
      return true;
    }
    return false;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
