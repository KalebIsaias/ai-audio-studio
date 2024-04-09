import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface PromptProps {
  value?: string;
  onSubmit: (data: { prompt: string }) => Promise<void>;
  buttonText: string;
  onDelete?: () => Promise<void>;
  audioURL?: string | null; // Adiciona audioURL como uma prop
}

export function Prompt({ value, buttonText, onSubmit, audioURL }: PromptProps) {
  const { register, handleSubmit } = useForm<{ prompt: string }>({
    resolver: zodResolver(
      z.object({
        prompt: z.string(),
      })
    ),
  });

  async function handlePrompt(data: { prompt: string }) {
    try {
      await onSubmit(data); // Chama a função onSubmit com os dados do prompt
    } catch (error) {
      console.error("Error generating audio:", error);
      alert("Error generating audio. Please try again.");
    }
  }

  return (
    <div className="flex items-center justify-center flex-col space-y-6 ">
      <form
        onSubmit={handleSubmit(handlePrompt)}
        className="flex flex-col space-y-5 items-center"
      >
        <Textarea
          className="rounded-sm p-2 shadow-2xl shadow-gray-900 w-full sm:w-[600px] text-white max-h-80 min-h-40 border-none resize-none"
          autoComplete="off"
          required
          placeholder="Type your prompt here..."
          style={{ outline: "none" }}
          defaultValue={value}
          {...register("prompt")}
        />

        <Button
          className="text-lg font-medium p-6 w-full sm:w-[55%]"
          type="submit"
          variant="secondary"
        >
          {buttonText}
        </Button>
      </form>
      <div className="bottom-3">
        {audioURL && <audio className="" controls src={audioURL} />}
      </div>
    </div>
  );
}
