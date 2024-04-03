import { Button } from "@/components/ui/button";
import { Prompt } from "../components/prompt";
import { UserAuth } from "@/contexts/Auth";

export function Studio() {
  const { logout } = UserAuth();

  return (
    <div className="p-6 max-w-4xl h-screen mx-auto space-y-10 items-center content-center text-center">
      <h1 className="text-5xl font-bold text-white">Audio Studio</h1>
      <Prompt />
      <Button onClick={logout} variant="destructive">
        Logout
      </Button>
    </div>
  );
}
