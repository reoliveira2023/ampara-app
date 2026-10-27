import React, { useState } from 'react';
import { 
  AlertTriangle, 
  MapPin, 
  CheckCircle, 
  ExternalLink, 
  Check, 
  Sparkles,
  MessageSquare,
  Volume2,
  Play,
  Pause,
  Radio
} from 'lucide-react';
import type { SosAlert, TrustedContact } from '../../types';

interface ContactAlertViewProps {
  activeAlert: SosAlert | null;
  currentContact: TrustedContact;
  allContacts?: TrustedContact[];
  onSelectContact?: (c: TrustedContact) => void;
  onAcceptHelp: () => void;
  onDeclineHelp: () => void;
}

export const ContactAlertView: React.FC<ContactAlertViewProps> = ({
  activeAlert,
  currentContact,
  allContacts = [],
  onSelectContact,
  onAcceptHelp,
  onDeclineHelp,
}) => {
  const [hasAcknowledged, setHasAcknowledged] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioEl, setAudioEl] = useState<HTMLAudioElement | null>(null);

  const isAlertActive = !!activeAlert && activeAlert.active;

  const handleIAmOnTheWay = () => {
    setHasAcknowledged(true);
    onAcceptHelp();
  };

  const handleCantAttend = () => {
    onDeclineHelp();
  };

  // Áudio capturado durante a emergência
  const latestAudio = activeAlert?.audioRecordings && activeAlert.audioRecordings.length > 0
    ? activeAlert.audioRecordings[0]
    : null;

  const toggleAudioPlayback = () => {
    if (isPlayingAudio) {
      if (audioEl) audioEl.pause();
      setIsPlayingAudio(false);
    } else {
      if (latestAudio?.blobUrl) {
        const audio = new Audio(latestAudio.blobUrl);
        audio.onended = () => setIsPlayingAudio(false);
        audio.play().catch((err) => console.log('Audio playback prevented', err));
        setAudioEl(audio);
        setIsPlayingAudio(true);
      } else {
        alert('Áudio ambiente sendo capturado em tempo real no dispositivo da colaboradora.');
      }
    }
  };

  const mapUrl = activeAlert?.location
    ? `https://www.google.com/maps?q=${activeAlert.location.lat},${activeAlert.location.lng}`
    : 'https://maps.google.com';

  return (
    <div className="max-w-md mx-auto p-4 space-y-4 font-sans">
      {/* Seletor do Contato para Simulação (caso haja múltiplos contatos) */}
      {allContacts.length > 1 && onSelectContact && (
        <div className="bg-white rounded-2xl p-2.5 border border-slate-200 shadow-2xs flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">Simular celular de:</span>
          <div className="flex gap-1">
            {allContacts.map((c) => (
              <button
                key={c.id}
                onClick={() => onSelectContact(c)}
                className={`px-2 py-1 rounded-lg font-bold text-[11px] transition-all ${
                  c.id === currentContact.id
                    ? 'bg-shield-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {c.order}º {c.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Banner de Identificação do Contato */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-md flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-bold text-brand-300 tracking-wider">
            Simulação: Tela do Contato de Confiança
          </span>
          <h2 className="text-sm font-bold text-white mt-0.5">
            Olá, {currentContact.name} ({currentContact.relationship})
          </h2>
          <p className="text-[11px] text-slate-400">Tel: {currentContact.phone}</p>
        </div>
        <div className="w-9 h-9 rounded-full bg-brand-500/20 text-brand-300 flex items-center justify-center font-bold text-xs border border-brand-400/30">
          {currentContact.order}º
        </div>
      </div>

      {isAlertActive ? (
        <div className="bg-rose-50 border-2 border-rose-400 rounded-3xl p-5 shadow-lg space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-wider">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
              <span>Alerta Discreto em Tempo Real</span>
            </div>
            <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
              Escalonando: {activeAlert.escalationTimerSeconds}s
            </span>
          </div>

          {/* SIMULAÇÃO DA MENSAGEM SMS/WHATSAPP QUE CHEGOU NO CELULAR */}
          <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-3 text-xs space-y-1.5 shadow-2xs">
            <div className="flex items-center justify-between text-emerald-800 font-bold text-[11px]">
              <span className="flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                <span>Mensagem Recebida via WhatsApp / SMS</span>
              </span>
              <span className="text-[10px] text-emerald-600 font-normal">Agora mesmo</span>
            </div>
            <p className="text-emerald-950 text-xs bg-white/70 p-2 rounded-xl leading-relaxed">
              "🚨 <strong>[AMPARA]</strong> Sua amiga acionou a rede de apoio. Ela precisa de presença ou contato discreto. 
              Clique aqui para ver a localização e instruções seguras."
            </p>
          </div>

          <div className="text-center py-1">
            <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-2 animate-bounce">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900">
              Sua amiga solicitou apoio discreto
            </h3>
            <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto">
              Ela pode estar em uma situação tensa ou de risco. Sua presença amigável despretensiosa pode interromper a tensão.
            </p>
          </div>

          {/* Localização da Vítima */}
          <div className="bg-white rounded-2xl p-4 border border-rose-200 space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-600" />
                <span>Localização em Tempo Real</span>
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                Precisão: 12 metros
              </span>
            </div>
            <p className="text-xs text-slate-700 font-medium">
              {activeAlert?.location?.addressDescription || 'Av. Paulista, 1200 - São Paulo, SP'}
            </p>
            <a
              href={mapUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-shield-700 hover:text-shield-900 pt-1"
            >
              <span>Abrir no Google Maps / Traçar rota</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* PLAYER DO ÁUDIO AMBIENTE GRAVADO LOCALMENTE */}
          <div className="bg-white rounded-2xl p-4 border border-rose-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-brand-600" />
                <span>Áudio Ambiente Transmitido</span>
              </span>
              <span className="text-[10px] text-brand-600 font-semibold bg-brand-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Radio className="w-2.5 h-2.5 animate-pulse" />
                Microfone Local
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Ouça o áudio gravado no ambiente da colaboradora para avaliar a situação antes de agir:
            </p>

            <button
              onClick={toggleAudioPlayback}
              className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                isPlayingAudio 
                  ? 'bg-rose-600 text-white shadow-xs' 
                  : 'bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200'
              }`}
            >
              {isPlayingAudio ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Pausar Reprodução do Áudio</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 ml-0.5" />
                  <span>{latestAudio ? `Ouvir Gravação Local (${latestAudio.durationSeconds}s)` : 'Ouvir Áudio Ambiente Capturado'}</span>
                </>
              )}
            </button>
          </div>

          {/* Orientações Cruciais de Intervenção */}
          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
            <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Orientações para Agir com Segurança</span>
            </h4>
            <ul className="text-xs text-amber-950 space-y-1.5 list-disc list-inside">
              <li>Ligue para ela com um pretexto cotidiano ("Você viu onde deixei o livro?").</li>
              <li>Bata à porta com naturalidade (ex: pedir açúcar, sal ou ajuda com uma entrega).</li>
              <li>Não mencione este alerta nem confronte agressivamente o agressor.</li>
              <li>Se escutar barulhos de violência extrema, ligue imediatamente 190.</li>
            </ul>
          </div>

          {/* Ações do Contato */}
          <div className="space-y-2 pt-1">
            {!hasAcknowledged ? (
              <>
                <button
                  onClick={handleIAmOnTheWay}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-98"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Estou a Caminho / Assumi o Apoio!</span>
                </button>

                <button
                  onClick={handleCantAttend}
                  className="w-full py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold text-xs rounded-xl transition-all"
                >
                  Não posso responder agora (Escalar p/ próximo contato)
                </button>
              </>
            ) : (
              <div className="bg-emerald-600 text-white p-3.5 rounded-xl text-center text-xs font-bold flex items-center justify-center gap-2 shadow-xs">
                <Check className="w-4 h-4" />
                <span>Você confirmou apoio! A colaboradora já foi informada que você está a caminho.</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* SEM ALERTA ATIVO */
        <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center shadow-xs space-y-4">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">Rede de Confiança Ativa</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              Você está cadastrado(a) como contato de confiança {currentContact.order}º. 
              Quando sua amiga acionar o Ampara, você receberá um SMS/WhatsApp imediato com localização e instruções.
            </p>
          </div>

          <div className="text-left bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs space-y-1">
            <span className="font-bold text-slate-700 block">Sua instrução de aproximação pré-combinada:</span>
            <p className="text-slate-600 italic">"{currentContact.notes || 'Ligar com pretexto amigável ou bater na porta.'}"</p>
          </div>
        </div>
      )}
    </div>
  );
};
