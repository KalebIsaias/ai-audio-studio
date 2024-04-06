import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

import { UserAuth } from "@/contexts/Auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AudioService } from "@/services/storage";

interface PromptProps {
  value?: string;
  onSubmit: (data: { prompt: string }) => Promise<void>;
  buttonText: string;
  onDelete?: () => Promise<void>;
}

export function Prompt({ value, buttonText }: PromptProps) {
  const [audio, setAudio] = useState<string | null>(null);
  const { user } = UserAuth();
  const service = new AudioService();

  const { register, handleSubmit } = useForm<{ prompt: string }>({
    resolver: zodResolver(
      z.object({
        prompt: z.string(),
      })
    ),
  });

  async function handlePrompt(data: { prompt: string }) {
    try {
      const response = await service.saveAudioToStorageAndDB(data.prompt, user);
      setAudio(response);
    } catch (error) {
      console.error("Error generating audio:", error);
      alert("Error generating audio. Please try again.");
    }
  }

  return (
    <div className="flex items-center justify-center flex-col space-y-6">
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
          defaultValue={value} // Defina o valor padrão com base na prop value
          {...register("prompt")}
        />

        <Button
          className="text-lg font-medium p-6 w-full sm:w-[55%]"
          type="submit"
          variant="secondary"
        >
          {buttonText} {/* Use o buttonText fornecido como label do botão */}
        </Button>
      </form>
      <div className="bottom-3">
        {audio && <audio className="" controls src={audio} />}
      </div>
    </div>
  );
}
