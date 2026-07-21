// Envoltorios de la Web Speech API: todo el audio corre en el navegador,
// sin costo ni latencia de servidor. STT requiere Chrome.

let vozEs: SpeechSynthesisVoice | null = null;

function elegirVoz(): SpeechSynthesisVoice | null {
  if (vozEs) return vozEs;
  const voces = window.speechSynthesis.getVoices();
  vozEs =
    voces.find((v) => v.lang.startsWith("es-EC")) ??
    voces.find((v) => v.lang.startsWith("es-419")) ??
    voces.find((v) => v.lang.startsWith("es")) ??
    null;
  return vozEs;
}

export function hablar(texto: string, opciones?: { alTerminar?: () => void }) {
  const synth = window.speechSynthesis;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(texto);
  u.lang = "es-419";
  const voz = elegirVoz();
  if (voz) u.voice = voz;
  u.rate = 0.95;
  if (opciones?.alTerminar) u.onend = opciones.alTerminar;
  synth.speak(u);
}

export function callar() {
  window.speechSynthesis.cancel();
}

// La Web Speech API de reconocimiento no está tipada en lib.dom — tipos mínimos
interface ReconocimientoVoz {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: (e: { results: { [i: number]: { [j: number]: { transcript: string } } } }) => void;
  onerror: (e: { error?: string }) => void;
  onend: () => void;
  start: () => void;
}

// Reconocimiento de voz (Chrome). Devuelve la transcripción o rechaza.
export function escuchar(): Promise<string> {
  return new Promise((resolve, reject) => {
    const w = window as unknown as {
      SpeechRecognition?: new () => ReconocimientoVoz;
      webkitSpeechRecognition?: new () => ReconocimientoVoz;
    };
    const Reconocedor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!Reconocedor) {
      reject(new Error("Este navegador no soporta reconocimiento de voz. Usa Chrome."));
      return;
    }
    const rec = new Reconocedor();
    rec.lang = "es-EC";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onresult = (e) => {
      resolve(e.results[0][0].transcript);
    };
    rec.onerror = (e) => {
      reject(new Error(e.error === "no-speech" ? "No escuché nada. Intenta de nuevo." : `Error de micrófono: ${e.error}`));
    };
    rec.onend = () => {
      // si terminó sin resultado ni error, resolvemos vacío para no colgar la UI
      resolve("");
    };
    rec.start();
  });
}

export function soportaEscucha(): boolean {
  const w = window as unknown as Record<string, unknown>;
  return Boolean(w.SpeechRecognition ?? w.webkitSpeechRecognition);
}
