// Envoltorios de la Web Speech API: todo el audio corre en el navegador,
// sin costo ni latencia de servidor. STT requiere Chrome.

let vozEs: SpeechSynthesisVoice | null = null;
let solicitudNarracion = 0;

function elegirVoz(voces = window.speechSynthesis.getVoices()): SpeechSynthesisVoice | null {
  if (vozEs) return vozEs;

  const prioridad = ["es-ec", "es-419", "es-mx", "es-co", "es-pe", "es-cl", "es-ar", "es-es"];
  const vocesEspanol = voces.filter((voz) => voz.lang.toLowerCase().replace("_", "-").startsWith("es"));

  vozEs = prioridad
    .map((idioma) => vocesEspanol.find((voz) => voz.lang.toLowerCase().replace("_", "-") === idioma))
    .find((voz): voz is SpeechSynthesisVoice => Boolean(voz))
    ?? vocesEspanol[0]
    ?? null;
  return vozEs;
}

function esperarVozEnEspanol(): Promise<SpeechSynthesisVoice | null> {
  const vozDisponible = elegirVoz();
  if (vozDisponible) return Promise.resolve(vozDisponible);

  return new Promise((resolve) => {
    const synth = window.speechSynthesis;
    let completado = false;
    let temporizador = 0;

    function terminar(voz: SpeechSynthesisVoice | null) {
      if (completado) return;
      completado = true;
      synth.removeEventListener("voiceschanged", revisarVoces);
      window.clearTimeout(temporizador);
      resolve(voz);
    }

    function revisarVoces() {
      const voz = elegirVoz();
      if (voz) terminar(voz);
    }

    synth.addEventListener("voiceschanged", revisarVoces);
    temporizador = window.setTimeout(() => terminar(elegirVoz()), 1500);
  });
}

export async function hablar(
  texto: string,
  opciones?: { alTerminar?: () => void; velocidad?: number },
) {
  const synth = window.speechSynthesis;
  const solicitudActual = ++solicitudNarracion;
  synth.cancel();
  const voz = await esperarVozEnEspanol();

  if (solicitudActual !== solicitudNarracion) return;
  if (!voz) {
    window.dispatchEvent(new CustomEvent("alia:voz-no-disponible"));
    return;
  }

  const u = new SpeechSynthesisUtterance(texto);
  u.voice = voz;
  u.lang = voz.lang;
  u.rate = Math.min(1.5, Math.max(0.6, opciones?.velocidad ?? 0.95));
  if (opciones?.alTerminar) u.onend = opciones.alTerminar;
  synth.speak(u);
}

export function callar() {
  solicitudNarracion += 1;
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
