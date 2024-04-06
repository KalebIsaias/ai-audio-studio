// tts.ts
import axios from "axios";

export async function tts(text: string) {
  try {
    const apiKey = import.meta.env.VITE_GOOGLE_TEXT_TO_SPEECH_API_KEY;
    const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`;
    const payload = {
      input: {
        text: text,
      },
      voice: {
        languageCode: "pt-BR",
        name: "pt-BR-Neural2-C",
      },
      audioConfig: {
        audioEncoding: "LINEAR16",
        pitch: 0,
        speakingRate: 1,
      },
    };

    const response = await axios.post(url, payload);
    return response.data.audioContent;
  } catch (error) {
    console.error("Erro ao gerar áudio:", error);
    throw error;
  }
}
