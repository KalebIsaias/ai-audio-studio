import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";

export function App() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4 items-center">
      <div className="flex items-center justify-center">
        <form className="flex items-center space-x-3 ">
          <Input name="prompt" placeholder="O que deseja falar?" />
          <Button type="submit" variant="default">
            Gerar Áudio
          </Button>
        </form>
      </div>
    </div>
  );
}
