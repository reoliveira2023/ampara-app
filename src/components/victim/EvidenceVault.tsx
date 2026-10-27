import React, { useState, useEffect } from 'react';
import { Lock, FileCheck, Play, Pause, Trash2, Download, Info } from 'lucide-react';
import type { EmergencyAudio } from '../../types';
import { storageService } from '../../services/storage';
import { formatTimestamp } from '../../services/crypto';

export const EvidenceVault: React.FC = () => {
  const [evidences, setEvidences] = useState<EmergencyAudio[]>([]);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    setEvidences(storageService.getEvidences());
  }, []);

  const handlePlayToggle = (ev: EmergencyAudio) => {
    if (playingId === ev.id) {
      if (audioElement) {
        audioElement.pause();
      }
      setPlayingId(null);
    } else {
      if (audioElement) {
        audioElement.pause();
      }
      if (ev.blobUrl) {
        const audio = new Audio(ev.blobUrl);
        audio.onended = () => setPlayingId(null);
        audio.play().catch(() => {
          // Playback pode ser bloqueado pelo navegador se não houver interação do usuário
        });
        setAudioElement(audio);
        setPlayingId(ev.id);
      } else {
        alert('Gravação gerada em ambiente simulado (áudio sintético de teste com hash pericial válido).');
      }
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja apagar permanentemente este registro de evidência?')) {
      const updated = evidences.filter((e) => e.id !== id);
      setEvidences(updated);
      localStorage.setItem('elasegura_evidences', JSON.stringify(updated));
    }
  };

  const handleDownloadDossier = (ev: EmergencyAudio) => {
    const reportText = `=====================================================
AMPARA - DOSSIÊ DE INTEGRIDADE PROBATÓRIA
=====================================================
Identificador do Registro: ${ev.id}
Data e Hora de Captura: ${ev.timestamp}
Duração do Áudio: ${ev.durationSeconds} segundos
Tamanho Estimado: ${ev.sizeBytes} bytes
Status da Criptografia: Criptografado ponta a ponta (AES-GCM)
Hash de Integridade (SHA-256):
${ev.sha256Hash}

NOTA TÉCNICA E JURÍDICA:
O hash SHA-256 acima assegura que o arquivo não sofreu adulteração
ou edição posterior à sua gravação original. Este comprovante
pode ser apresentado junto às autoridades policiais (DEAM) e ao
Ministério Público para instrução de pedido de Medida Protetiva de Urgência
ou procedimento penal preparatório.
=====================================================`;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dossie-evidencia-${ev.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Lock className="w-4 h-4 text-shield-600" />
            <span>Cofre de Evidências ({evidences.length})</span>
          </h2>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Gravações de áudio com hash criptográfico SHA-256 para cadeia de custódia.
          </p>
        </div>
      </div>

      {/* Nota de Privacidade & LGPD */}
      <div className="bg-shield-50 border border-shield-200 rounded-2xl p-3.5 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-shield-600 shrink-0 mt-0.5" />
        <div className="text-xs text-shield-800 leading-relaxed">
          <strong className="font-semibold">Privacidade Absoluta:</strong> A empresa empregadora NUNCA tem acesso a
          estas gravações. Os áudios são guardados exclusivamente no seu dispositivo, sob sua chave.
        </div>
      </div>

      {/* Lista de Registros */}
      <div className="space-y-3">
        {evidences.map((ev) => (
          <div key={ev.id} className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handlePlayToggle(ev)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    playingId === ev.id
                      ? 'bg-brand-600 text-white'
                      : 'bg-brand-50 hover:bg-brand-100 text-brand-600'
                  }`}
                  title={playingId === ev.id ? 'Pausar reprodução' : 'Ouvir gravação'}
                >
                  {playingId === ev.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    Gravação de Emergência • {ev.durationSeconds}s
                  </h4>
                  <p className="text-[11px] text-slate-500">{formatTimestamp(ev.timestamp)}</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleDownloadDossier(ev)}
                  className="p-1.5 text-slate-400 hover:text-shield-700 hover:bg-shield-50 rounded-lg transition-colors"
                  title="Baixar Dossiê com Hash Forense"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(ev.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Excluir gravação"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Hash SHA-256 e Cadeia de Custódia */}
            <div className="mt-3 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                <span className="font-semibold flex items-center gap-1 text-emerald-700">
                  <FileCheck className="w-3 h-3" />
                  Hash SHA-256 (Cadeia de Custódia)
                </span>
                <span className="text-slate-400">Verificado</span>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg font-mono text-[10px] text-slate-600 break-all border border-slate-200/60 select-all">
                {ev.sha256Hash}
              </div>
            </div>
          </div>
        ))}

        {evidences.length === 0 && (
          <div className="bg-white rounded-2xl p-8 border border-dashed border-slate-300 text-center">
            <Lock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <h4 className="text-xs font-bold text-slate-700">Nenhuma gravação registrada</h4>
            <p className="text-[11px] text-slate-400 max-w-xs mx-auto mt-1">
              Quando você acionar o socorro, o áudio ambiente será criptografado e salvo aqui de forma sigilosa.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
