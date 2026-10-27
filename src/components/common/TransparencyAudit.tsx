import React from 'react';
import { Eye, EyeOff, FileCheck, Scale, Heart } from 'lucide-react';

export const TransparencyAudit: React.FC = () => {
  const comparisonList = [
    {
      item: 'Identidade e Nome da Colaboradora',
      rhSees: false,
      reason: 'A usuária se cadastra com chave cega. O RH nunca sabe quem ativou o aplicativo.',
    },
    {
      item: 'Gravações de Áudio e Evidências',
      rhSees: false,
      reason: 'Criptografia ponta a ponta gerada no próprio aparelho. Nem o RH nem os desenvolvedores têm a chave.',
    },
    {
      item: 'Localização GPS em Tempo Real',
      rhSees: false,
      reason: 'A geolocalização é transmitida exclusivamente para os contatos de confiança no momento do socorro.',
    },
    {
      item: 'Histórico de Acionamentos Individuais',
      rhSees: false,
      reason: 'O RH apenas vê totais gerais consolidados do mês (ex: 7 acionamentos em 184 usuárias).',
    },
    {
      item: 'Vínculo Empregatício e Permanência',
      rhSees: false,
      reason: 'Se a mulher for demitida ou pedir demissão, o app continua ativo e funcional sem custo para ela.',
    },
    {
      item: 'Customização White Label da Camuflagem',
      rhSees: true,
      reason: 'O RH define nome, cor e logo do portal institucional para aumentar a camuflagem no celular.',
    },
    {
      item: 'Volume Agregado de Licenças Ativas',
      rhSees: true,
      reason: 'O RH vê quantas licenças foram ativadas pela empresa (apenas se N >= 20 para evitar dedução).',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Manifesto */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-50 text-brand-700 text-xs font-bold rounded-full mb-3 border border-brand-200">
          <Heart className="w-3.5 h-3.5 text-brand-600" />
          <span>Privacidade por Construção (Privacy by Design)</span>
        </div>
        <h2 className="text-xl font-extrabold text-slate-900">
          Ampara — Carta Aberta de Transparência e Segurança
        </h2>
        <p className="text-xs text-slate-600 mt-2 leading-relaxed">
          O <strong>Ampara</strong> foi concebido sob uma premissa inegociável: <strong>a proteção à integridade da mulher é um direito inalienável</strong>.
          Não somos um canal de denúncia corporativa, não somos um sistema de compliance, e não fornecemos dados ao RH.
          O modelo White Label existe unicamente para proteger a colaboradora de invasores domésticos que fiscalizam o aparelho.
        </p>
      </div>

      {/* Tabela Comparativa de Auditoria */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Scale className="w-4 h-4 text-shield-600" />
          <span>Auditoria: O que a Empresa Vê vs O que NUNCA Vê</span>
        </h3>

        <div className="space-y-3">
          {comparisonList.map((row, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl border border-slate-200/70 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1 flex-1">
                <span className="text-xs font-bold text-slate-900">{row.item}</span>
                <p className="text-[11px] text-slate-500">{row.reason}</p>
              </div>

              <div className="shrink-0">
                {row.rhSees ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
                    <Eye className="w-3.5 h-3.5" />
                    <span>Configurável / Agregado</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Totalmente Oculto / Blindado</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Conformidade LGPD & RIPD */}
      <div className="bg-shield-50 border border-shield-200 rounded-3xl p-6 space-y-3">
        <div className="flex items-center gap-2 text-shield-900 font-bold text-sm">
          <FileCheck className="w-4 h-4 text-shield-700" />
          <span>Conformidade com a LGPD (Lei nº 13.709/2018)</span>
        </div>
        <p className="text-xs text-shield-800 leading-relaxed">
          Dados de localização e gravações de áudio são enquadrados como dados sensíveis. O sistema opera com base no
          consentimento inequívoco e na proteção da vida e da integridade física do titular (Art. 7º, VII e Art. 11, II, 'e' da LGPD).
          A usuária possui direito de exclusão imediata e irrestrita de qualquer registro gerado em seu cofre local a qualquer momento.
        </p>
      </div>
    </div>
  );
};
