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
      if (!user) {
        throw new Error("Usuário não autenticado.");
      }

      const db = getDatabase();
      const userAudiosRef = dbRef(db, `userAudios/${user.uid}`);
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
      throw new Error(
        "Erro ao listar os áudios do usuário. Por favor, tente novamente."
      );
    }
  }

  async getAudioURLFromStorage(audioURL: string) {
    try {
      const storage = getStorage();
      const audioRef = storageRef(storage, audioURL);
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
      const audioData = await tts(prompt); // Assumindo que a função tts retorna uma string em base64
      const fileName = `${Date.now()}.wav`;
      const storage = getStorage();
      const audioRef = storageRef(storage, `audios/${user?.uid}/${fileName}`);
      await uploadString(audioRef, audioData, "base64", {
        contentType: "audio/wav",
      });
      const db = getDatabase();
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
      const storage = getStorage();
      storageRef(storage, `audios/${user?.uid}/${audioKey}`);
      const fileNameWithoutExt = audioKey.split(".")[0];
      const fileName = `${fileNameWithoutExt}.wav`;
      const newAudioRef = storageRef(
        storage,
        `audios/${user?.uid}/${fileName}`
      );
      await uploadString(newAudioRef, newAudioData, "base64", {
        contentType: "audio/wav",
      });
      const newAudioURL = await getDownloadURL(newAudioRef);
      const db = getDatabase();
      const audioRef = dbRef(db, `userAudios/${user?.uid}/${audioKey}`);
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
      const storage = getStorage();
      const audioRef = storageRef(storage, `audios/${user?.uid}/${fileName}`);
      const metadata = await getMetadata(audioRef);
      if (!metadata) {
        console.log("Audio not found. It may have already been deleted.");
        return;
      }
      await deleteObject(audioRef);
      const db = getDatabase();
      const userAudiosRef: DatabaseReference = dbRef(
        db,
        `userAudios/${user?.uid}`
      );
      const snapshot: DataSnapshot = await get(userAudiosRef);
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot: DataSnapshot) => {
          if (childSnapshot.child("fileName").val() === fileName) {
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
