import React, { useState } from 'react';
import { 
  Building2, 
  FileText, 
  CreditCard, 
  Clock, 
  Bell, 
  HelpCircle, 
  CheckCircle2, 
  Lock, 
  KeyRound, 
  Sparkles,
  Briefcase,
  Layers
} from 'lucide-react';
import type { UserSecurityConfig, WhiteLabelConfig } from '../../types';

interface CamouflageAppProps {
  userConfig: UserSecurityConfig;
  whiteLabel: WhiteLabelConfig;
  onUnlockRealApp: () => void;
  onTriggerSilentSosFromDisguise: () => void;
  onSosTriggeredFeedback?: string;
}

export const CamouflageApp: React.FC<CamouflageAppProps> = ({
  userConfig,
  whiteLabel,
  onUnlockRealApp,
  onTriggerSilentSosFromDisguise,
  onSosTriggeredFeedback,
}) => {
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [secretTapCount, setSecretTapCount] = useState(0);
  const [activeCorporateTab, setActiveCorporateTab] = useState<'holerite' | 'beneficios' | 'ponto' | 'comunicados'>('holerite');
  const [isFakeVaultOpen, setIsFakeVaultOpen] = useState(false);
  const [sosHoldProgress, setSosHoldProgress] = useState(0);
  const [sosHoldTimer, setSosHoldTimer] = useState<number | null>(null);

  // Gatilho Secreto: 3 toques no logo da empresa abrem o prompt de PIN
  const handleLogoTap = () => {
    const next = secretTapCount + 1;
    setSecretTapCount(next);
    if (next >= 3) {
      setSecretTapCount(0);
      setShowPinModal(true);
    }
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === userConfig.realPin) {
      setShowPinModal(false);
      setPinInput('');
      onUnlockRealApp();
    } else if (pinInput === userConfig.fakePin) {
      // PIN falso: Abre um comprovante/extrato corporativo inofensivo
      setShowPinModal(false);
      setPinInput('');
      setIsFakeVaultOpen(true);
    } else {
      setPinError(true);
      setTimeout(() => setPinError(false), 2000);
    }
  };

  // Pressionar por 3s o botão de ajuda corporativa ativa o SOS Silencioso
  const handleSosHoldStart = () => {
    let progress = 0;
    const interval = window.setInterval(() => {
      progress += 10;
      setSosHoldProgress(progress);
      if (progress >= 100) {
        window.clearInterval(interval);
        setSosHoldProgress(0);
        onTriggerSilentSosFromDisguise();
      }
    }, 150);
    setSosHoldTimer(interval);
  };

  const handleSosHoldEnd = () => {
    if (sosHoldTimer) {
      window.clearInterval(sosHoldTimer);
      setSosHoldTimer(null);
    }
    setSosHoldProgress(0);
  };

  const getLogoIcon = () => {
    switch (whiteLabel.logoIcon) {
      case 'briefcase':
        return <Briefcase className="w-5 h-5 text-white" />;
      case 'layers':
        return <Layers className="w-5 h-5 text-white" />;
      case 'sparkles':
        return <Sparkles className="w-5 h-5 text-white" />;
      case 'building':
      default:
        return <Building2 className="w-5 h-5 text-white" />;
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-50 flex flex-col shadow-xl border-x border-slate-200">
      {/* Feedback silencioso discreto se SOS foi acionado */}
      {onSosTriggeredFeedback && (
        <div className="bg-emerald-600 text-white text-xs px-3 py-1.5 text-center flex items-center justify-center gap-1.5 transition-all">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{onSosTriggeredFeedback}</span>
        </div>
      )}

      {/* CABEÇALHO WHITE LABEL DA EMPRESA (Totalmente camuflado como app oficial de RH) */}
      <header 
        style={{ backgroundColor: whiteLabel.brandColor || '#1e3a8a' }}
        className="text-white px-4 py-3.5 flex items-center justify-between sticky top-0 z-10 shadow-sm"
      >
        <div 
          onClick={handleLogoTap} 
          className="flex items-center gap-2.5 cursor-pointer select-none"
          title="Toque 3 vezes no logo para abrir a área protegida"
        >
          <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center border border-white/30">
            {getLogoIcon()}
          </div>
          <div>
            <h1 className="text-sm font-bold leading-tight">{whiteLabel.appPublicName}</h1>
            <p className="text-[10px] text-white/80 leading-none">{whiteLabel.companyName}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Botão de Notificações RH inofensivo */}
          <button 
            onClick={() => setShowPinModal(true)}
            className="p-2 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-colors"
            title="Acesso Seguro do Colaborador"
          >
            <Lock className="w-4 h-4" />
          </button>

          {/* Botão de Suporte/FAQ que camufla o gatilho SOS ao segurar por 3s */}
          <button
            onMouseDown={handleSosHoldStart}
            onMouseUp={handleSosHoldEnd}
            onTouchStart={handleSosHoldStart}
            onTouchEnd={handleSosHoldEnd}
            className="relative p-2 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-all select-none"
            title="Suporte RH (Segure 3s para sincronizar ponto)"
          >
            <HelpCircle className="w-4 h-4" />
            {sosHoldProgress > 0 && (
              <span 
                className="absolute inset-0 rounded-full border-2 border-white opacity-80 animate-spin" 
                style={{ clipPath: `inset(0 ${100 - sosHoldProgress}% 0 0)` }}
              />
            )}
          </button>
        </div>
      </header>

      {/* NAVEGAÇÃO DE ABAS CORPORATIVAS (Holerite, Benefícios, Ponto, Comunicados) */}
      <div className="bg-white border-b border-slate-200 px-2 flex justify-around text-xs shadow-2xs">
        <button
          onClick={() => setActiveCorporateTab('holerite')}
          className={`py-2.5 px-3 font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
            activeCorporateTab === 'holerite'
              ? 'border-slate-800 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Holerite</span>
        </button>

        <button
          onClick={() => setActiveCorporateTab('beneficios')}
          className={`py-2.5 px-3 font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
            activeCorporateTab === 'beneficios'
              ? 'border-slate-800 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Benefícios</span>
        </button>

        <button
          onClick={() => setActiveCorporateTab('ponto')}
          className={`py-2.5 px-3 font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
            activeCorporateTab === 'ponto'
              ? 'border-slate-800 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Ponto</span>
        </button>

        <button
          onClick={() => setActiveCorporateTab('comunicados')}
          className={`py-2.5 px-3 font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
            activeCorporateTab === 'comunicados'
              ? 'border-slate-800 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>Notícias</span>
        </button>
      </div>

      {/* CONTEÚDO CAMUFLADO DO PORTAL CORPORATIVO */}
      <main className="p-4 flex-1 flex flex-col space-y-4">
        {activeCorporateTab === 'holerite' && (
          <div className="space-y-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Comprovante de Pagamento</span>
                  <h3 className="text-sm font-bold text-slate-800">Competência Outubro / 2026</h3>
                </div>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Creditado
                </span>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Salário Base Mensal:</span>
                  <span className="font-semibold text-slate-800">R$ 5.420,00</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Desconto INSS (14%):</span>
                  <span>- R$ 640,20</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Vale Transporte / Alimentação:</span>
                  <span>- R$ 180,00</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 pt-2 border-t border-slate-100 text-sm">
                  <span>Líquido a Receber:</span>
                  <span className="text-emerald-600">R$ 4.599,80</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-100 rounded-xl p-3 text-xs text-slate-500 border border-slate-200 flex items-center justify-between">
              <span>Informe de Rendimentos IRPF 2026</span>
              <span className="text-blue-600 font-semibold cursor-pointer">Baixar PDF</span>
            </div>
          </div>
        )}

        {activeCorporateTab === 'beneficios' && (
          <div className="space-y-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Cartões Ativos</h4>
              <div className="space-y-2 text-xs">
                <div className="p-3 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-xl shadow-xs">
                  <div className="flex justify-between items-center text-[11px] opacity-80">
                    <span>Vale Alimentação & Refeição</span>
                    <span>Pluxee / Alelo</span>
                  </div>
                  <div className="mt-2 text-lg font-black tracking-wide">R$ 842,50</div>
                  <div className="text-[10px] opacity-80 mt-1">Saldo atual disponível</div>
                </div>

                <div className="p-3 bg-gradient-to-r from-blue-700 to-indigo-800 text-white rounded-xl shadow-xs">
                  <div className="flex justify-between items-center text-[11px] opacity-80">
                    <span>Plano de Saúde Unimed Nacional</span>
                    <span>Apartamento</span>
                  </div>
                  <div className="mt-1 font-bold">Titular + Dependentes</div>
                  <div className="text-[10px] opacity-80 mt-1">Carteirinha Virtual: 0842.9912.8312-00</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeCorporateTab === 'ponto' && (
          <div className="space-y-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Espelho de Ponto Digital</h4>
                <span className="text-[10px] text-slate-400">Hoje, 21 de Outubro</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5 text-center text-xs pt-2">
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 block">Entrada</span>
                  <span className="font-bold text-slate-800">08:58</span>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 block">Almoço</span>
                  <span className="font-bold text-slate-800">12:05</span>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 block">Retorno</span>
                  <span className="font-bold text-slate-800">13:08</span>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 block">Saída</span>
                  <span className="font-bold text-slate-400">--:--</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeCorporateTab === 'comunicados' && (
          <div className="space-y-2.5">
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">Gente & Cultura</span>
              <h5 className="text-xs font-bold text-slate-800">Inscrições abertas para o Programa de Mentoria 2027</h5>
              <p className="text-[11px] text-slate-500">Desenvolva novas competências com lideranças de várias áreas da empresa.</p>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">Benefícios</span>
              <h5 className="text-xs font-bold text-slate-800">Parceria Gympass e Bem-Estar Mental</h5>
              <p className="text-[11px] text-slate-500">Acesse academias e sessões de terapia com coparticipação subsidiada.</p>
            </div>
          </div>
        )}

        {/* Rodapé discreto com dica para a usuária */}
        <div className="mt-auto bg-slate-100 rounded-xl p-3 text-center text-xs text-slate-400 border border-slate-200">
          <p className="flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Dica de segurança: Toque 3 vezes no logo superior para desbloquear o Ampara.</span>
          </p>
        </div>
      </main>

      {/* Modal do PIN (Verdadeiro ou Falso) */}
      {showPinModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-xs w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="text-center mb-4">
              <div 
                style={{ backgroundColor: `${whiteLabel.brandColor}15`, color: whiteLabel.brandColor }}
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2"
              >
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">Autenticação do Colaborador</h3>
              <p className="text-xs text-slate-500 mt-1">Digite o PIN numérico pessoal de segurança.</p>
            </div>

            <form onSubmit={handlePinSubmit} className="space-y-4">
              <div>
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={6}
                  autoFocus
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="• • • •"
                  className="w-full text-center tracking-[0.5em] text-xl font-mono py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-800 focus:bg-white"
                />
                {pinError && (
                  <p className="text-xs text-rose-500 text-center mt-1.5 font-medium">
                    PIN incorreto. Tente novamente.
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowPinModal(false);
                    setPinInput('');
                  }}
                  className="flex-1 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{ backgroundColor: whiteLabel.brandColor || '#1e3a8a' }}
                  className="flex-1 py-2 text-xs font-semibold text-white rounded-xl transition-opacity hover:opacity-90"
                >
                  Confirmar
                </button>
              </div>

              <div className="text-[11px] text-slate-400 text-center pt-2 border-t border-slate-100">
                <span>PIN Real: <code className="bg-slate-100 px-1 rounded text-slate-600">{userConfig.realPin}</code></span>
                <span className="mx-1.5">•</span>
                <span>PIN Falso: <code className="bg-slate-100 px-1 rounded text-slate-600">{userConfig.fakePin}</code></span>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cofre Falso Corporativo (Exibido quando o PIN falso é digitado para enganar o agressor) */}
      {isFakeVaultOpen && (
        <div className="fixed inset-0 bg-white z-40 flex flex-col p-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b pb-3 mb-4">
            <h3 className="font-bold text-slate-800 text-sm">Extrato do FGTS e Banco de Horas</h3>
            <button
              onClick={() => setIsFakeVaultOpen(false)}
              className="text-xs text-slate-500 hover:text-slate-800 font-semibold px-2 py-1 bg-slate-100 rounded-md"
            >
              Fechar
            </button>
          </div>
          <div className="space-y-3 flex-1 overflow-y-auto text-xs text-slate-600">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-semibold block text-slate-700 mb-1">Saldo FGTS Acumulado</span>
              <p className="text-base font-bold text-slate-800">R$ 14.892,40</p>
              <span className="text-[10px] text-slate-400">Depósito regular efetuado em 07/10/2026</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-semibold block text-slate-700 mb-1">Banco de Horas Positivo</span>
              <p className="text-base font-bold text-slate-800">+ 08h 45min</p>
              <span className="text-[10px] text-slate-400">Válido para compensação até Dezembro/2026</span>
            </div>
          </div>
          <p className="text-[11px] text-center text-slate-400 py-2">
            Este é o app de fachada corporativo ativado pelo PIN falso. Nenhum dado do Ampara é exposto aqui.
          </p>
        </div>
      )}
    </div>
  );
};
