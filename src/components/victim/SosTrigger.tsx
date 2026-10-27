import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Mic, 
  MapPin, 
  X, 
  Clock, 
  Radio, 
  Volume2, 
  ShieldCheck
} from 'lucide-react';
import type { 
  SosAlert, 
  TrustedContact, 
  ExternalSupportPartner, 
  UserSecurityConfig 
} from '../../types';
import { audioRecorderService } from '../../services/audioRecorder';
import { storageService } from '../../services/storage';

interface SosTriggerProps {
  userConfig: UserSecurityConfig;
  contacts: TrustedContact[];
  partners: ExternalSupportPartner[];
  activeAlert: SosAlert | null;
  onUpdateAlert: (alert: SosAlert | null) => void;
  onSimulateContactView?: (contact: TrustedContact) => void;
}

export const SosTrigger: React.FC<SosTriggerProps> = ({
  userConfig,
  contacts,
  partners,
  activeAlert,
  onUpdateAlert,
  onSimulateContactView,
}) => {
  const [countdown, setCountdown] = useState<number | null>(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [keywordStatus, setKeywordStatus] = useState<string>('Inativo');
  const [simulatedAddress, setSimulatedAddress] = useState<string>('Av. Paulista, 1200 - Bela Vista, São Paulo - SP');
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  // Escalonamento em tempo real
  useEffect(() => {
    let timer: number | null = null;
    if (activeAlert && activeAlert.active) {
      timer = window.setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);

        onUpdateAlert({
          ...activeAlert,
          escalationTimerSeconds: Math.max(0, activeAlert.escalationTimerSeconds - 1),
        });

        // Se o contador do contato atual zerar, escala para o próximo
        if (activeAlert.escalationTimerSeconds <= 1) {
          const nextIndex = activeAlert.currentStepIndex + 1;
          const maxSteps = contacts.length + 1; // contatos + parceiro externo

          if (nextIndex < maxSteps) {
            onUpdateAlert({
              ...activeAlert,
              currentStepIndex: nextIndex,
              escalationTimerSeconds: activeAlert.stepTimeoutSeconds,
              responseStatus: 'escalated',
            });
          }
        }
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [activeAlert, contacts.length, onUpdateAlert]);

  // Capturar geolocalização ao iniciar
  const captureLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setSimulatedAddress(`Lat: ${pos.coords.latitude.toFixed(4)}, Lng: ${pos.coords.longitude.toFixed(4)} (Precisão: ${Math.round(pos.coords.accuracy)}m)`);
        },
        () => {
          // Fallback seguro de geolocalização
          setCoords({ lat: -23.561684, lng: -46.655981 });
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      setCoords({ lat: -23.561684, lng: -46.655981 });
    }
  };

  const startSosCountdown = () => {
    captureLocation();
    setCountdown(3);
    const interval = window.setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          window.clearInterval(interval);
          triggerRealSos();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const cancelCountdown = () => {
    setCountdown(null);
  };

  const triggerRealSos = async () => {
    // Iniciar gravação de áudio real com Web Audio API
    await audioRecorderService.startRecording();

    const newAlert: SosAlert = {
      id: 'alert-' + Date.now(),
      active: true,
      startedAt: new Date().toISOString(),
      location: {
        lat: coords?.lat || -23.561684,
        lng: coords?.lng || -46.655981,
        accuracy: 12,
        addressDescription: simulatedAddress,
      },
      currentStepIndex: 0,
      escalationTimerSeconds: 60, // 60 segundos por contato para visualização rápida no MVP
      stepTimeoutSeconds: 60,
      responseStatus: 'pending',
      audioRecordings: [],
    };

    onUpdateAlert(newAlert);
    storageService.saveActiveAlert(newAlert);
  };

  const stopSos = async () => {
    // Parar gravação de áudio e calcular hash SHA-256
    const recordedAudio = await audioRecorderService.stopRecording();
    if (recordedAudio) {
      storageService.addEvidence(recordedAudio);
    }

    if (activeAlert) {
      const finishedAlert: SosAlert = {
        ...activeAlert,
        active: false,
        responseStatus: 'safe',
      };
      onUpdateAlert(finishedAlert);
      storageService.saveActiveAlert(finishedAlert);
    }
  };

  // Simular gatilho de palavra-chave por voz
  const toggleSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setKeywordStatus('Navegador sem suporte nativo à voz');
      return;
    }

    try {
      // @ts-expect-error Web Speech API vendor prefix
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.lang = 'pt-BR';
      recognition.interimResults = false;

      recognition.onstart = () => {
        setKeywordStatus('Ouvindo palavra-chave...');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
        if (transcript.includes(userConfig.keywordTrigger.toLowerCase())) {
          recognition.stop();
          triggerRealSos();
        }
      };

      recognition.onerror = () => {
        setKeywordStatus('Erro ao escutar');
      };

      recognition.start();
    } catch {
      setKeywordStatus('Não foi possível ativar microfone');
    }
  };

  const sortedContacts = [...contacts].sort((a, b) => a.order - b.order);
  const activeStep = activeAlert?.currentStepIndex ?? 0;
  const currentEscalatedContact = sortedContacts[activeStep];
  const authorizedPartner = partners.find(p => p.authorizedByUser) || partners[0];

  return (
    <div className="space-y-5">
      {/* CARD DO BOTÃO PRINCIPAL DE SOS OU STATUS ATIVO */}
      {!activeAlert || !activeAlert.active ? (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 text-center relative overflow-hidden">
          <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 bg-shield-50 text-shield-700 rounded-full text-[11px] font-semibold border border-shield-200">
            <Radio className="w-3 h-3 text-shield-600 animate-pulse" />
            <span>Rede Pronta</span>
          </div>

          <h2 className="text-lg font-bold text-slate-800 mb-1">Acionamento de Apoio</h2>
          <p className="text-xs text-slate-500 max-w-xs mx-auto mb-6">
            Em situação de risco ou desconforto, acione para alertar discretamente seus contatos de confiança.
          </p>

          {/* Modal / Overlay da Contagem Regressiva de Cancelamento (3s) */}
          {countdown !== null ? (
            <div className="py-4">
              <div className="w-28 h-28 mx-auto rounded-full bg-rose-50 border-4 border-rose-500 flex flex-col items-center justify-center animate-pulse mb-4">
                <span className="text-4xl font-extrabold text-rose-600">{countdown}</span>
                <span className="text-[10px] text-rose-500 font-semibold uppercase tracking-wider">segundos</span>
              </div>
              <p className="text-xs text-rose-600 font-medium mb-4">
                Iniciando gravação silenciosa e alerta aos contatos...
              </p>
              <button
                onClick={cancelCountdown}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-full transition-all active:scale-95"
              >
                <X className="w-4 h-4" />
                <span>Cancelar Acionamento Falso</span>
              </button>
            </div>
          ) : (
            <div>
              <button
                onClick={startSosCountdown}
                className="w-36 h-36 mx-auto rounded-full bg-gradient-to-tr from-brand-600 via-rose-500 to-pink-500 text-white shadow-xl shadow-brand-500/30 hover:shadow-brand-500/50 hover:scale-105 active:scale-95 transition-all flex flex-col items-center justify-center p-3 select-none group"
              >
                <AlertTriangle className="w-10 h-10 mb-1.5 group-hover:animate-bounce" />
                <span className="text-sm font-bold uppercase tracking-wider">Acionar</span>
                <span className="text-[11px] opacity-90 font-medium">Apoio Silencioso</span>
              </button>
              <p className="text-[11px] text-slate-400 mt-4">
                Não gera sirene nem barulho no seu celular.
              </p>
            </div>
          )}
        </div>
      ) : (
        /* ALERTA ATIVO - PAINEL DE CONTROLE EM TEMPO REAL */
        <div className="bg-rose-50 border-2 border-rose-400 rounded-3xl p-5 shadow-lg relative overflow-hidden animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-rose-200">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-600 animate-ping" />
              <h3 className="font-bold text-rose-900 text-sm uppercase tracking-wide">
                Alerta de Apoio em Andamento
              </h3>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-rose-700 bg-rose-100 px-2.5 py-1 rounded-full">
              <Clock className="w-3.5 h-3.5" />
              <span>{Math.floor(recordingSeconds / 60)}:{(recordingSeconds % 60).toString().padStart(2, '0')}</span>
            </div>
          </div>

          {/* Gravação e Localização */}
          <div className="grid grid-cols-2 gap-2 my-3 text-xs">
            <div className="bg-white/80 p-2.5 rounded-xl border border-rose-200 flex items-center gap-2">
              <Mic className="w-4 h-4 text-rose-600 animate-pulse" />
              <div>
                <span className="font-semibold block text-slate-800">Gravação Silenciosa</span>
                <span className="text-[10px] text-slate-500">Criptografia AES em curso</span>
              </div>
            </div>

            <div className="bg-white/80 p-2.5 rounded-xl border border-rose-200 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-600" />
              <div>
                <span className="font-semibold block text-slate-800">Localização Ativa</span>
                <span className="text-[10px] text-slate-500 truncate block max-w-[120px]">
                  {simulatedAddress}
                </span>
              </div>
            </div>
          </div>

          {/* Indicador do Contato que está sendo acionado agora */}
          <div className="bg-white p-3.5 rounded-2xl border border-rose-200 mb-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">Etapa do Escalonamento:</span>
              <span className="text-xs font-bold text-rose-600">
                Próximo em: {activeAlert.escalationTimerSeconds}s
              </span>
            </div>

            {activeStep < sortedContacts.length ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-sm">
                  {currentEscalatedContact?.order}º
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-slate-900">{currentEscalatedContact?.name}</h4>
                  <p className="text-[11px] text-slate-500">{currentEscalatedContact?.relationship} • {currentEscalatedContact?.phone}</p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    Aguardando resposta
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                  ONG
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-slate-900">{authorizedPartner.name}</h4>
                  <p className="text-[11px] text-slate-500">Parceiro Externo Autorizado ({authorizedPartner.phone})</p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                    Escalonamento Máximo
                  </span>
                </div>
              </div>
            )}

            {/* BOTÃO PARA SIMULAR O CELULAR DO CONTATO IMEDIATAMENTE */}
            {onSimulateContactView && currentEscalatedContact && (
              <button
                onClick={() => onSimulateContactView(currentEscalatedContact)}
                className="w-full py-2 bg-shield-50 hover:bg-shield-100 text-shield-800 text-xs font-bold rounded-xl border border-shield-200 transition-all flex items-center justify-center gap-1.5"
              >
                <span>📲 Ver Alerta e Áudio no Celular de {currentEscalatedContact.name.split(' ')[0]}</span>
              </button>
            )}
          </div>

          {/* Botão de Encerramento Seguro */}
          <button
            onClick={stopSos}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-98"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Estou em Segurança (Encerrar e Salvar Evidência)</span>
          </button>
        </div>
      )}

      {/* LINHA DO TEMPO DO ESCALONAMENTO DE APOIO */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-shield-600" />
            <span>Escalonamento de Contatos</span>
          </h3>
          <span className="text-[11px] text-slate-400">Tempo limite: 60s por pessoa</span>
        </div>

        <div className="space-y-2.5">
          {sortedContacts.map((contact, idx) => {
            const isCurrent = activeAlert?.active && activeStep === idx;
            const isPassed = activeAlert?.active && activeStep > idx;

            return (
              <div
                key={contact.id}
                className={`p-2.5 rounded-xl border transition-all flex items-center justify-between ${
                  isCurrent
                    ? 'border-brand-500 bg-brand-50/70 shadow-xs'
                    : isPassed
                    ? 'border-slate-200 bg-slate-50 opacity-60'
                    : 'border-slate-100 bg-white hover:border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    isCurrent
                      ? 'bg-brand-600 text-white animate-pulse'
                      : isPassed
                      ? 'bg-slate-300 text-slate-600'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {contact.order}
                  </span>
                  <div>
                    <h5 className="text-xs font-bold text-slate-800">{contact.name}</h5>
                    <p className="text-[10px] text-slate-500">{contact.relationship} • {contact.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isCurrent && (
                    <span className="text-[10px] font-bold text-brand-600 bg-brand-100/80 px-2 py-0.5 rounded-full animate-pulse">
                      Notificando agora
                    </span>
                  )}
                  {isPassed && (
                    <span className="text-[10px] text-slate-400 font-medium">
                      Sem resposta (escalou)
                    </span>
                  )}
                  {!activeAlert?.active && (
                    <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                      Confirmado
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {/* Parceiro Externo no final da esteira */}
          <div className={`p-2.5 rounded-xl border border-dashed transition-all flex items-center justify-between ${
            activeAlert?.active && activeStep >= sortedContacts.length
              ? 'border-indigo-500 bg-indigo-50'
              : 'border-slate-200 bg-slate-50/50'
          }`}>
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-bold">
                EXT
              </span>
              <div>
                <h5 className="text-xs font-bold text-slate-800">{authorizedPartner.name}</h5>
                <p className="text-[10px] text-slate-500">Último nível (Parceiro de Apoio Externo)</p>
              </div>
            </div>
            <span className="text-[10px] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full font-semibold">
              Autorizado
            </span>
          </div>
        </div>
      </div>

      {/* GATILHOS ALTERNATIVOS (Voz por Palavra-Chave, Botão de Energia) */}
      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Volume2 className="w-3.5 h-3.5 text-slate-500" />
          <span>Gatilhos Alternativos Rápidos</span>
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {/* Palavra-chave */}
          <button
            onClick={toggleSpeechRecognition}
            className="p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-left transition-all active:scale-98 shadow-xs"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-800">Palavra-Chave</span>
              <Mic className="w-3.5 h-3.5 text-shield-600" />
            </div>
            <p className="text-[10px] text-slate-500 mb-1">Gatilho: "{userConfig.keywordTrigger}"</p>
            <span className="text-[9px] font-semibold text-shield-700 bg-shield-50 px-1.5 py-0.5 rounded inline-block">
              {keywordStatus}
            </span>
          </button>

          {/* Botão de Energia Simulado */}
          <button
            onClick={triggerRealSos}
            className="p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-left transition-all active:scale-98 shadow-xs"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-800">Gatilho de Botão</span>
              <Radio className="w-3.5 h-3.5 text-rose-500" />
            </div>
            <p className="text-[10px] text-slate-500 mb-1">5x botão liga/desliga</p>
            <span className="text-[9px] font-semibold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded inline-block">
              Simular Toque 5x
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
