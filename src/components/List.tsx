import { useEffect, useState } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { AudioService } from "@/services/storage";
import { User } from "firebase/auth";
import { Button } from "./ui/button";

export type AudioType = {
  id: string;
  prompt: string;
  fileName: string;
};

type ListProps = {
  onSelectAudio: (audio: AudioType) => void;
  onDeleteAudio: (fileName: string) => Promise<void>;
  onPlayAudio?: (audio: AudioType) => void;
  user: User | null;
};

export function List({
  onSelectAudio,
  onDeleteAudio,
  onPlayAudio,
  user,
}: ListProps) {
  const [audios, setAudios] = useState<AudioType[]>([]);
  const service = new AudioService();

  useEffect(() => {
    const fetchUserAudios = async () => {
      if (user) {
        const userAudios = await service.listUserAudios(user);
        setAudios(userAudios);
      }
    };

    fetchUserAudios();
  }, [user, service]);

  const handleSelectAudio = (audio: AudioType) => {
    onSelectAudio(audio);
    if (onPlayAudio) {
      onPlayAudio(audio);
    }
  };

  return (
    <ScrollArea className="w-full h-full bg-gray-900">
      {audios.map((audio) => (
        <div key={audio.id} className="flex items-center justify-between m-5">
          <div
            className="text-lg text-white hover:cursor-pointer"
            onClick={() => handleSelectAudio(audio)}
          >
            {audio.prompt}
          </div>
          <Button
            onClick={() => onDeleteAudio(audio.fileName)}
            variant="destructive"
          >
            Delete
          </Button>
        </div>
      ))}
      <Separator className="p-[2px] shadow-2xl shadow-gray-90 bg-gray-700" />
    </ScrollArea>
  );
}
