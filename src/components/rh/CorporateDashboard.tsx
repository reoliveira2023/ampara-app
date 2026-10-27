import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Key, 
  EyeOff, 
  Download, 
  Calendar,
  Lock,
  Palette,
  Check,
  Smartphone
} from 'lucide-react';
import type { CorporateMetrics, WhiteLabelConfig } from '../../types';
import { generateSecureToken } from '../../services/crypto';

interface CorporateDashboardProps {
  metrics: CorporateMetrics;
  whiteLabel: WhiteLabelConfig;
  onSaveWhiteLabel: (wl: WhiteLabelConfig) => void;
}

export const CorporateDashboard: React.FC<CorporateDashboardProps> = ({ 
  metrics,
  whiteLabel,
  onSaveWhiteLabel
}) => {
  const [activeUsersCount, setActiveUsersCount] = useState<number>(metrics.activeLicensesCount);
  const [generatedTokens, setGeneratedTokens] = useState<string[]>([
    'AMP-LIC-88219-A',
    'AMP-LIC-44910-B',
    'AMP-LIC-90123-C',
    'AMP-LIC-11984-D',
  ]);

  // Estados locais da customização White Label
  const [companyName, setCompanyName] = useState(whiteLabel.companyName);
  const [appPublicName, setAppPublicName] = useState(whiteLabel.appPublicName);
  const [brandColor, setBrandColor] = useState(whiteLabel.brandColor);
  const [logoIcon, setLogoIcon] = useState(whiteLabel.logoIcon);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const isAboveThreshold = activeUsersCount >= metrics.kAnonymityThreshold;

  const colorPresets = [
    { label: 'Azul Corporativo', value: '#1e3a8a' },
    { label: 'Verde Floresta (ESG)', value: '#065f46' },
    { label: 'Roxo Moderno', value: '#581c87' },
    { label: 'Grafite Elegante', value: '#1f2937' },
    { label: 'Vinho / Grená', value: '#831843' },
  ];

  const handleApplyWhiteLabel = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: WhiteLabelConfig = {
      ...whiteLabel,
      companyName,
      appPublicName,
      brandColor,
      logoIcon,
    };
    onSaveWhiteLabel(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleGenerateBatch = () => {
    const fresh: string[] = [];
    for (let i = 0; i < 5; i++) {
      fresh.push(generateSecureToken('AMP-LIC'));
    }
    setGeneratedTokens([...fresh, ...generatedTokens]);
  };

  const downloadTokensCsv = () => {
    const csvContent = 'data:text/csv;charset=utf-8,Codigo_Token_Anonimo_Ativacao,Validade,Status\n' +
      generatedTokens.map(t => `${t},12 Meses,Elegivel`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'tokens_anonimos_ampara.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Corporativo B2B */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-shield-50 text-shield-700 text-xs font-bold rounded-full mb-2 border border-shield-200">
            <ShieldCheck className="w-3.5 h-3.5 text-shield-600" />
            <span>Programa Corporativo de Proteção à Mulher — Ampara B2B</span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900">
            Painel do RH — {companyName}
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-lg">
            Personalização White Label para camuflagem total no celular e governança com privacidade por design.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-2.5 text-center">
            <span className="text-[10px] uppercase font-bold text-emerald-700 block">Status do Contrato</span>
            <span className="text-sm font-bold text-emerald-900">Assinatura Anual Ativa</span>
          </div>
        </div>
      </div>

      {/* MÓDULO EXCLUSIVO WHITE LABEL (Personalização da Camuflagem Corporativa) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Palette className="w-4 h-4 text-brand-600" />
              <span>Configuração White Label da Empresa (Camuflagem Corporativa)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Personalize o nome, cores e logo do app. No celular da colaboradora, ele parecerá o app oficial de benefícios e holerite da sua empresa.
            </p>
          </div>
          {saveSuccess && (
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              Identidade atualizada!
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Formulário de Customização */}
          <form onSubmit={handleApplyWhiteLabel} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Razão Social ou Nome Fantasia da Empresa
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-800"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Nome de Fachada do Aplicativo (Como aparece no celular dela)
              </label>
              <input
                type="text"
                value={appPublicName}
                onChange={(e) => setAppPublicName(e.target.value)}
                placeholder="Ex: TechCorp Conecta, Portal Sou Vale, Gente & Gestão"
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-800"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Sugestão: Use nomes neutros relacionados a trabalho ou benefícios (ex: "Portal do Colaborador").
              </span>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Cor Primária Corporativa
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                {colorPresets.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => setBrandColor(preset.value)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all ${
                      brandColor === preset.value
                        ? 'border-slate-800 bg-slate-100 shadow-2xs font-bold text-slate-900'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: preset.value }} />
                    <span>{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Ícone do Logotipo Corporativo
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'building', label: 'Prédio' },
                  { id: 'briefcase', label: 'Maleta' },
                  { id: 'layers', label: 'Plataforma' },
                  { id: 'sparkles', label: 'Inovação' },
                ].map((iconOption) => (
                  <button
                    key={iconOption.id}
                    type="button"
                    onClick={() => setLogoIcon(iconOption.id)}
                    className={`py-2 px-1 text-center rounded-xl text-xs font-medium border transition-all ${
                      logoIcon === iconOption.id
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {iconOption.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-98"
            >
              Salvar e Atualizar White Label no App
            </button>
          </form>

          {/* Prévia em Tempo Real da Fachada (Mockup do Smartphone) */}
          <div className="bg-slate-100 p-4 rounded-3xl border border-slate-200">
            <div className="flex items-center justify-between mb-3 text-xs text-slate-500 font-semibold">
              <span className="flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-slate-700" />
                <span>Prévia no Celular da Colaboradora:</span>
              </span>
              <span className="text-[10px] bg-white px-2 py-0.5 rounded-full border border-slate-200">
                100% Camuflado
              </span>
            </div>

            {/* Simulação da moldura mobile */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-slate-300 max-w-xs mx-auto">
              <div 
                style={{ backgroundColor: brandColor }}
                className="p-3 text-white flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center font-bold text-xs">
                    🏢
                  </div>
                  <div>
                    <h5 className="text-xs font-bold leading-tight">{appPublicName}</h5>
                    <p className="text-[9px] text-white/80">{companyName}</p>
                  </div>
                </div>
                <span className="text-[10px] opacity-75">14:32</span>
              </div>

              <div className="p-3 space-y-2 text-xs">
                <div className="flex justify-around border-b pb-2 text-[10px] text-slate-500 font-bold">
                  <span className="text-slate-900 border-b-2 border-slate-900 pb-1">Holerite</span>
                  <span>Benefícios</span>
                  <span>Ponto</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-[10px] space-y-1">
                  <div className="flex justify-between font-bold text-slate-800">
                    <span>Holerite Outubro/2026</span>
                    <span className="text-emerald-600">R$ 4.599,80</span>
                  </div>
                  <p className="text-slate-400 text-[9px]">Comprovante de pagamento disponível</p>
                </div>
                <p className="text-[9px] text-slate-400 text-center pt-1 italic">
                  Se o agressor olhar o celular, ele só vê este portal de holerite corporativo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SELO INEGOCIÁVEL DE AUDITORIA & PRIVACIDADE */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-5 shadow-lg relative overflow-hidden">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
            <Lock className="w-5 h-5 text-shield-300" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-sm font-bold flex items-center gap-2 text-white">
              <span>Blindagem de Dados e Princípio Inegociável</span>
              <span className="text-[10px] font-semibold bg-brand-500/30 text-brand-200 px-2 py-0.5 rounded-full border border-brand-400/30">
                Auditado por Design
              </span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
              Por imposição arquitetural e contratual, <strong>o RH nunca tem acesso</strong> a nomes de colaboradoras que ativaram,
              áudios gravados, geolocalização ou ocorrências individuais. O RH tem acesso estritamente a números agregados e anônimos.
            </p>
          </div>
        </div>
      </div>

      {/* CONTROLE DE SIMULAÇÃO DO K-ANONYMITY (N >= 20) */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-shield-50 text-shield-700 flex items-center justify-center font-bold text-xs border border-shield-200">
            K
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800">
              Regra de Anonimização Mínima (K-Anonymity)
            </h4>
            <p className="text-[11px] text-slate-500">
              Métricas detalhadas só abrem com no mínimo 20 usuárias ativas (evita deduzir quem é a colaboradora).
            </p>
          </div>
        </div>

        {/* Simulador interativo do limite */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Simular usuárias ativas:</span>
          <button
            onClick={() => setActiveUsersCount(12)}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-all ${
              activeUsersCount === 12
                ? 'bg-rose-500 text-white border-rose-600'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            12 (Bloqueia)
          </button>
          <button
            onClick={() => setActiveUsersCount(184)}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-all ${
              activeUsersCount === 184
                ? 'bg-emerald-600 text-white border-emerald-700'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            184 (Libera)
          </button>
        </div>
      </div>

      {/* BLOCO DE MÉTRICAS AGREGADAS (COM VERIFICAÇÃO K-ANONYMITY) */}
      {isAboveThreshold ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-400 block mb-1">Licenças Contratadas</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-slate-900">{metrics.totalLicensesPurchased}</span>
              <span className="text-xs text-slate-500">vagas</span>
            </div>
            <span className="text-[10px] text-emerald-600 font-medium mt-1 block">
              100% financiadas pela empresa
            </span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-400 block mb-1">Colaboradoras Ativas</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-brand-600">{activeUsersCount}</span>
              <span className="text-xs text-slate-500">({Math.round((activeUsersCount / metrics.totalLicensesPurchased) * 100)}% de adesão)</span>
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">
              Tokens ativados de forma anônima
            </span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-400 block mb-1">Redes de Apoio Prontas</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-shield-700">{metrics.contactsConfiguredPercent}%</span>
              <span className="text-xs text-slate-500">com contatos</span>
            </div>
            <span className="text-[10px] text-emerald-600 font-medium mt-1 block">
              Média de 2.4 contatos por usuária
            </span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-400 block mb-1">Tempo Médio de Resposta</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-slate-900">{metrics.averageResponseTimeSeconds}</span>
              <span className="text-xs text-slate-500">segundos</span>
            </div>
            <span className="text-[10px] text-emerald-600 font-medium mt-1 block">
              98% resolvidos no 1º contato
            </span>
          </div>
        </div>
      ) : (
        /* AVISO DE K-ANONYMITY BLOQUEADO */
        <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-8 text-center space-y-3">
          <div className="w-14 h-14 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto">
            <EyeOff className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-amber-950">
            Métricas Ocultas por Diretriz de Privacidade
          </h3>
          <p className="text-xs text-amber-900 max-w-md mx-auto leading-relaxed">
            O número de colaboradoras ativas ({activeUsersCount}) está abaixo da régua mínima de <strong>20 colaboradoras</strong>.
            Para proteger a identidade das colaboradoras e evitar reidentificação cruzada por amostragem pequena,
            os gráficos estatísticos ficam bloqueados até atingir o quorum mínimo.
          </p>
        </div>
      )}

      {/* GESTÃO DE TOKENS ANÔNIMOS PARA DISTRIBUIÇÃO */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Key className="w-4 h-4 text-shield-600" />
              <span>Geração de Tokens Cegos de Convite (Distribuição Anônima)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Envie estes códigos aos canais de comunicação interna (SIPAT, intranet). A usuária digita o código e ativa a conta sem vincular e-mail.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleGenerateBatch}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-all shadow-xs"
            >
              + Gerar Mais Tokens
            </button>
            <button
              onClick={downloadTokensCsv}
              className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar CSV</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
          {generatedTokens.slice(0, 8).map((tok, idx) => (
            <div key={idx} className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-mono text-xs text-center text-slate-700 select-all">
              {tok}
            </div>
          ))}
        </div>
      </div>

      {/* PACOTE DE AÇÕES EDUCATIVAS & SIPAT (ESG) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-brand-600" />
            <span>Pacote Educacional e Ações de Conscientização (SIPAT)</span>
          </h3>
          <span className="text-xs font-semibold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full">
            Incluso no Plano Corporativo Ampara
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
            <span className="font-bold text-slate-800 block">1. Cartilha para Homens e Líderes</span>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Como identificar sinais precoces de relacionamento abusivo e o papel dos homens no combate à violência.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
            <span className="font-bold text-slate-800 block">2. Divulgação Segura em SIPAT</span>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Material de apoio para apresentar o app como benefício de saúde e bem-estar, sem expor as colaboradoras.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
            <span className="font-bold text-slate-800 block">3. Relatório ESG e Certificação</span>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Evidência de cumprimento dos critérios ESG (GRI 403 e ODS 5 - Igualdade de Gênero) para acionistas e auditorias.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
