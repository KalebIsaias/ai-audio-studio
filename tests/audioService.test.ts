import { AudioService } from "../src/services/storage";
import { auth } from "../src/services/firebase";
import { signInWithEmailAndPassword, User } from "firebase/auth";

async function signInUser(email: string, password: string): Promise<User> {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    console.error("Erro ao autenticar usuário:", error);
    throw error;
  }
}

describe("AudioService", () => {
  let service: AudioService;
  let user: User;
  let email = "teste@email.com";
  let password = "123456";

  beforeAll(async () => {
    service = new AudioService();
    try {
      user = await signInUser(email, password);
    } catch (error) {
      console.error("Erro ao autenticar usuário:", error);
    }
  });

  it("should list user audios when user is authenticated and has audios", async () => {
    if (!user) {
      throw new Error("Usuário não autenticado.");
    }

    const audios = await service.listUserAudios(user);
    expect(audios).toEqual([]);
  });

  it("should get audio URL from storage", async () => {
    const audioURL = "audio-url";
    const url = await service.getAudioURLFromStorage(audioURL);
    expect(url).toBe(audioURL);
  });

  it("should save audio to storage and database", async () => {
    const prompt = "prompt";
    const fileName = await service.saveAudioToStorageAndDB(prompt, user);
    expect(fileName).toMatch(/\d+\.wav/);
  });

  it("should update audio in storage and database", async () => {
    const prompt = "prompt";
    const audioKey = "1712676032975.wav";
    const newAudioData = "new-audio-data";

    await expect(async () => {
      await service.updateAudioInStorageAndDB(
        prompt,
        user,
        audioKey,
        newAudioData
      );
    }).not.toThrow();
  });

  it("should delete audio from storage and database", async () => {
    const fileName = "1712677333759.wav";

    await expect(async () => {
      await service.deleteAudio(user, fileName);
    }).not.toThrow();
  });
});
