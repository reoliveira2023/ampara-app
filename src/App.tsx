import { useState, useEffect } from 'react';
import { 
  Shield, 
  Smartphone, 
  Users, 
  Building2, 
  Scale, 
  EyeOff, 
  AlertTriangle, 
  BookOpen, 
  Lock, 
  Sliders, 
  CheckCircle,
  MessageSquare,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import type { 
  PersonaMode, 
  UserSecurityConfig, 
  TrustedContact, 
  SosAlert, 
  ExternalSupportPartner, 
  CorporateMetrics,
  WhiteLabelConfig
} from './types';
import { storageService } from './services/storage';
import { CamouflageApp } from './components/camouflaged/CamouflageApp';
import { SosTrigger } from './components/victim/SosTrigger';
import { ContactsManager } from './components/victim/ContactsManager';
import { ProtectionNetwork } from './components/victim/ProtectionNetwork';
import { EvidenceVault } from './components/victim/EvidenceVault';
import { DisguiseSettings } from './components/victim/DisguiseSettings';
import { ContactAlertView } from './components/contact/ContactAlertView';
import { CorporateDashboard } from './components/rh/CorporateDashboard';
import { TransparencyAudit } from './components/common/TransparencyAudit';
import { QuickExitButton } from './components/common/QuickExitButton';

export function App() {
  const [persona, setPersona] = useState<PersonaMode>('colaboradora');
  const [activeTab, setActiveTab] = useState<'sos' | 'contatos' | 'rede' | 'evidencias' | 'disfarce'>('sos');
  const [isCamouflageActive, setIsCamouflageActive] = useState<boolean>(false);
  const [showJourneyGuide, setShowJourneyGuide] = useState<boolean>(false);
  
  // Dados persistidos
  const [userConfig, setUserConfig] = useState<UserSecurityConfig>(storageService.getUserConfig());
  const [whiteLabel, setWhiteLabel] = useState<WhiteLabelConfig>(storageService.getWhiteLabel());
  const [contacts, setContacts] = useState<TrustedContact[]>(storageService.getContacts());
  const [partners] = useState<ExternalSupportPartner[]>(storageService.getPartners());
  const [activeAlert, setActiveAlert] = useState<SosAlert | null>(storageService.getActiveAlert());
  const [metrics] = useState<CorporateMetrics>(storageService.getCorporateMetrics());
  const [disguiseFeedback, setDisguiseFeedback] = useState<string | undefined>(undefined);

  // Contato selecionado para a simulação da visão externa
  const [selectedContact, setSelectedContact] = useState<TrustedContact>(
    contacts[0] || {
      id: 'c1',
      name: 'Mariana Silva (Vizinha)',
      phone: '(11) 98123-4567',
      relationship: 'Vizinha do mesmo andar',
      order: 1,
      accepted: true,
      notes: 'Pode bater à porta sob pretexto de pedir uma xícara de açúcar.',
    }
  );

  // Efeito para sincronizar selectedContact quando contacts mudar
  useEffect(() => {
    if (contacts.length > 0 && !contacts.some(c => c.id === selectedContact.id)) {
      setSelectedContact(contacts[0]);
    }
  }, [contacts, selectedContact.id]);

  // Efeito para alternar título do documento conforme a identidade White Label e o modo
  useEffect(() => {
    const titleEl = document.getElementById('app-dynamic-title');
    const faviconEl = document.getElementById('app-dynamic-favicon') as HTMLLinkElement | null;

    if (persona === 'colaboradora' && isCamouflageActive) {
      if (titleEl) titleEl.innerText = `${whiteLabel.appPublicName} — ${whiteLabel.companyName}`;
      if (faviconEl) faviconEl.href = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🏢</text></svg>';
    } else {
      if (titleEl) titleEl.innerText = 'Ampara — Rede de Proteção às Colaboradoras';
      if (faviconEl) faviconEl.href = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🛡️</text></svg>';
    }
  }, [persona, isCamouflageActive, whiteLabel]);

  const handleQuickExit = () => {
    setIsCamouflageActive(true);
  };

  const handleTriggerSilentSosFromDisguise = () => {
    const newAlert: SosAlert = {
      id: 'alert-' + Date.now(),
      active: true,
      startedAt: new Date().toISOString(),
      location: {
        lat: -23.561684,
        lng: -46.655981,
        accuracy: 10,
        addressDescription: 'Av. Paulista, 1200 - Bela Vista, São Paulo - SP',
      },
      currentStepIndex: 0,
      escalationTimerSeconds: 60,
      stepTimeoutSeconds: 60,
      responseStatus: 'pending',
      audioRecordings: [],
    };
    setActiveAlert(newAlert);
    storageService.saveActiveAlert(newAlert);

    setDisguiseFeedback('Sincronização corporativa confirmada');
    setTimeout(() => setDisguiseFeedback(undefined), 3500);
  };

  const handleSaveConfig = (cfg: UserSecurityConfig) => {
    setUserConfig(cfg);
    storageService.saveUserConfig(cfg);
  };

  const handleSaveWhiteLabel = (wl: WhiteLabelConfig) => {
    setWhiteLabel(wl);
    storageService.saveWhiteLabel(wl);
    const updatedUserConfig = { ...userConfig, whiteLabel: wl };
    setUserConfig(updatedUserConfig);
    storageService.saveUserConfig(updatedUserConfig);
  };

  const handleSaveContacts = (cts: TrustedContact[]) => {
    setContacts(cts);
    storageService.saveContacts(cts);
  };

  const handleUpdateAlert = (alt: SosAlert | null) => {
    setActiveAlert(alt);
    storageService.saveActiveAlert(alt);
  };

  const handleSimulateContactView = (contact: TrustedContact) => {
    setSelectedContact(contact);
    setPersona('contato');
  };

  // Simulação de resposta do contato
  const handleContactAccept = () => {
    if (activeAlert) {
      const updated: SosAlert = {
        ...activeAlert,
        responseStatus: 'in_route',
        respondedBy: selectedContact?.name || contacts[0]?.name || 'Contato de Confiança',
      };
      setActiveAlert(updated);
      storageService.saveActiveAlert(updated);
    }
  };

  const handleContactDecline = () => {
    if (activeAlert) {
      const nextIndex = activeAlert.currentStepIndex + 1;
      const updated: SosAlert = {
        ...activeAlert,
        currentStepIndex: nextIndex,
        escalationTimerSeconds: activeAlert.stepTimeoutSeconds,
        responseStatus: 'escalated',
      };
      setActiveAlert(updated);
      storageService.saveActiveAlert(updated);
    }
  };

  const currentActiveTargetContact = contacts[activeAlert?.currentStepIndex || 0] || selectedContact;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* BARRA SUPERIOR DE DEMONSTRAÇÃO E TROCA DE PERSONA */}
      <div className="bg-slate-900 text-white px-4 py-2 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 z-50 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-brand-600 flex items-center justify-center font-bold text-white text-xs">
            A
          </div>
          <span className="font-bold text-slate-200">
            Ampara <span className="text-[10px] text-slate-400 font-normal">| SaaS B2B White Label</span>
          </span>
          {activeAlert?.active && (
            <span className="inline-flex items-center gap-1 bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded-full font-bold text-[10px] animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              Alerta Ativo
            </span>
          )}
        </div>

        {/* Simulador de Personas & Alternador de Camuflagem */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setShowJourneyGuide(true)}
            className="px-2.5 py-1 rounded-lg font-bold text-[11px] bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-400/30 transition-all flex items-center gap-1"
            title="Como testar o fluxo de ponta a ponta"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Guia da Jornada (Como testar)</span>
          </button>

          {persona === 'colaboradora' && (
            <button
              onClick={() => setIsCamouflageActive(!isCamouflageActive)}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all flex items-center gap-1 border ${
                isCamouflageActive 
                  ? 'bg-amber-500/20 text-amber-300 border-amber-400/40 hover:bg-amber-500/30' 
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40 hover:bg-emerald-500/30'
              }`}
              title="Alternar entre a fachada corporativa White Label e a área segura Ampara"
            >
              {isCamouflageActive ? (
                <>
                  <EyeOff className="w-3 h-3" />
                  <span>Camuflado: {whiteLabel.appPublicName} (PIN 7788)</span>
                </>
              ) : (
                <>
                  <EyeOff className="w-3 h-3" />
                  <span>Modo Ampara (Clique p/ Camuflar)</span>
                </>
              )}
            </button>
          )}

          <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => { setPersona('colaboradora'); }}
              className={`px-3 py-1 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                persona === 'colaboradora' ? 'bg-brand-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Colaboradora</span>
            </button>

            <button
              onClick={() => setPersona('contato')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                persona === 'contato' ? 'bg-shield-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Contato de Confiança</span>
            </button>

            <button
              onClick={() => setPersona('rh')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                persona === 'rh' ? 'bg-slate-700 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Painel do RH (White Label)</span>
            </button>

            <button
              onClick={() => setPersona('transparencia')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                persona === 'transparencia' ? 'bg-slate-700 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Auditoria & LGPD</span>
            </button>
          </div>
        </div>
      </div>

      {/* TOAST / NOTIFICAÇÃO FLUTUANTE SIMULADA DE ALERTA CHEGANDO NO CELULAR DO CONTATO */}
      {activeAlert?.active && persona === 'colaboradora' && (
        <div 
          onClick={() => handleSimulateContactView(currentActiveTargetContact)}
          className="fixed top-12 right-4 max-w-sm bg-slate-900/95 text-white p-3.5 rounded-2xl shadow-2xl border border-rose-500/40 z-50 cursor-pointer hover:scale-102 transition-all animate-in slide-in-from-top-3 flex items-start gap-3 backdrop-blur-md"
        >
          <div className="w-8 h-8 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/40 animate-pulse">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div className="flex-1 text-xs space-y-0.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-rose-300 text-[11px] uppercase tracking-wider">SMS / WhatsApp Notificado</span>
              <span className="text-[10px] text-slate-400">Agora</span>
            </div>
            <p className="text-white font-medium text-[11px] leading-snug">
              Enviado para <strong>{currentActiveTargetContact.name}</strong> ({currentActiveTargetContact.phone}) com link, mapa e áudio.
            </p>
            <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 pt-1">
              <span>👉 Clique aqui para ver o celular do contato</span>
              <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      )}

      {/* MODAL DO GUIA DA JORNADA PASSO A PASSO */}
      {showJourneyGuide && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold">
                  🧭
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Como Testar a Jornada Completa</h3>
                  <p className="text-[11px] text-slate-500">Fluxo ponta a ponta do Ampara</p>
                </div>
              </div>
              <button
                onClick={() => setShowJourneyGuide(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm px-2 py-1 bg-slate-100 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <strong className="text-brand-700 block mb-1">Passo 1: Cadastrar Contato de Exemplo</strong>
                <p>Na aba <strong>Contatos</strong> da colaboradora, clique em <em>"+ Cadastrar"</em> e use o botão <em>"Preencher Exemplo"</em> para colocar seu nome e telefone.</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <strong className="text-rose-700 block mb-1">Passo 2: Acionar Apoio Silencioso (Gravação Local)</strong>
                <p>Na aba <strong>Apoio</strong>, toque no grande botão vermelho. O navegador solicitará permissão de microfone e começará a gravar o áudio local em tempo real.</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <strong className="text-shield-700 block mb-1">Passo 3: Simular o Celular do Contato Escolhido</strong>
                <p>Clique no pop-up ou na aba <strong>Contato de Confiança</strong>. Você verá a rota no Google Maps e poderá <strong>ouvir o áudio ambiente gravado pelo microfone</strong>.</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <strong className="text-emerald-700 block mb-1">Passo 4: Aceite e Cofre com Hash SHA-256</strong>
                <p>O contato clica em <em>"Estou a caminho!"</em>. A colaboradora vê a confirmação, clica em <em>"Estou em Segurança"</em> e o áudio é salvo no <strong>Cofre de Evidências</strong> com hash pericial.</p>
              </div>
            </div>

            <button
              onClick={() => setShowJourneyGuide(false)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs"
            >
              Entendido! Começar Teste
            </button>
          </div>
        </div>
      )}

      {/* ÁREA DE CONTEÚDO PRINCIPAL DE ACORDO COM A PERSONA */}
      <main className="flex-1 flex flex-col">
        {/* 1. PERSONA COLABORADORA */}
        {persona === 'colaboradora' && (
          isCamouflageActive ? (
            /* Modo Camuflado Corporativo White Label */
            <CamouflageApp
              userConfig={userConfig}
              whiteLabel={whiteLabel}
              onUnlockRealApp={() => setIsCamouflageActive(false)}
              onTriggerSilentSosFromDisguise={handleTriggerSilentSosFromDisguise}
              onSosTriggeredFeedback={disguiseFeedback}
            />
          ) : (
            /* Aplicativo Real Ampara */
            <div className="max-w-md w-full mx-auto bg-slate-50 min-h-screen shadow-xl border-x border-slate-200 flex flex-col">
              {/* Header do App Protegido Ampara */}
              <header className="bg-white px-4 py-3 border-b border-slate-200 sticky top-0 z-20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-shield-600 flex items-center justify-center text-white shadow-xs">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <h1 className="text-sm font-bold text-slate-800 leading-tight">Ampara</h1>
                    <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Rede Blindada & Privada
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsCamouflageActive(true)}
                    className="p-1.5 text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                    title={`Camuflar imediatamente como ${whiteLabel.appPublicName}`}
                  >
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Camuflar</span>
                  </button>

                  <QuickExitButton onQuickExit={handleQuickExit} />
                </div>
              </header>

              {/* Status do Alerta se estiver com resposta a caminho */}
              {activeAlert?.responseStatus === 'in_route' && (
                <div className="bg-emerald-600 text-white px-4 py-2.5 text-xs font-bold text-center flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Seu contato {activeAlert.respondedBy} confirmou que está a caminho!</span>
                </div>
              )}

              {/* Navegação por Abas do App Seguro Ampara */}
              <div className="bg-white border-b border-slate-200 px-2 flex justify-around text-xs">
                <button
                  onClick={() => setActiveTab('sos')}
                  className={`py-2.5 px-3 font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
                    activeTab === 'sos'
                      ? 'border-brand-600 text-brand-700'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Apoio</span>
                </button>

                <button
                  onClick={() => setActiveTab('contatos')}
                  className={`py-2.5 px-3 font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
                    activeTab === 'contatos'
                      ? 'border-brand-600 text-brand-700'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Contatos</span>
                </button>

                <button
                  onClick={() => setActiveTab('rede')}
                  className={`py-2.5 px-3 font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
                    activeTab === 'rede'
                      ? 'border-brand-600 text-brand-700'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Orientações</span>
                </button>

                <button
                  onClick={() => setActiveTab('evidencias')}
                  className={`py-2.5 px-3 font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
                    activeTab === 'evidencias'
                      ? 'border-brand-600 text-brand-700'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Cofre</span>
                </button>

                <button
                  onClick={() => setActiveTab('disfarce')}
                  className={`py-2.5 px-3 font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
                    activeTab === 'disfarce'
                      ? 'border-brand-600 text-brand-700'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Config</span>
                </button>
              </div>

              {/* Corpo da Aba Selecionada */}
              <div className="p-4 flex-1">
                {activeTab === 'sos' && (
                  <SosTrigger
                    userConfig={userConfig}
                    contacts={contacts}
                    partners={partners}
                    activeAlert={activeAlert}
                    onUpdateAlert={handleUpdateAlert}
                    onSimulateContactView={handleSimulateContactView}
                  />
                )}

                {activeTab === 'contatos' && (
                  <ContactsManager
                    contacts={contacts}
                    onSaveContacts={handleSaveContacts}
                    onSimulateContactView={handleSimulateContactView}
                  />
                )}

                {activeTab === 'rede' && <ProtectionNetwork />}

                {activeTab === 'evidencias' && <EvidenceVault />}

                {activeTab === 'disfarce' && (
                  <DisguiseSettings
                    userConfig={userConfig}
                    onSaveConfig={handleSaveConfig}
                  />
                )}
              </div>
            </div>
          )
        )}

        {/* 2. PERSONA CONTATO DE CONFIANÇA */}
        {persona === 'contato' && (
          <div className="p-4 sm:p-8">
            <ContactAlertView
              activeAlert={activeAlert}
              currentContact={selectedContact}
              allContacts={contacts}
              onSelectContact={(c) => setSelectedContact(c)}
              onAcceptHelp={handleContactAccept}
              onDeclineHelp={handleContactDecline}
            />
          </div>
        )}

        {/* 3. PERSONA RH / CORPORAÇÃO */}
        {persona === 'rh' && (
          <div className="p-4 sm:p-8">
            <CorporateDashboard 
              metrics={metrics}
              whiteLabel={whiteLabel}
              onSaveWhiteLabel={handleSaveWhiteLabel}
            />
          </div>
        )}

        {/* 4. AUDITORIA E LGPD */}
        {persona === 'transparencia' && (
          <div className="p-4 sm:p-8">
            <TransparencyAudit />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
