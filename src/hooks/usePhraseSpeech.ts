import { useEffect, useState } from "react";

export function usePhraseSpeech(language: string) {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [speaking, setSpeaking] = useState<string | null>(null);
  const [error, setError] = useState("");
  const supported = typeof window !== "undefined" && "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
  const voice = voices.find((item) => item.lang.toLowerCase() === language.toLowerCase())
    ?? voices.find((item) => item.lang.split(/[-_]/)[0] === language.split("-")[0]);

  useEffect(() => {
    if (!supported) return;
    const synth = window.speechSynthesis;
    const update = () => setVoices(synth.getVoices());
    update();
    synth.addEventListener("voiceschanged", update);
    return () => { synth.removeEventListener("voiceschanged", update); synth.cancel(); };
  }, [supported]);

  useEffect(() => {
    setSpeaking(null);
    setError("");
    if (supported) window.speechSynthesis.cancel();
    return () => { if (supported) window.speechSynthesis.cancel(); };
  }, [language, supported]);

  function stop() {
    if (supported) window.speechSynthesis.cancel();
    setSpeaking(null);
  }
  function speak(id: string, text: string) {
    if (!supported || !voice) return;
    if (speaking === id) { stop(); return; }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.voice = voice;
    utterance.rate = .85;
    utterance.onend = () => setSpeaking((current) => current === id ? null : current);
    utterance.onerror = (event) => {
      if (event.error !== "canceled" && event.error !== "interrupted") {
        setError("Не удалось воспроизвести фразу. Можно прочитать подсказку произношения.");
        setSpeaking(null);
      }
    };
    setError("");
    setSpeaking(id);
    window.speechSynthesis.speak(utterance);
  }
  return { available: supported && !!voice, speaking, error, speak, stop };
}
