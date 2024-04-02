import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const promptSchema = z.object({
  prompt: z.string(),
});

type PromptSchema = z.infer<typeof promptSchema>;

export function Prompt() {
  const { register, handleSubmit } = useForm<PromptSchema>({
    resolver: zodResolver(promptSchema),
  });

  function handlePrompt(data: PromptSchema) {
    console.log(data);
    alert("Áudio gerado com sucesso!");
  }

  return (
    <div className="flex items-center justify-center">
      <form
        onSubmit={handleSubmit(handlePrompt)}
        className="flex flex-col items-center space-y-5"
      >
        <Textarea
          className="border-2 border-gray-300 rounded-sm p-2 resize-y w-full md:w-96 text-white max-h-80 min-h-40"
          autoComplete="off"
          required
          placeholder="O que deseja falar?"
          {...register("prompt")}
        />
        <Button
          className="text-lg font-medium p-6"
          type="submit"
          variant="secondary"
        >
          Gerar Áudio
        </Button>
      </form>
    </div>
  );
}
