import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthContextProvider } from "./contexts/Auth";
import { Page } from "./pages/Page";
import { ProtectedRoute } from "./pages/ProtectedRoute";

import { Login } from "./pages/auth/Login";
import { Register } from "./pages/auth/Register";
import { Reset } from "./pages/auth/Reset";
import { Home } from "./pages/Home";

export function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Routes>
          <Route
            path="/login"
            element={
              <Page>
                <Login />
              </Page>
            }
          />
          <Route
            path="/register"
            element={
              <Page>
                <Register />
              </Page>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <Page>
                <Reset />
              </Page>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthContextProvider>
    </BrowserRouter>
  );
}
