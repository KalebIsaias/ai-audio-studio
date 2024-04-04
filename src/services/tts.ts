import axios from "axios";

export async function tts(text: string) {
  const apiKey = import.meta.env.VITE_GOOGLE_TEXT_TO_SPEECH_API_KEY;
  const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`;
  const payload = {
    audioConfig: {
      audioEncoding: "LINEAR16",
      effectsProfileId: ["headphone-class-device"],
      pitch: 0,
      speakingRate: 1,
    },
    input: {
      text: text,
    },
    voice: {
      languageCode: "pt-BR",
      name: "pt-BR-Neural2-C",
    },
  };

  try {
    const response = await axios.post(url, payload);

    return response.data;
  } catch (error) {
    console.error("Erro ao gerar áudio:", error);
  }
}
