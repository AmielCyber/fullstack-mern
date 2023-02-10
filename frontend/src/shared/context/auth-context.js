import { createContext } from "react";
// Authentication Context to check if a user is logged in.
export const AuthContext = createContext({
  isLoggedIn: false,
  token: null,
  userId: null,
  login: () => {},
  logout: () => {},
});
