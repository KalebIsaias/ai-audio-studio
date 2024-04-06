import { app } from "./firebase";
import {
  getStorage,
  ref as storageRef,
  uploadString,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import {
  getDatabase,
  ref as dbRef,
  push,
  set,
  remove,
  get,
  DataSnapshot,
} from "firebase/database";
import { User } from "firebase/auth";
import { tts } from "./tts";

export class AudioService {
  async listUserAudios(user: User | null) {
    try {
      const db = getDatabase();
      const userAudiosRef = dbRef(db, `userAudios/${user?.uid}`);
      const snapshot = await get(userAudiosRef);

      if (snapshot.exists()) {
        const audios: any[] = [];
        snapshot.forEach((childSnapshot: DataSnapshot) => {
          audios.push({ id: childSnapshot.key, ...childSnapshot.val() });
        });
        return audios;
      } else {
        console.log("No audios found for the user");
        return [];
      }
    } catch (error) {
      console.error("Error listing user audios:", error);
      throw new Error("Error listing user audios. Please try again.");
    }
  }

  async saveAudioToStorageAndDB(prompt: string, user: User | null) {
    try {
      console.log("Gerando áudio para o prompt:", prompt);

      // Gerar áudio
      const audioData = await tts(prompt);

      // Salvar áudio no Storage
      const storage = getStorage(app);
      const audioRef = storageRef(
        storage,
        `audios/${user?.uid}/${Date.now()}.wav`
      );
      await uploadString(audioRef, audioData, "base64", {
        contentType: "audio/wav",
      });

      // Obter URL do áudio
      const audioURL = await getDownloadURL(audioRef);

      // Salvar dados no Realtime Database
      const db = getDatabase(app);
      const userAudioRef = push(dbRef(db, `userAudios/${user?.uid}`));
      await set(userAudioRef, {
        prompt: prompt,
        audioURL: audioURL,
        user: user?.uid,
        createdAt: Date.now(),
        updatedAt: Date.now(), // Corrigi um typo aqui
      });

      return audioURL;
    } catch (error) {
      console.error("Erro ao salvar áudio e dados:", error);
      throw error;
    }
  }
  async updateAudioInStorageAndDB(
    prompt: string,
    user: User | null,
    audioKey: string
  ) {
    try {
      console.log("Atualizando áudio para o prompt:", prompt);

      // Remover áudio anterior do Storage
      const storage = getStorage(app);
      const audioRef = storageRef(
        storage,
        `audios/${user?.uid}/${audioKey}.wav`
      );
      await deleteObject(audioRef);

      // Gerar novo áudio com base no prompt atualizado
      const newAudioData = await tts(prompt);

      // Salvar novo áudio no Storage
      await uploadString(audioRef, newAudioData, "base64", {
        contentType: "audio/wav",
      });

      // Obter URL do novo áudio
      const newAudioURL = await getDownloadURL(audioRef);

      // Atualizar URL do áudio no Realtime Database
      const db = getDatabase(app);
      const userAudioRef = dbRef(db, `userAudios/${user?.uid}/${audioKey}`);
      await set(userAudioRef, {
        prompt: prompt,
        audioURL: newAudioURL,
        user: user?.uid,
        updatedAt: Date.now(),
      });

      return newAudioURL;
    } catch (error) {
      console.error("Erro ao atualizar áudio:", error);
      throw error;
    }
  }

  async deleteAudio(user: User | null, audioId: string) {
    try {
      // Exclui o áudio do armazenamento
      const storage = getStorage();
      const audioRef = storageRef(
        storage,
        `audios/${user?.uid}/${audioId}.wav`
      );
      await deleteObject(audioRef);

      // Exclui o áudio do banco de dados
      const db = getDatabase();
      const userAudioRef = dbRef(db, `userAudios/${user?.uid}/${audioId}`);
      await remove(userAudioRef);

      console.log("Audio deleted successfully");
    } catch (error) {
      console.error("Error deleting audio:", error);
      throw new Error("Error deleting audio. Please try again.");
    }
  }
}
