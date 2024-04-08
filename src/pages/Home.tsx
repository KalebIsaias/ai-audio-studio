import { useState } from "react";
import { Button } from "../components/ui/button";
import { Prompt } from "../components/Prompt";
import { List, AudioType } from "../components/List";
import { UserAuth } from "@/contexts/Auth";
import { AudioService } from "@/services/storage";
import { tts } from "@/services/tts";

export function Home() {
  const [selectedAudio, setSelectedAudio] = useState<AudioType | null>(null);
  const [isCreatingNewAudio, setIsCreatingNewAudio] = useState<boolean>(true);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const { user, logout } = UserAuth();
  const service = new AudioService();

  const handleNewAudio = async (data: { prompt: string }) => {
    try {
      await service.saveAudioToStorageAndDB(data.prompt, user);
      setIsCreatingNewAudio(false);
    } catch (error) {
      console.error("Error generating audio:", error);
      alert("Error generating audio. Please try again.");
    }
  };

  const handleUpdateAudio = async (data: { prompt: string }) => {
    try {
      console.log("Updating audio with prompt:", data.prompt);
      console.log("Selected audio:", selectedAudio);
      console.log("Selected audio:", selectedAudio!.id);

      // Gerar novo áudio com base no prompt atualizado
      const newAudioData = await tts(data.prompt);

      // Substituir caracteres inválidos no nome do arquivo por "_"
      const fileName = selectedAudio!.fileName.replace(/[.#$[\]]/g, "_");

      // Atualizar áudio no Storage e no banco de dados
      await service.updateAudioInStorageAndDB(
        data.prompt,
        user,
        fileName,
        newAudioData // Passando o novo áudio gerado como parâmetro
      );

      // Atualizar prompt do áudio selecionado
      setSelectedAudio({ ...selectedAudio!, prompt: data.prompt });
    } catch (error) {
      console.error("Error updating audio:", error);
      alert("Error updating audio. Please try again.");
    }
  };

  const handleDeleteAudio = async (fileName: string) => {
    try {
      console.log("Deleting audio with fileName:", fileName);
      await service.deleteAudio(user, fileName);
      if (selectedAudio && selectedAudio.fileName === fileName) {
        setSelectedAudio(null);
      }
    } catch (error) {
      console.error("Error deleting audio:", error);
      alert("Error deleting audio. Please try again.");
    }
  };

  const onSelectAudio = async (audio: AudioType) => {
    setSelectedAudio(audio);
    setIsCreatingNewAudio(false);

    try {
      const audioURL = await service.getAudioURLFromStorage(
        `audios/${user?.uid}/${audio.fileName}`
      );
      setAudioURL(audioURL);
    } catch (error) {
      console.error("Error getting audio URL:", error);
      alert("Error getting audio URL. Please try again.");
    }
  };

  return (
    <main className="grid grid-cols-6 min-h-screen">
      <div className="relative flex flex-col items-center justify-center overflow-hidden space-y-5 px-28 py-16 border-r-4 border-white/10 col-span-4">
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
              onDelete={() => handleDeleteAudio(selectedAudio!.fileName)}
              audioURL={audioURL}
            />
          </div>
        )}
        <Button onClick={logout} variant="destructive">
          Logout
        </Button>
      </div>
      <div className="flex flex-col max-h-screen overflow-y-scroll col-span-2">
        {/* Adicione onPlayAudio como uma propriedade */}
        <List
          onSelectAudio={onSelectAudio}
          onDeleteAudio={handleDeleteAudio}
          user={user}
          onPlayAudio={() => {}} // Adicione uma função vazia se não for necessária
        />
      </div>
      {/* Remova a tag <audio> de fora do componente List */}
    </main>
  );
}
