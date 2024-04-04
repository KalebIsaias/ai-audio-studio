import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

import { tts } from "@/services/tts";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const promptSchema = z.object({
  prompt: z.string(),
});

type PromptSchema = z.infer<typeof promptSchema>;

export function Prompt() {
  const [audio, setAudio] = useState<string | null>(null);

  const { register, handleSubmit } = useForm<PromptSchema>({
    resolver: zodResolver(promptSchema),
  });

  async function handlePrompt(data: PromptSchema) {
    try {
      const response = await tts(data.prompt);
      const audioData = `data:audio/wav;base64,${response.audioContent}`;
      setAudio(audioData);
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
          {...register("prompt")}
        />

        <Button
          className="text-lg font-medium p-6 w-full sm:w-[55%]"
          type="submit"
          variant="secondary"
        >
          Generate Audio
        </Button>
      </form>

      {audio && <audio className="" controls src={audio} />}
    </div>
  );
}
