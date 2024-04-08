import { app } from "./firebase";
import {
  getStorage,
  ref as storageRef,
  uploadString,
  getDownloadURL,
  deleteObject,
  getMetadata,
} from "firebase/storage";
import {
  ref as dbRef,
  get,
  DataSnapshot,
  getDatabase,
  set,
  push,
  DatabaseReference,
  remove,
  update,
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

  async getAudioURLFromStorage(audioURL: string) {
    try {
      // Criar uma referência para o arquivo de áudio no armazenamento
      const storage = getStorage();
      const audioRef = storageRef(storage, audioURL);

      // Obter o URL de download do arquivo de áudio
      const url = await getDownloadURL(audioRef);
      return url;
    } catch (error) {
      console.error("Error getting audio URL from storage:", error);
      throw new Error(
        "Error getting audio URL from storage. Please try again."
      );
    }
  }

  async saveAudioToStorageAndDB(prompt: string, user: User | null) {
    try {
      console.log("Gerando áudio para o prompt:", prompt);

      // Gerar áudio
      const audioData = await tts(prompt);
      const fileName = `${Date.now()}.wav`;

      // Salvar áudio no Storage
      const storage = getStorage(app);
      const audioRef = storageRef(storage, `audios/${user?.uid}/${fileName}`);
      await uploadString(audioRef, audioData, "base64", {
        contentType: "audio/wav",
      });

      const db = getDatabase(app);
      const userAudioRef = push(dbRef(db, `userAudios/${user?.uid}`));
      await set(userAudioRef, {
        prompt: prompt,
        fileName: fileName,
        user: user?.uid,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      return fileName;
    } catch (error) {
      console.error("Erro ao salvar áudio e dados:", error);
      throw error;
    }
  }

  async updateAudioInStorageAndDB(
    prompt: string,
    user: User | null,
    audioKey: string,
    newAudioData: string
  ) {
    try {
      console.log("Updating audio with prompt:", prompt);
      console.log("Selected audio:", audioKey);

      // Referência ao armazenamento
      const storage = getStorage();

      // Referência ao arquivo de áudio antigo
      const oldAudioRef = storageRef(
        storage,
        `audios/${user?.uid}/${audioKey}`
      );

      // Obter nome do arquivo sem a extensão
      const fileNameWithoutExt = audioKey.split(".")[0];

      // Nome do arquivo com a extensão corrigida
      const fileName = `${fileNameWithoutExt}.wav`;

      // Referência ao novo arquivo de áudio
      const newAudioRef = storageRef(
        storage,
        `audios/${user?.uid}/${fileName}`
      );

      // Carregar o novo áudio para o armazenamento
      await uploadString(newAudioRef, newAudioData, "base64", {
        contentType: "audio/wav",
      });

      // Obter URL do novo áudio
      const newAudioURL = await getDownloadURL(newAudioRef);

      // Referência ao nó de áudio no banco de dados
      const db = getDatabase();
      const audioRef = dbRef(db, `userAudios/${user?.uid}/${audioKey}`);

      // Atualizar os dados do áudio no banco de dados
      await update(audioRef, {
        prompt: prompt,
        fileName: fileName,
        audioURL: newAudioURL,
        updatedAt: { ".sv": "timestamp" },
      });

      console.log("Audio updated successfully");
    } catch (error) {
      console.error("Error updating audio:", error);
      throw error;
    }
  }

  async deleteAudio(user: User | null, fileName: string) {
    try {
      // Referência para o arquivo no Storage
      const storage = getStorage();
      const audioRef = storageRef(
        storage,
        `audios/${user?.uid}/${fileName}` // Caminho do arquivo no Storage
      );

      // Verificar se o arquivo existe antes de tentar excluí-lo
      const metadata = await getMetadata(audioRef);
      if (!metadata) {
        console.log("Audio not found. It may have already been deleted.");
        return;
      }

      // Excluir o arquivo do armazenamento
      await deleteObject(audioRef);

      // Referência para o nó dos áudios do usuário no Realtime Database
      const db = getDatabase();
      const userAudiosRef: DatabaseReference = dbRef(
        db,
        `userAudios/${user?.uid}`
      );

      // Obter o snapshot do nó dos áudios do usuário
      const snapshot: DataSnapshot = await get(userAudiosRef);

      // Verificar se o snapshot existe
      if (snapshot.exists()) {
        // Iterar sobre os nós dos áudios do usuário
        snapshot.forEach((childSnapshot: DataSnapshot) => {
          // Verificar se o nome do arquivo corresponde ao áudio atual
          if (childSnapshot.child("fileName").val() === fileName) {
            // Remover o nó do áudio
            remove(childSnapshot.ref);
          }
        });
      }

      console.log("Audio deleted successfully");
    } catch (error) {
      console.error("Error deleting audio:", error);
    }
  }
}
