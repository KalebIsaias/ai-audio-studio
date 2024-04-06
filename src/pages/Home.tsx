import { useState } from "react";
import { Button } from "../components/ui/button";
import { Prompt } from "../components/Prompt";
import { List } from "../components/List";
import { UserAuth } from "@/contexts/Auth";
import { AudioService } from "@/services/storage";

export function Home() {
  const [selectedAudio, setSelectedAudio] = useState<any>(null);
  const [isCreatingNewAudio, setIsCreatingNewAudio] = useState<boolean>(true);
  const { user } = UserAuth();
  const { logout } = UserAuth();
  const service = new AudioService();

  const handleNewAudio = async (data: { prompt: string }) => {
    try {
      const audioURL = await service.saveAudioToStorageAndDB(data.prompt, user);
      setSelectedAudio({ prompt: data.prompt, audioURL });
      setIsCreatingNewAudio(false);
    } catch (error) {
      console.error("Error generating audio:", error);
      alert("Error generating audio. Please try again.");
    }
  };

  const handleUpdateAudio = async (data: { prompt: string }) => {
    try {
      const audioURL = await service.updateAudioInStorageAndDB(
        data.prompt,
        user,
        selectedAudio.id
      );
      setSelectedAudio({ ...selectedAudio, prompt: data.prompt, audioURL });
    } catch (error) {
      console.error("Error updating audio:", error);
      alert("Error updating audio. Please try again.");
    }
  };

  const handleDeleteAudio = async () => {
    try {
      await service.deleteAudio(user, selectedAudio.id);
      setSelectedAudio(null);
      setIsCreatingNewAudio(true);
    } catch (error) {
      console.error("Error deleting audio:", error);
      alert("Error deleting audio. Please try again.");
    }
  };

  // Certifique-se de que onSelectAudio está sendo chamada corretamente e de que selectedAudio está sendo atualizado corretamente
  const onSelectAudio = (audio: any) => {
    setSelectedAudio(audio);
    setIsCreatingNewAudio(false);
  };

  return (
    <main className="grid grid-cols-6 min-h-screen">
      {/* Left */}
      <div className="relative flex flex-col items-center justify-center overflow-hidden space-y-5 px-28 py-16 border-r-4 border-white/10 col-span-5">
        <h1 className="text-5xl font-bold text-white">Audio Studio</h1>
        {isCreatingNewAudio ? (
          <div className="flex flex-col items-center justify-center">
            <h2 className="text-white font-bold text-lg">New Audio</h2>
            <Prompt onSubmit={handleNewAudio} buttonText="Generate Audio" />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <h2 className="text-white font-bold text-lg">Update Audio</h2>
            <Prompt
              value={selectedAudio?.prompt}
              onSubmit={handleUpdateAudio}
              buttonText="Update Audio"
              onDelete={handleDeleteAudio}
            />
          </div>
        )}
        <Button onClick={logout} variant="destructive">
          Logout
        </Button>
      </div>

      {/* Right */}
      <div className="flex flex-col max-h-screen overflow-y-scroll col-span-1">
        {/* Adicionando a prop 'user' */}
        <List onSelectAudio={onSelectAudio} user={user} />
      </div>
    </main>
  );
}
