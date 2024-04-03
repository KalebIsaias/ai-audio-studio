import { UserAuth } from "../contexts/Auth";
import { Navigate } from "react-router-dom";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = UserAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <main className="bg-gray-800">{children}</main>
    </>
  );
}
