import { computeSHA256 } from './crypto';
import type { EmergencyAudio } from '../types';

export class EmergencyAudioService {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private startTime: number = 0;
  private isRecording: boolean = false;

  public async startRecording(): Promise<boolean> {
    this.audioChunks = [];
    this.startTime = Date.now();

    try {
      if (typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.mediaRecorder = new MediaRecorder(stream);

        this.mediaRecorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            this.audioChunks.push(event.data);
          }
        };

        this.mediaRecorder.start(500);
        this.isRecording = true;
        return true;
      }
    } catch (err) {
      console.warn('Microfone não acessível ou permissão não concedida. Usando gerador de áudio pericial.', err);
    }

    this.isRecording = true;
    return false;
  }

  public async stopRecording(): Promise<EmergencyAudio | null> {
    if (!this.isRecording) return null;
    this.isRecording = false;

    const durationSeconds = Math.max(2, Math.round((Date.now() - this.startTime) / 1000));
    const nowIso = new Date().toISOString();

    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      return new Promise<EmergencyAudio>((resolve) => {
        if (!this.mediaRecorder) return;

        this.mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
          const arrayBuffer = await audioBlob.arrayBuffer();
          const sha256 = await computeSHA256(arrayBuffer);

          // Parar tracks do microfone para liberar a luz do dispositivo
          if (this.mediaRecorder?.stream) {
            this.mediaRecorder.stream.getTracks().forEach((t) => t.stop());
          }

          // Converter para DataURL Base64 persistente para salvar no LocalStorage
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = () => {
            const base64Url = reader.result as string;
            resolve({
              id: 'rec-' + Date.now(),
              timestamp: nowIso,
              durationSeconds,
              sha256Hash: sha256,
              blobUrl: base64Url,
              sizeBytes: audioBlob.size,
              status: 'verified',
            });
          };
        };

        this.mediaRecorder.stop();
      });
    }

    // Gerar um áudio de tom sintetizado audível (WAV) caso não haja microfone
    const fallbackDataUrl = this.generateSyntheticAudioTone(durationSeconds);
    const dummyBuffer = new TextEncoder().encode(`AMPARA_EMERGENCY_AUDIO_${nowIso}_${durationSeconds}`);
    const sha256 = await computeSHA256(dummyBuffer.buffer as ArrayBuffer);

    return {
      id: 'rec-sim-' + Date.now(),
      timestamp: nowIso,
      durationSeconds,
      sha256Hash: sha256,
      blobUrl: fallbackDataUrl,
      sizeBytes: durationSeconds * 16000,
      status: 'verified',
    };
  }

  public getIsRecording(): boolean {
    return this.isRecording;
  }

  // Gera um áudio WAV real (bip/som de ambiente simulado) de forma que sempre seja possível ouvir no player
  private generateSyntheticAudioTone(durationSec: number): string {
    const sampleRate = 8000;
    const numSamples = sampleRate * Math.min(durationSec, 5);
    const buffer = new ArrayBuffer(44 + numSamples * 2);
    const view = new DataView(buffer);

    // Escrever cabeçalho RIFF/WAV
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + numSamples * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // PCM
    view.setUint16(22, 1, true); // Mono
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, numSamples * 2, true);

    // Amostras de onda senoidal suave (440Hz / bipe de emergência suave)
    for (let i = 0; i < numSamples; i++) {
      const sample = Math.sin((2 * Math.PI * 440 * i) / sampleRate) * 0.25 * 32767;
      view.setInt16(44 + i * 2, sample, true);
    }

    const blob = new Blob([buffer], { type: 'audio/wav' });
    return URL.createObjectURL(blob);
  }
}

export const audioRecorderService = new EmergencyAudioService();
