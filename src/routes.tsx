import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Studio } from "./pages/Studio";
import { Page } from "./pages/Page";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Page>
              <Studio />
            </Page>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
