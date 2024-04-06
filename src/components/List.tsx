import { useEffect, useState } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { AudioService } from "@/services/storage";
import { User } from "firebase/auth";

type Audio = {
  id: string;
  prompt: string;
};

type ListProps = {
  onSelectAudio: (audio: Audio) => void;
  user: User | null;
};

export function List({ onSelectAudio, user }: ListProps) {
  const [audios, setAudios] = useState<Audio[]>([]);
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

  return (
    <ScrollArea className="w-full h-full bg-gray-900">
      {audios.map((audio) => (
        <div
          key={audio.id}
          className="m-5 text-lg text-white hover:cursor-pointer"
          onClick={() => onSelectAudio(audio)}
        >
          {audio.prompt}
        </div>
      ))}
      <Separator className="p-[2px] shadow-2xl shadow-gray-90 bg-gray-700" />
    </ScrollArea>
  );
}
