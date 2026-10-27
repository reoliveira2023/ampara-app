import React, { useState } from 'react';
import { PhoneCall, FileText, ChevronRight, AlertTriangle } from 'lucide-react';

export const ProtectionNetwork: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const emergencyNumbers = [
    {
      name: 'Ligue 180 - Central de Atendimento à Mulher',
      number: '180',
      description: 'Gratuito, 24 horas, em todo o Brasil. Orientações, registro de denúncias e acolhimento especializado.',
      highlight: true,
      color: 'bg-brand-50 border-brand-200 text-brand-900',
    },
    {
      name: '190 - Polícia Militar',
      number: '190',
      description: 'Em situação de emergência ou risco iminente à vida. Acionamento direto da viatura.',
      highlight: false,
      color: 'bg-rose-50 border-rose-200 text-rose-900',
    },
    {
      name: '192 - SAMU (Socorro Médico)',
      number: '192',
      description: 'Caso haja lesões corporais que necessitem de atendimento médico urgente.',
      highlight: false,
      color: 'bg-amber-50 border-amber-200 text-amber-900',
    },
  ];

  const guideTopics = [
    {
      id: 'medida-protetiva',
      title: 'Como funciona a Medida Protetiva de Urgência?',
      summary: 'Direito previsto pela Lei Maria da Penha (Lei 11.340/06).',
      details: [
        'Afastamento imediato do agressor do lar ou local de convivência.',
        'Proibição de aproximação física (distância mínima em metros) e contato por qualquer meio (ligações, mensagens, redes sociais).',
        'Pode ser solicitada na Delegacia da Mulher (DEAM) ou online no portal da Polícia Civil do seu estado, sem necessidade de advogado.',
        'O juiz deve analisar o pedido em até 48 horas após o recebimento.',
      ],
    },
    {
      id: 'casa-mulher',
      title: 'Casa da Mulher Brasileira e Centros de Referência (CRAM)',
      summary: 'Espaços integrados de acolhimento psicológico, social e jurídico.',
      details: [
        'Acolhimento e triagem com assistentes sociais e psicólogas especializadas.',
        'Apoio jurídico da Defensoria Pública para orientações de guarda, pensão e separação.',
        'Alojamento de passagem seguro para mulheres e filhos em situação de vulnerabilidade extrema.',
        'Autonomia econômica com cursos e programas de inserção no mercado.',
      ],
    },
    {
      id: 'apoio-psicologico',
      title: 'Acolhimento Psicológico Gratuito',
      summary: 'Clínicas-escola de universidades e ONGs parceiras.',
      details: [
        'O trauma da violência doméstica é complexo e não deve ser enfrentado sozinha.',
        'Diversas universidades federais e estaduais mantêm serviços de apoio psicológico aberto ao público.',
        'Centros de Referência de Assistência Social (CRAS / CREAS) oferecem acompanhamento continuado para a família.',
      ],
    },
  ];

  return (
    <div className="space-y-4">
      {/* Aviso Importante de Princípio */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-bold text-amber-900">Importante saber</h4>
          <p className="text-xs text-amber-800 leading-relaxed mt-0.5">
            O Ampara não substitui o trabalho da polícia ou dos serviços de socorro médico. Nosso objetivo é oferecer
            uma rede discreta de retirada rápida de risco e conectar você a quem pode ajudar.
          </p>
        </div>
      </div>

      {/* Canais Oficiais de Emergência */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
          <PhoneCall className="w-3.5 h-3.5 text-shield-600" />
          <span>Canais Oficiais de Atendimento</span>
        </h3>

        <div className="space-y-2.5">
          {emergencyNumbers.map((ch) => (
            <div key={ch.number} className={`p-3.5 rounded-xl border ${ch.color} flex items-center justify-between gap-3`}>
              <div className="flex-1">
                <h4 className="text-xs font-bold text-slate-900">{ch.name}</h4>
                <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">{ch.description}</p>
              </div>
              <a
                href={`tel:${ch.number}`}
                className="shrink-0 px-3 py-1.5 bg-slate-900 text-white font-bold text-xs rounded-lg hover:bg-slate-800 flex items-center gap-1.5 shadow-xs"
              >
                <PhoneCall className="w-3 h-3" />
                <span>Ligar {ch.number}</span>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Guias e Orientações Especializadas */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
          <FileText className="w-3.5 h-3.5 text-shield-600" />
          <span>Orientações Jurídicas e de Saúde</span>
        </h3>

        <div className="space-y-2">
          {guideTopics.map((topic) => {
            const isOpen = selectedTopic === topic.id;
            return (
              <div
                key={topic.id}
                className="border border-slate-200 rounded-xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setSelectedTopic(isOpen ? null : topic.id)}
                  className="w-full p-3 text-left bg-slate-50 hover:bg-slate-100 flex items-center justify-between transition-colors"
                >
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{topic.title}</h4>
                    <p className="text-[11px] text-slate-500">{topic.summary}</p>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      isOpen ? 'rotate-90 text-brand-600' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="p-3 bg-white border-t border-slate-100 text-xs text-slate-700 space-y-1.5">
                    {topic.details.map((detail, idx) => (
                      <p key={idx} className="flex items-start gap-2">
                        <span className="text-brand-500 font-bold">•</span>
                        <span>{detail}</span>
                      </p>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
